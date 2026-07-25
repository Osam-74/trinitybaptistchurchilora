import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The custom admin path — driven by env var so it can be changed without code edits
const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || 'sanctuary-g8';

// Common default admin paths that bots and attackers try — all redirected to home
const BLOCKED_PATHS = [
  '/admin',
  '/admin/',
  '/login',
  '/dashboard',
  '/wp-admin',
  '/wp-login.php',
  '/administrator',
  '/admin-portal-xyz',   // old route — now obscured
  '/cms',
  '/panel',
  '/cpanel',
  '/control',
  '/manage',
  '/backend',
  '/admin-login',
  '/adminpanel',
  '/adminarea',
  '/siteadmin',
  '/webadmin',
  '/moderator',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Block common admin paths ──────────────────────────────────────────
  const isBlocked = BLOCKED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
  if (isBlocked) {
    return NextResponse.redirect(new URL('/', request.url), { status: 302 });
  }

  // ── 2. Protect the real admin route ──────────────────────────────────────
  if (pathname.startsWith(`/${ADMIN_PATH}/`)) {
    // The login page itself (/${ADMIN_PATH}) is publicly reachable so the
    // sign-in form can render. Only sub-routes (protected pages) need a check.
    const sessionCookie =
      request.cookies.get('__session')?.value ||          // Firebase Auth session
      request.cookies.get('firebase-session')?.value ||   // fallback name
      request.cookies.get('auth')?.value;                 // any custom cookie

    if (!sessionCookie) {
      // Not authenticated — send to home silently (don't reveal the admin URL)
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl, { status: 302 });
    }
  }

  // ── 3. All other routes pass through untouched ────────────────────────────
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image  (image optimisation)
     * - favicon.ico, site icons, logos, public assets
     * - /api/* routes (public booking API, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|icon-|apple-touch|logo/|images/|.*\\.(?:png|jpg|jpeg|svg|webp|ico|json|xml|txt)).*)',
  ],
};
