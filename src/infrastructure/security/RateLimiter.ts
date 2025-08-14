/**
 * Rate Limiting System
 * Provides comprehensive rate limiting for API endpoints and user actions
 */

export interface RateLimitRule {
  id: string;
  name: string;
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  blockDurationMs?: number; // How long to block after limit exceeded
  skipSuccessfulRequests?: boolean; // Don't count successful requests
  skipFailedRequests?: boolean; // Don't count failed requests
  skipConditional?: (identifier: string, req?: any) => boolean;
}

export interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

export class RateLimiter {
  private store: Map<string, RateLimitEntry> = new Map();
  private rules: Map<string, RateLimitRule> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000
    );

    this.initializeDefaultRules();
  }

  /**
   * Initialize default rate limiting rules
   */
  private initializeDefaultRules(): void {
    const defaultRules: RateLimitRule[] = [
      {
        id: 'auth-login',
        name: 'Authentication Login',
        windowMs: 15 * 60 * 1000, // 15 minutes
        maxRequests: 5, // 5 login attempts per 15 minutes
        blockDurationMs: 30 * 60 * 1000, // Block for 30 minutes after exceeded
        skipSuccessfulRequests: true,
      },
      {
        id: 'auth-register',
        name: 'Authentication Register',
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 3, // 3 registration attempts per hour
        blockDurationMs: 60 * 60 * 1000, // Block for 1 hour after exceeded
      },
      {
        id: 'password-reset',
        name: 'Password Reset',
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 3, // 3 password reset attempts per hour
        blockDurationMs: 60 * 60 * 1000, // Block for 1 hour after exceeded
      },
      {
        id: 'api-general',
        name: 'General API',
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 100, // 100 requests per minute
        skipConditional: identifier => {
          // Skip rate limiting for admin users
          return identifier.startsWith('admin:');
        },
      },
      {
        id: 'api-upload',
        name: 'File Upload API',
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 10, // 10 uploads per minute
        blockDurationMs: 5 * 60 * 1000, // Block for 5 minutes after exceeded
      },
      {
        id: 'contact-form',
        name: 'Contact Form',
        windowMs: 60 * 60 * 1000, // 1 hour
        maxRequests: 5, // 5 contact form submissions per hour
        blockDurationMs: 60 * 60 * 1000, // Block for 1 hour after exceeded
      },
      {
        id: 'search',
        name: 'Search API',
        windowMs: 60 * 1000, // 1 minute
        maxRequests: 30, // 30 searches per minute
        skipSuccessfulRequests: true,
      },
    ];

    defaultRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  /**
   * Add or update a rate limiting rule
   */
  addRule(rule: RateLimitRule): void {
    this.rules.set(rule.id, rule);
  }

  /**
   * Remove a rate limiting rule
   */
  removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  /**
   * Check rate limit for a specific identifier and rule
   */
  checkLimit(ruleId: string, identifier: string, success?: boolean): RateLimitResult {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      throw new Error(`Rate limit rule not found: ${ruleId}`);
    }

    const key = `${ruleId}:${identifier}`;
    const now = Date.now();
    const windowStart = now - rule.windowMs;

    // Get or create entry
    let entry = this.store.get(key);
    if (!entry || entry.resetTime < now) {
      entry = {
        count: 0,
        resetTime: now + rule.windowMs,
      };
    }

    // Check if currently blocked
    if (entry.blockedUntil && entry.blockedUntil > now) {
      return {
        allowed: false,
        limit: rule.maxRequests,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
      };
    }

    // Clear block if expired
    if (entry.blockedUntil && entry.blockedUntil <= now) {
      entry.blockedUntil = undefined;
    }

    // Check conditional skip
    if (rule.skipConditional && rule.skipConditional(identifier)) {
      return {
        allowed: true,
        limit: rule.maxRequests,
        remaining: rule.maxRequests,
        resetTime: entry.resetTime,
      };
    }

    // Check if we should skip counting this request
    const shouldSkip =
      (rule.skipSuccessfulRequests && success === true) ||
      (rule.skipFailedRequests && success === false);

    if (!shouldSkip) {
      entry.count++;
    }

    // Check if limit exceeded
    if (entry.count > rule.maxRequests) {
      // Apply block if configured
      if (rule.blockDurationMs) {
        entry.blockedUntil = now + rule.blockDurationMs;
      }

      this.store.set(key, entry);

      return {
        allowed: false,
        limit: rule.maxRequests,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: rule.blockDurationMs
          ? Math.ceil(rule.blockDurationMs / 1000)
          : Math.ceil((entry.resetTime - now) / 1000),
      };
    }

    this.store.set(key, entry);

    return {
      allowed: true,
      limit: rule.maxRequests,
      remaining: Math.max(0, rule.maxRequests - entry.count),
      resetTime: entry.resetTime,
    };
  }

  /**
   * Reset rate limit for a specific identifier and rule
   */
  resetLimit(ruleId: string, identifier: string): void {
    const key = `${ruleId}:${identifier}`;
    this.store.delete(key);
  }

  /**
   * Reset all rate limits for an identifier
   */
  resetAllLimits(identifier: string): void {
    const keysToDelete: string[] = [];

    for (const key of this.store.keys()) {
      if (key.endsWith(`:${identifier}`)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.store.delete(key));
  }

  /**
   * Get current status for an identifier and rule
   */
  getStatus(ruleId: string, identifier: string): RateLimitResult | null {
    const rule = this.rules.get(ruleId);
    if (!rule) {
      return null;
    }

    const key = `${ruleId}:${identifier}`;
    const entry = this.store.get(key);
    const now = Date.now();

    if (!entry || entry.resetTime < now) {
      return {
        allowed: true,
        limit: rule.maxRequests,
        remaining: rule.maxRequests,
        resetTime: now + rule.windowMs,
      };
    }

    // Check if currently blocked
    if (entry.blockedUntil && entry.blockedUntil > now) {
      return {
        allowed: false,
        limit: rule.maxRequests,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
      };
    }

    return {
      allowed: entry.count < rule.maxRequests,
      limit: rule.maxRequests,
      remaining: Math.max(0, rule.maxRequests - entry.count),
      resetTime: entry.resetTime,
    };
  }

  /**
   * Get all active limits for an identifier
   */
  getAllStatus(identifier: string): Record<string, RateLimitResult> {
    const results: Record<string, RateLimitResult> = {};

    for (const ruleId of this.rules.keys()) {
      const status = this.getStatus(ruleId, identifier);
      if (status) {
        results[ruleId] = status;
      }
    }

    return results;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.store.entries()) {
      if (entry.resetTime < now && (!entry.blockedUntil || entry.blockedUntil < now)) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.store.delete(key));
  }

  /**
   * Get statistics about rate limiting
   */
  getStatistics(): {
    totalEntries: number;
    totalRules: number;
    activeBlocks: number;
  } {
    const now = Date.now();
    let activeBlocks = 0;

    for (const entry of this.store.values()) {
      if (entry.blockedUntil && entry.blockedUntil > now) {
        activeBlocks++;
      }
    }

    return {
      totalEntries: this.store.size,
      totalRules: this.rules.size,
      activeBlocks,
    };
  }

  /**
   * Clear all rate limit data
   */
  clear(): void {
    this.store.clear();
  }

  /**
   * Destroy the rate limiter and clean up resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clear();
  }
}

/**
 * Singleton rate limiter instance
 */
