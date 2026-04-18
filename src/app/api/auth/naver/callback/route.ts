import { NextRequest, NextResponse } from 'next/server';
import { callApiGateway } from '@/lib/api-gateway';
import { createSession, setSessionCookie } from '@/lib/session';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const savedState = request.cookies.get('naver_oauth_state')?.value;

  // 1. Verify CSRF state
  if (!state || state !== savedState) {
    return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  try {
    // 2. Exchange code for memberId via microservice-member
    const authResponse = await callApiGateway('/api/v1/auth/oauth/naver', {
      method: 'POST',
      body: JSON.stringify({ code, state }),
    });

    if (!authResponse.ok) {
      const errorData = await authResponse.json();
      return NextResponse.json(errorData, { status: authResponse.status });
    }

    const { memberId } = await authResponse.json();

    // 3. Create session JWT
    const token = await createSession(memberId);

    // 4. Set session cookie and redirect to home
    const baseUrl = process.env.BFF_BASE_URL || 'http://localhost:3000';
    const response = NextResponse.redirect(`${baseUrl}/`);
    
    await setSessionCookie(response, token);
    
    // Clean up temporary state cookie
    response.cookies.delete('naver_oauth_state');

    return response;
  } catch (error) {
    console.error('OAuth callback failed:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}
