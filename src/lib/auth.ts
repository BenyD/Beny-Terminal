import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);
const ALGORITHM = 'HS256';

export async function createToken(payload: { username: string }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
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

  if (!envUsername || !envPassword) {
    throw new Error('Admin credentials not configured');
  }

  if (username === envUsername && password === envPassword) {
    const token = await createToken({ username });
    return { success: true, token };
  }

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
    if (request.nextUrl.pathname.startsWith('/assets')) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  const payload = await verifyToken(token);

  if (!payload && request.nextUrl.pathname.startsWith('/assets')) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
