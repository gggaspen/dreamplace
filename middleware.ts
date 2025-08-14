import { NextRequest, NextResponse } from 'next/server';
import { SecurityHeaders, createSecurityConfig } from '@/infrastructure/security/SecurityHeaders';
import { rateLimiter } from '@/infrastructure/security/RateLimiter';
import { createJWTManager } from '@/infrastructure/security/JWTManager';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Apply rate limiting
  const rateLimitResponse = await applyRateLimiting(req);
  if (rateLimitResponse) return rateLimitResponse;

  // Apply authentication middleware to protected routes
  const authResponse = await applyAuthMiddleware(req);
  if (authResponse) return authResponse;

  const res = NextResponse.next();

  // Get client IP
  const clientIp = getClientIP(req);

  // Set proxy headers
  res.headers.set('X-Forwarded-For', clientIp);
  res.headers.set('X-Real-IP', clientIp);

  // Apply comprehensive security headers
  const securityConfig = createSecurityConfig(
    (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'production',
    {
      nonce: generateNonce(),
      reportUri: process.env.CSP_REPORT_URI,
    }
  );

  const securityHeaders = new SecurityHeaders(securityConfig);
  const headers = securityHeaders.getAllHeaders();

  Object.entries(headers).forEach(([key, value]) => {
    res.headers.set(key, value);
  });

  // Configure CORS for API routes
  if (pathname.startsWith('/api/')) {
    res.headers.set(
      'Access-Control-Allow-Origin',
      process.env.CORS_ORIGIN || 'https://dreamplace.com.ar'
    );
    res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, X-Requested-With'
    );
    res.headers.set('Access-Control-Allow-Credentials', 'true');
  }

  // Cache control based on route type
  if (pathname.startsWith('/api/')) {
    res.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  } else if (pathname.startsWith('/_next/') || pathname.includes('.')) {
    res.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  } else {
    res.headers.set('Cache-Control', 'public, max-age=3600, must-revalidate');
  }

  return res;
}

/**
 * Apply rate limiting to requests
 */
async function applyRateLimiting(req: NextRequest): Promise<NextResponse | null> {
  const { pathname } = req.nextUrl;
  const clientIp = getClientIP(req);

  // Determine rate limit rule based on path
  let ruleId = 'api-general';

  if (pathname.startsWith('/api/auth/login')) {
    ruleId = 'auth-login';
  } else if (pathname.startsWith('/api/auth/register')) {
    ruleId = 'auth-register';
  } else if (pathname.startsWith('/api/auth/reset-password')) {
    ruleId = 'password-reset';
  } else if (pathname.startsWith('/api/upload')) {
    ruleId = 'api-upload';
  } else if (pathname.startsWith('/api/contact')) {
    ruleId = 'contact-form';
  } else if (pathname.startsWith('/api/search')) {
    ruleId = 'search';
  }

  const result = rateLimiter.checkLimit(ruleId, clientIp);

  if (!result.allowed) {
    const response = NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Rate limit exceeded',
        retryAfter: result.retryAfter,
      },
      { status: 429 }
    );

    // Set rate limit headers
    response.headers.set('X-RateLimit-Limit', result.limit.toString());
    response.headers.set('X-RateLimit-Remaining', '0');
    response.headers.set('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000).toString());

    if (result.retryAfter) {
      response.headers.set('Retry-After', result.retryAfter.toString());
    }

    return response;
  }

  return null;
}

/**
 * Apply authentication middleware for protected routes
 */
async function applyAuthMiddleware(req: NextRequest): Promise<NextResponse | null> {
  const { pathname } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/admin', '/profile'];
  const adminRoutes = ['/admin'];
  const publicRoutes = ['/login', '/register', '/forgot-password'];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  // Get authentication token from cookie
  const accessToken = req.cookies.get('access-token')?.value;
  const refreshToken = req.cookies.get('refresh-token')?.value;

  if (isProtectedRoute || isAdminRoute) {
    if (!accessToken) {
      // No access token, redirect to login
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify access token
      const jwtManager = createJWTManager();
      const userClaims = await jwtManager.verifyAccessToken(accessToken);

      if (!userClaims) {
        // Invalid access token, try to refresh
        if (refreshToken) {
          // This would require additional user data from storage
          // For now, redirect to login
          const loginUrl = new URL('/login', req.url);
          loginUrl.searchParams.set('redirect', pathname);
          return NextResponse.redirect(loginUrl);
        }

        // No valid tokens, redirect to login
        const loginUrl = new URL('/login', req.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Check admin routes
      if (isAdminRoute && userClaims.role !== 'admin') {
        // Not admin, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } catch (error) {
      console.error('Authentication error:', error);
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Handle public routes when authenticated
  if (isPublicRoute && accessToken) {
    try {
      const jwtManager = createJWTManager();
      const userClaims = await jwtManager.verifyAccessToken(accessToken);

      if (userClaims) {
        // Already authenticated, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    } catch {
      // Invalid token, allow access to public routes
    }
  }

  return null;
}

/**
 * Get client IP address from request
 */
function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('cf-connecting-ip') || // Cloudflare
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || // Load balancer
    req.headers.get('x-real-ip') || // Direct proxy
    req.ip ||
    'unknown'
  );
}

/**
 * Generate a nonce for CSP
 */
function generateNonce(): string {
  const array = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Fallback for environments without crypto.getRandomValues
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Configure which routes should be processed by middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|img|icons).*)',
  ],
};