export const rateLimiter = new RateLimiter();

/**
 * Express middleware factory for rate limiting
 */
export function createRateLimitMiddleware(
  ruleId: string,
  getIdentifier?: (req: any) => string,
  onLimitExceeded?: (req: any, res: any, result: RateLimitResult) => void
) {
  return async (req: any, res: any, next: any) => {
    try {
      // Default identifier extraction
      const identifier = getIdentifier
        ? getIdentifier(req)
        : req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress || 'unknown';

      const result = rateLimiter.checkLimit(ruleId, identifier);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));

      if (!result.allowed) {
        if (result.retryAfter) {
          res.setHeader('Retry-After', result.retryAfter);
        }

        if (onLimitExceeded) {
          onLimitExceeded(req, res, result);
        } else {
          res.status(429).json({
            error: 'Too Many Requests',
            message: 'Rate limit exceeded',
            retryAfter: result.retryAfter,
          });
        }
        return;
      }

      next();
    } catch (error) {
      console.error('Rate limiting error:', error);
      next(); // Continue on error to avoid breaking the application
    }
  };
}

/**
 * Next.js API route wrapper for rate limiting
 */
export function withRateLimit(
  ruleId: string,
  handler: (req: any, res: any) => Promise<void> | void,
  getIdentifier?: (req: any) => string
) {
  return async (req: any, res: any) => {
    try {
      const identifier = getIdentifier
        ? getIdentifier(req)
        : req.headers['x-forwarded-for']?.split(',')[0] ||
          req.connection?.remoteAddress ||
          'unknown';

      const result = rateLimiter.checkLimit(ruleId, identifier);

      // Set rate limit headers
      res.setHeader('X-RateLimit-Limit', result.limit);
      res.setHeader('X-RateLimit-Remaining', result.remaining);
      res.setHeader('X-RateLimit-Reset', Math.ceil(result.resetTime / 1000));

      if (!result.allowed) {
        if (result.retryAfter) {
          res.setHeader('Retry-After', result.retryAfter);
        }

        return res.status(429).json({
          error: 'Too Many Requests',
          message: 'Rate limit exceeded',
          retryAfter: result.retryAfter,
        });
      }

      await handler(req, res);
    } catch (error) {
      console.error('Rate limiting error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
}
