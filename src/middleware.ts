import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The custom admin path — driven by env var so it can be changed without code edits
const ADMIN_PATH = process.env.NEXT_PUBLIC_ADMIN_PATH || 'sanctuary-g8';

// Common default admin paths that bots and attackers try — all silently redirected to home.
// NOTE: Firebase Auth stores its token in localStorage (client-side only), so server-side
// session verification is not possible in middleware without a custom cookie strategy.
// Authentication for the real admin route is handled by (protected)/layout.tsx on the client.
const BLOCKED_PATHS = [
  '/admin',
  '/login',
  '/dashboard',
  '/wp-admin',
  '/wp-login.php',
  '/administrator',
  '/admin-portal-xyz',
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
  // These are decoy/attack paths — redirect everything matching them to home.
  const isBlocked = BLOCKED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/')
  );
  if (isBlocked) {
    return NextResponse.redirect(new URL('/', request.url), { status: 302 });
  }

  // ── 2. The real admin route (/${ADMIN_PATH} and sub-routes) passes through ─
  // Authentication is handled client-side by (protected)/layout.tsx which uses
  // Firebase onAuthStateChanged — the correct approach for Firebase Auth.
  // If the user is not signed in, the layout redirects them back to /${ADMIN_PATH}.

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
