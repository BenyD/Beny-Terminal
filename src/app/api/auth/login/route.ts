import { NextRequest, NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('Login API called');
    const { username, password } = await request.json();
    console.log('Login request data:', { username, hasPassword: !!password });

    if (!username || !password) {
      console.log('Missing username or password');
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    console.log('Calling login function...');
    const result = await login(username, password);
    console.log('Login result:', {
      success: result.success,
      hasToken: !!result.token,
      error: result.error,
    });

    if (result.success && result.token) {
      console.log('Login successful, setting cookie');
      const response = NextResponse.json({ success: true });
      response.cookies.set('auth-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        domain: process.env.NODE_ENV === 'production' ? '.beny.one' : undefined, // Only set domain in production
        maxAge: 24 * 60 * 60, // 24 hours
      });
      return response;
    } else {
      console.log('Login failed:', result.error);
      return NextResponse.json({ error: result.error }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
