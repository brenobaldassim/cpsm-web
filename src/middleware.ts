/**
 * Next.js Middleware
 *
 * Protects routes requiring authentication.
 * Redirects unauthenticated users to the login page.
 * Implements rate limiting per IP address.
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Rate limiting configuration
 */
const RATE_LIMIT = 30 // per IP per minute
const accessLog = new Map<string, number[]>()
const TIME_IN_MS = {
  ONE_MINUTE: 60000,
  TWO_MINUTES: 120000,
} as const

/**
 * Cleanup old entries from accessLog to prevent memory leaks
 * Runs periodically to remove IPs that haven't made requests recently
 */
function cleanupAccessLog() {
  const now = Date.now()
  const threshold = TIME_IN_MS.ONE_MINUTE

  for (const [ip, timestamps] of accessLog.entries()) {
    const recent = timestamps.filter((t) => now - t < threshold)
    if (recent.length === 0) {
      // No recent requests from this IP, remove it
      accessLog.delete(ip)
    } else {
      // Update with only recent timestamps
      accessLog.set(ip, recent)
    }
  }
}

// Run cleanup every 2 minutes
setInterval(cleanupAccessLog, TIME_IN_MS.TWO_MINUTES)

/**
 * Public routes that don't require authentication
 */
const PUBLIC_ROUTES = ['/login', '/signup', '/api/auth']

/**
 * Routes that should redirect to dashboard if already authenticated
 */
const AUTH_ROUTES = ['/login', '/signup']

/**
 * Middleware function
 * Runs on every request to check rate limiting and authentication status
 */
export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate limiting check
  const ip =
    request.headers.get('x-forwarded-for') ??
    request.headers.get('x-real-ip') ??
    'unknown'
  const now = Date.now()

  const log = accessLog.get(ip) || []
  const recent = log.filter((t) => now - t < TIME_IN_MS.ONE_MINUTE)

  if (recent.length >= RATE_LIMIT) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  recent.push(now)
  accessLog.set(ip, recent)

  // Allow all API routes (handled by their own middleware)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Allow public assets and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Check for NextAuth session token in cookies
  const sessionToken =
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value

  const isAuthenticated = !!sessionToken

  // Check if current route is public
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  // Check if current route is an auth route (login/signup)
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  // If user is authenticated and trying to access auth routes (login/signup)
  // redirect them to the dashboard
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is not authenticated and trying to access a protected route
  // redirect them to login
  if (!isAuthenticated && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url)
    // Add callback URL to redirect back after login
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Allow the request to proceed
  return NextResponse.next()
}

/**
 * Configure which routes middleware should run on
 * We want it to run on all routes except static files and API routes
 */
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
}
