/**
 * Security Infrastructure Index
 * Exports all security-related modules and utilities
 */

// Security Headers
export {
  SecurityHeaders,
  createSecurityConfig,
  type SecurityConfig
} from './SecurityHeaders';

// Input Sanitization
export {
  InputSanitizer,
  type SanitizationOptions
} from './InputSanitizer';

// JWT Management
export {
  JWTManager,
  createJWTManager,
  type UserClaims,
  type TokenPair,
  type JWTConfig
} from './JWTManager';

// Role-Based Access Control
export {
  RBACManager,
  rbacManager,
  withPermission,
  usePermissions,
  type Permission,
  type Role,
  type User
} from './RBAC';

// Rate Limiting
export {
  RateLimiter,
  rateLimiter,
  createRateLimitMiddleware,
  withRateLimit,
  type RateLimitRule,
  type RateLimitEntry,
  type RateLimitResult
} from './RateLimiter';

// Environment Encryption
export {
  EnvironmentEncryption,
  SecureEnvironmentManager,
  createSecureEnvironmentManager,
  envUtils,
  type EncryptedValue,
  type EncryptionConfig
} from './EnvironmentEncryption';

/**
 * Security utilities and helpers
 */
export const SecurityUtils = {
  /**
   * Validate password strength
   */
  validatePassword: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (password.length < 12) {
      errors.push('Password should be at least 12 characters for better security');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      errors.push('Password should not contain repeated characters');
    }

    if (/123|abc|qwe|asd|zxc/i.test(password)) {
      errors.push('Password should not contain common patterns');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  },

  /**
   * Generate secure random password
   */
  generatePassword: (length: number = 16): string => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = uppercase + lowercase + numbers + symbols;
    
    let password = '';
    
    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  },

  /**
   * Hash password using Web Crypto API
   */
  hashPassword: async (password: string, salt?: string): Promise<{ hash: string; salt: string }> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Generate salt if not provided
    if (!salt) {
      const saltArray = new Uint8Array(16);
      crypto.getRandomValues(saltArray);
      salt = Array.from(saltArray, byte => byte.toString(16).padStart(2, '0')).join('');
    }
    
    const saltData = encoder.encode(salt);
    const combinedData = new Uint8Array(data.length + saltData.length);
    combinedData.set(data);
    combinedData.set(saltData, data.length);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', combinedData);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return { hash, salt };
  },

  /**
   * Verify password against hash
   */
  verifyPassword: async (password: string, hash: string, salt: string): Promise<boolean> => {
    const { hash: newHash } = await SecurityUtils.hashPassword(password, salt);
    return newHash === hash;
  },

  /**
   * Generate secure random string
   */
  generateRandomString: (length: number = 32): string => {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Time-safe string comparison
   */
  timeSafeEqual: (a: string, b: string): boolean => {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
};

/**
 * Security constants
 */
export const SecurityConstants = {
  // Password requirements
  MIN_PASSWORD_LENGTH: 8,
  RECOMMENDED_PASSWORD_LENGTH: 12,
  
  // Token expiry times
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  PASSWORD_RESET_EXPIRY: '1h',
  
  // Rate limiting windows
  LOGIN_RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  API_RATE_LIMIT_WINDOW: 60 * 1000, // 1 minute
  
  // Security headers
  HSTS_MAX_AGE: 31536000, // 1 year
  CSP_REPORT_SAMPLE_RATE: 0.1, // 10% of violations
  
  // Encryption
  DEFAULT_ALGORITHM: 'aes-256-gcm',
  KEY_LENGTH: 32,
  IV_LENGTH: 16,
  SALT_LENGTH: 32,
  TAG_LENGTH: 16
} as const;