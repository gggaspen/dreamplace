/**
 * Authentication Logout Endpoint
 * Securely handles user logout and token invalidation
 */

import { NextRequest, NextResponse } from 'next/server';
import { createJWTManager } from '@/infrastructure/security/JWTManager';

interface LogoutResponse {
  success: boolean;
  message: string;
}

/**
 * Handle user logout
 */
async function handleLogout(req: NextRequest): Promise<NextResponse> {
  try {
    // Get tokens from cookies
    const accessToken = req.cookies.get('access-token')?.value;
    const refreshToken = req.cookies.get('refresh-token')?.value;

    // Verify tokens to get user information for session invalidation
    if (accessToken || refreshToken) {
      const jwtManager = createJWTManager();
      
      try {
        // Get user claims to invalidate session
        let userClaims = null;
        
        if (accessToken) {
          userClaims = await jwtManager.verifyAccessToken(accessToken);
        } else if (refreshToken) {
          const refreshPayload = await jwtManager.verifyRefreshToken(refreshToken);
          if (refreshPayload) {
            // In a real application, you would fetch user data here
            // userClaims = await getUserById(refreshPayload.userId);
          }
        }

        // TODO: Invalidate session in database/cache
        if (userClaims?.sessionId) {
          await invalidateSession(userClaims.sessionId);
        }

      } catch (error) {
        // Token verification failed, but we still want to clear cookies
        console.warn('Token verification failed during logout:', error);
      }
    }

    // Create response
    const response = NextResponse.json<LogoutResponse>({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear all authentication cookies
    const secure = process.env.NODE_ENV === 'production';

    response.cookies.set('access-token', '', {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    response.cookies.set('refresh-token', '', {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    response.cookies.set('user-role', '', {
      httpOnly: false,
      secure,
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Invalidate user session
 * In a real application, this would remove the session from database/cache
 */
async function invalidateSession(sessionId: string): Promise<void> {
  try {
    // TODO: Implement session invalidation
    // Examples:
    // - Remove from Redis cache
    // - Mark as invalid in database
    // - Add to blacklist
    
    console.log(`Session invalidated: ${sessionId}`);
    
    // Mock implementation
    // await redis.del(`session:${sessionId}`);
    // await db.sessions.update({ where: { id: sessionId }, data: { isValid: false } });
    
  } catch (error) {
    console.error('Failed to invalidate session:', error);
    // Don't throw error as logout should still succeed
  }
}

/**
 * POST handler for logout
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  return handleLogout(req);
}

/**
 * GET handler for logout (for convenience)
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  return handleLogout(req);
}

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'https://dreamplace.com.ar',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  });
}