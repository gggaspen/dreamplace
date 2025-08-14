/**
 * JWT Management System
 * Provides secure JWT token handling with proper validation and encryption
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

export interface UserClaims extends JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  permissions: string[];
  sessionId: string;
  lastLogin?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface JWTConfig {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
  issuer: string;
  audience: string;
}

export class JWTManager {
  private config: JWTConfig;
  private accessTokenKey: Uint8Array;
  private refreshTokenKey: Uint8Array;

  constructor(config: JWTConfig) {
    this.config = config;
    this.accessTokenKey = new TextEncoder().encode(config.accessTokenSecret);
    this.refreshTokenKey = new TextEncoder().encode(config.refreshTokenSecret);
  }

  /**
   * Generate access and refresh token pair
   */
  async generateTokenPair(claims: Omit<UserClaims, 'iat' | 'exp' | 'iss' | 'aud'>): Promise<TokenPair> {
    const now = Math.floor(Date.now() / 1000);
    
    // Generate session ID if not provided
    const sessionId = claims.sessionId || this.generateSessionId();
    
    const baseClaims = {
      ...claims,
      sessionId,
      iat: now,
      iss: this.config.issuer,
      aud: this.config.audience
    };

    // Generate access token (short-lived)
    const accessToken = await new SignJWT(baseClaims)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime(this.config.accessTokenExpiry)
      .sign(this.accessTokenKey);

    // Generate refresh token (long-lived, minimal claims)
    const refreshClaims = {
      userId: claims.userId,
      sessionId,
      type: 'refresh',
      iat: now,
      iss: this.config.issuer,
      aud: this.config.audience
    };

    const refreshToken = await new SignJWT(refreshClaims)
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime(this.config.refreshTokenExpiry)
      .sign(this.refreshTokenKey);

    return { accessToken, refreshToken };
  }

  /**
   * Verify and decode access token
   */
  async verifyAccessToken(token: string): Promise<UserClaims | null> {
    try {
      const { payload } = await jwtVerify(token, this.accessTokenKey, {
        issuer: this.config.issuer,
        audience: this.config.audience
      });

      return payload as UserClaims;
    } catch (error) {
      console.error('Access token verification failed:', error);
      return null;
    }
  }

  /**
   * Verify and decode refresh token
   */
  async verifyRefreshToken(token: string): Promise<{ userId: string; sessionId: string } | null> {
    try {
      const { payload } = await jwtVerify(token, this.refreshTokenKey, {
        issuer: this.config.issuer,
        audience: this.config.audience
      });

      if (payload.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      return {
        userId: payload.userId as string,
        sessionId: payload.sessionId as string
      };
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string, userClaims: Omit<UserClaims, 'iat' | 'exp' | 'iss' | 'aud'>): Promise<string | null> {
    const refreshPayload = await this.verifyRefreshToken(refreshToken);
    
    if (!refreshPayload || refreshPayload.userId !== userClaims.userId) {
      return null;
    }

    const tokenPair = await this.generateTokenPair({
      ...userClaims,
      sessionId: refreshPayload.sessionId
    });

    return tokenPair.accessToken;
  }

  /**
   * Extract token from Authorization header
   */
  extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Set secure HTTP-only cookies for tokens
   */
  setTokenCookies(tokenPair: TokenPair, response?: Response): void {
    const secure = process.env.NODE_ENV === 'production';
    const sameSite = 'strict';
    
    const accessTokenExpiry = this.parseExpiryTime(this.config.accessTokenExpiry);
    const refreshTokenExpiry = this.parseExpiryTime(this.config.refreshTokenExpiry);

    if (typeof document !== 'undefined') {
      // Client-side cookie setting (fallback)
      document.cookie = `access-token=${tokenPair.accessToken}; Max-Age=${accessTokenExpiry}; Path=/; ${secure ? 'Secure;' : ''} SameSite=${sameSite}; HttpOnly`;
      document.cookie = `refresh-token=${tokenPair.refreshToken}; Max-Age=${refreshTokenExpiry}; Path=/; ${secure ? 'Secure;' : ''} SameSite=${sameSite}; HttpOnly`;
    } else {
      // Server-side cookie setting
      const cookieStore = cookies();
      
      cookieStore.set('access-token', tokenPair.accessToken, {
        maxAge: accessTokenExpiry,
        path: '/',
        secure,
        sameSite,
        httpOnly: true
      });

      cookieStore.set('refresh-token', tokenPair.refreshToken, {
        maxAge: refreshTokenExpiry,
        path: '/',
        secure,
        sameSite,
        httpOnly: true
      });
    }
  }

  /**
   * Clear authentication cookies
   */
  clearTokenCookies(): void {
    if (typeof document !== 'undefined') {
      // Client-side cookie clearing
      document.cookie = 'access-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'refresh-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } else {
      // Server-side cookie clearing
      const cookieStore = cookies();
      cookieStore.delete('access-token');
      cookieStore.delete('refresh-token');
    }
  }

  /**
   * Get tokens from cookies
   */
  getTokensFromCookies(): { accessToken: string | null; refreshToken: string | null } {
    if (typeof document !== 'undefined') {
      // Client-side cookie reading
      const cookies = document.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      return {
        accessToken: cookies['access-token'] || null,
        refreshToken: cookies['refresh-token'] || null
      };
    } else {
      // Server-side cookie reading
      const cookieStore = cookies();
      return {
        accessToken: cookieStore.get('access-token')?.value || null,
        refreshToken: cookieStore.get('refresh-token')?.value || null
      };
    }
  }

  /**
   * Validate token claims
   */
  validateClaims(claims: UserClaims): boolean {
    // Check required fields
    if (!claims.userId || !claims.email || !claims.role || !claims.sessionId) {
      return false;
    }

    // Validate role
    const validRoles = ['user', 'admin', 'moderator'];
    if (!validRoles.includes(claims.role)) {
      return false;
    }

    // Validate permissions array
    if (!Array.isArray(claims.permissions)) {
      return false;
    }

    // Check expiration
    if (claims.exp && claims.exp < Math.floor(Date.now() / 1000)) {
      return false;
    }

    return true;
  }

  /**
   * Generate secure session ID
   */
  private generateSessionId(): string {
    const array = new Uint8Array(32);
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

  /**
   * Parse expiry time string to seconds
   */
  private parseExpiryTime(expiry: string): number {
    const units: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400
    };

    const match = expiry.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(`Invalid expiry format: ${expiry}`);
    }

    const [, value, unit] = match;
    return parseInt(value, 10) * units[unit];
  }

  /**
   * Check if user has required permission
   */
  static hasPermission(userClaims: UserClaims, requiredPermission: string): boolean {
    if (userClaims.role === 'admin') {
      return true; // Admins have all permissions
    }

    return userClaims.permissions.includes(requiredPermission);
  }

  /**
   * Check if user has required role or higher
   */
  static hasRole(userClaims: UserClaims, requiredRole: string): boolean {
    const roleHierarchy = {
      user: 0,
      moderator: 1,
      admin: 2
    };

    const userLevel = roleHierarchy[userClaims.role as keyof typeof roleHierarchy] ?? -1;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] ?? 999;

    return userLevel >= requiredLevel;
  }
}

/**
 * Create JWT manager with environment-based configuration
 */
export function createJWTManager(): JWTManager {
  const config: JWTConfig = {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'your-super-secret-jwt-access-key',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-jwt-refresh-key',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
    issuer: process.env.JWT_ISSUER || 'dreamplace.com.ar',
    audience: process.env.JWT_AUDIENCE || 'dreamplace-users'
  };

  return new JWTManager(config);
}