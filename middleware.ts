import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase-admin';

// Paths that require authentication
const authPaths = [
  '/cart',
  '/orders',
  '/profile',
  '/checkout',
];

// Paths that require admin access
const adminPaths = [
  '/admin',
];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('session')?.value;
  const pathname = request.nextUrl.pathname;

  // Check if path requires authentication
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));
  const isAdminPath = adminPaths.some(path => pathname.startsWith(path));

  try {
    if (!token && (isAuthPath || isAdminPath)) {
      // Redirect to login if no token and path requires auth
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('from', pathname);
      return NextResponse.redirect(url);
    }

    if (token) {
      // Verify token and get user claims
      const decodedToken = await auth.verifySessionCookie(token);
      const { admin } = decodedToken;

      // Check admin access
      if (isAdminPath && !admin) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Add user info to headers for API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-user-id', decodedToken.uid);
      if (admin) {
        requestHeaders.set('x-user-role', 'admin');
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    return NextResponse.next();
  } catch (error) {
    // If token verification fails, clear the cookie and redirect to login
    if (isAuthPath || isAdminPath) {
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.delete('session');
      return response;
    }

    return NextResponse.next();
  }
}

// Configure paths that should be checked by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 