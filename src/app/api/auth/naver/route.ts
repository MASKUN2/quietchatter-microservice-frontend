import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
  const baseUrl = process.env.BFF_BASE_URL || 'http://localhost:3000';
  const redirectUri = encodeURIComponent(`${baseUrl}/api/auth/naver/callback`);
  const state = crypto.randomUUID();

  const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}`;

  const response = NextResponse.redirect(naverAuthUrl);
  
  // Store state in a temporary cookie for CSRF verification in callback
  response.cookies.set({
    name: 'naver_oauth_state',
    value: state,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 600, // 10 minutes
  });

  return response;
}
