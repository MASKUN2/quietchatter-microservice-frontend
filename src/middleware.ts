import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session';

const PROTECTED_ROUTES = ['/my'];
const AUTH_COOKIE_NAME = 'qc_session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current route is protected
  const isProtectedPath = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (isProtectedPath) {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const session = token ? await verifySession(token) : null;

    if (!session) {
      const baseUrl = process.env.BFF_BASE_URL || 'http://localhost:3000';
      return NextResponse.redirect(`${baseUrl}/api/auth/naver`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
