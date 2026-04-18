import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/session';

export async function POST() {
  const baseUrl = process.env.BFF_BASE_URL || 'http://localhost:3000';
  const response = NextResponse.redirect(`${baseUrl}/`);
  
  await clearSessionCookie(response);

  return response;
}

// Support GET for simple links if needed, though POST is standard
export async function GET() {
  return POST();
}
