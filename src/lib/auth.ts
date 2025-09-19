import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);
const ALGORITHM = 'HS256';

// Debug JWT secret loading
console.log('JWT Secret loaded:', {
  hasSecret: !!process.env.JWT_SECRET,
  secretLength: process.env.JWT_SECRET?.length || 0,
  usingDefault: !process.env.JWT_SECRET,
});

export async function createToken(payload: { username: string }) {
  try {
    console.log('Creating JWT token for:', payload.username);
    const token = await new SignJWT(payload)
      .setProtectedHeader({ alg: ALGORITHM })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret);
    console.log('JWT token created successfully');
    return token;
  } catch (error) {
    console.error('Error creating JWT token:', error);
    throw error;
  }
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [ALGORITHM],
    });
    return payload;
  } catch {
    return null;
  }
}

export async function login(username: string, password: string) {
  const envUsername = process.env.ADMIN_USERNAME;
  const envPassword = process.env.ADMIN_PASSWORD;

  // Debug logging (remove in production)
  console.log('Login attempt:', {
    username,
    hasEnvUsername: !!envUsername,
    hasEnvPassword: !!envPassword,
    envUsername: envUsername ? '***' : 'undefined',
  });

  if (!envUsername || !envPassword) {
    console.error('Admin credentials not configured:', {
      hasUsername: !!envUsername,
      hasPassword: !!envPassword,
    });
    throw new Error('Admin credentials not configured');
  }

  if (username === envUsername && password === envPassword) {
    const token = await createToken({ username });
    return { success: true, token };
  }

  console.log('Invalid credentials:', {
    usernameMatch: username === envUsername,
    passwordMatch: password === envPassword,
  });
  return { success: false, error: 'Invalid credentials' };
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  const payload = await verifyToken(token);
  return payload ? { username: payload.username } : null;
}

export async function updateSession(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    if (
      request.nextUrl.pathname.startsWith('/assets') ||
      request.nextUrl.hostname === 'assets.beny.one'
    ) {
      // Redirect to main domain login page
      const loginUrl = new URL('/login', 'https://terminal.beny.one');
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  const payload = await verifyToken(token);

  if (
    !payload &&
    (request.nextUrl.pathname.startsWith('/assets') ||
      request.nextUrl.hostname === 'assets.beny.one')
  ) {
    // Redirect to main domain login page
    const loginUrl = new URL('/login', 'https://terminal.beny.one');
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
