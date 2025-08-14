/**
 * Authentication Login Endpoint
 * Demonstrates secure login with JWT and rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';
import { withRateLimit } from '@/infrastructure/security/RateLimiter';
import { InputSanitizer, SecurityUtils } from '@/infrastructure/security';
import { createJWTManager } from '@/infrastructure/security/JWTManager';

interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Handle user login
 */
async function handleLogin(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json() as LoginRequest;

    // Sanitize input
    const email = InputSanitizer.sanitizeEmail(body.email);
    const password = InputSanitizer.sanitizeText(body.password);

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password format' },
        { status: 400 }
      );
    }

    // Validate password strength (optional check)
    const passwordValidation = SecurityUtils.validatePassword(password);
    if (!passwordValidation.valid && process.env.ENFORCE_STRONG_PASSWORDS === 'true') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password does not meet security requirements',
          errors: passwordValidation.errors 
        },
        { status: 400 }
      );
    }

    // TODO: Replace with actual user authentication
    // This is a mock implementation for demonstration
    const user = await authenticateUser(email, password);

    if (!user) {
      // Return generic error message to prevent user enumeration
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT tokens
    const jwtManager = createJWTManager();
    const tokenPair = await jwtManager.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role as any,
      permissions: user.permissions,
      sessionId: SecurityUtils.generateRandomString(32),
      lastLogin: Date.now()
    });

    // Create response
    const response = NextResponse.json<LoginResponse>({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

    // Set secure HTTP-only cookies
    const secure = process.env.NODE_ENV === 'production';
    const accessTokenExpiry = 15 * 60; // 15 minutes
    const refreshTokenExpiry = body.rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60; // 30 days or 7 days

    response.cookies.set('access-token', tokenPair.accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      maxAge: accessTokenExpiry,
      path: '/'
    });

    response.cookies.set('refresh-token', tokenPair.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      maxAge: refreshTokenExpiry,
      path: '/'
    });

    // Set user role cookie for middleware (less sensitive)
    response.cookies.set('user-role', user.role, {
      httpOnly: false, // Accessible to client for UI purposes
      secure,
      sameSite: 'strict',
      maxAge: refreshTokenExpiry,
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Mock user authentication function
 * In a real application, this would query your database
 */
async function authenticateUser(email: string, password: string): Promise<{
  id: string;
  email: string;
  role: string;
  permissions: string[];
} | null> {
  // TODO: Replace with actual database query
  // This is a mock implementation for demonstration
  
  const mockUsers = [
    {
      id: '1',
      email: 'admin@dreamplace.com.ar',
      password: 'admin123', // In real app, this would be hashed
      role: 'admin',
      permissions: ['user.read', 'user.create', 'user.update', 'user.delete', 'content.read', 'content.create', 'content.update', 'content.delete']
    },
    {
      id: '2',
      email: 'user@dreamplace.com.ar',
      password: 'user123', // In real app, this would be hashed
      role: 'user',
      permissions: ['content.read', 'profile.read', 'profile.update']
    }
  ];

  // Find user by email
  const user = mockUsers.find(u => u.email === email);
  if (!user) return null;

  // In a real application, use proper password hashing
  // const isValidPassword = await SecurityUtils.verifyPassword(password, user.passwordHash, user.salt);
  const isValidPassword = user.password === password; // Mock validation

  if (!isValidPassword) return null;

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    permissions: user.permissions
  };
}

/**
 * Rate limited POST handler for login
 */
export const POST = withRateLimit(
  'auth-login',
  handleLogin,
  (req) => {
    // Use IP + user agent for more specific rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    return `${ip}:${userAgent.slice(0, 50)}`;
  }
);

/**
 * Handle OPTIONS requests for CORS
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.CORS_ORIGIN || 'https://dreamplace.com.ar',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  });
}