/**
 * Environment Variable Encryption System
 * Provides secure encryption and decryption of sensitive environment variables
 */

import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export interface EncryptedValue {
  encrypted: string;
  iv: string;
  salt: string;
  tag: string;
}

export interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  saltLength: number;
  tagLength: number;
}

export class EnvironmentEncryption {
  private config: EncryptionConfig;
  private masterKey: string;

  constructor(masterKey: string, config?: Partial<EncryptionConfig>) {
    this.masterKey = masterKey;
    this.config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
      ivLength: 16,
      saltLength: 32,
      tagLength: 16,
      ...config
    };
  }

  /**
   * Encrypt a string value
   */
  async encrypt(plaintext: string): Promise<string> {
    try {
      const salt = randomBytes(this.config.saltLength);
      const iv = randomBytes(this.config.ivLength);
      
      // Derive key from master key and salt
      const key = await scryptAsync(this.masterKey, salt, this.config.keyLength) as Buffer;
      
      // Create cipher
      const cipher = createCipheriv(this.config.algorithm, key, iv);
      
      // Encrypt
      let encrypted = cipher.update(plaintext, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get authentication tag
      const tag = cipher.getAuthTag();
      
      // Combine all components
      const result: EncryptedValue = {
        encrypted,
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        tag: tag.toString('hex')
      };
      
      // Return base64 encoded JSON
      return Buffer.from(JSON.stringify(result)).toString('base64');
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Decrypt an encrypted value
   */
  async decrypt(encryptedData: string): Promise<string> {
    try {
      // Decode base64 and parse JSON
      const data: EncryptedValue = JSON.parse(Buffer.from(encryptedData, 'base64').toString('utf8'));
      
      // Convert hex strings back to buffers
      const salt = Buffer.from(data.salt, 'hex');
      const iv = Buffer.from(data.iv, 'hex');
      const tag = Buffer.from(data.tag, 'hex');
      
      // Derive key from master key and salt
      const key = await scryptAsync(this.masterKey, salt, this.config.keyLength) as Buffer;
      
      // Create decipher
      const decipher = createDecipheriv(this.config.algorithm, key, iv);
      decipher.setAuthTag(tag);
      
      // Decrypt
      let decrypted = decipher.update(data.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Encrypt environment variables from an object
   */
  async encryptEnvironment(env: Record<string, string>): Promise<Record<string, string>> {
    const encrypted: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(env)) {
      if (this.shouldEncrypt(key)) {
        encrypted[key] = await this.encrypt(value);
      } else {
        encrypted[key] = value;
      }
    }
    
    return encrypted;
  }

  /**
   * Decrypt environment variables from an object
   */
  async decryptEnvironment(env: Record<string, string>): Promise<Record<string, string>> {
    const decrypted: Record<string, string> = {};
    
    for (const [key, value] of Object.entries(env)) {
      if (this.shouldEncrypt(key) && this.isEncrypted(value)) {
        try {
          decrypted[key] = await this.decrypt(value);
        } catch (error) {
          console.warn(`Failed to decrypt environment variable ${key}:`, error);
          decrypted[key] = value; // Fallback to original value
        }
      } else {
        decrypted[key] = value;
      }
    }
    
    return decrypted;
  }

  /**
   * Check if a value appears to be encrypted
   */
  private isEncrypted(value: string): boolean {
    try {
      const decoded = Buffer.from(value, 'base64').toString('utf8');
      const parsed = JSON.parse(decoded);
      return !!(parsed.encrypted && parsed.iv && parsed.salt && parsed.tag);
    } catch {
      return false;
    }
  }

  /**
   * Determine if an environment variable should be encrypted
   */
  private shouldEncrypt(key: string): boolean {
    const sensitivePatterns = [
      'SECRET',
      'KEY',
      'TOKEN',
      'PASSWORD',
      'PRIVATE',
      'API_KEY',
      'DATABASE_URL',
      'MONGODB_URI',
      'REDIS_URL',
      'JWT_',
      'STRIPE_',
      'FIREBASE_',
      'GOOGLE_',
      'FACEBOOK_',
      'TWITTER_',
      'GITHUB_',
      'OAUTH_',
      'WEBHOOK_',
      'ENCRYPTION_'
    ];

    const upperKey = key.toUpperCase();
    return sensitivePatterns.some(pattern => upperKey.includes(pattern));
  }

  /**
   * Generate a random master key
   */
  static generateMasterKey(length: number = 64): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * Validate master key strength
   */
  static validateMasterKey(key: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (key.length < 32) {
      errors.push('Master key must be at least 32 characters long');
    }

    if (key.length < 64) {
      errors.push('Master key should be at least 64 characters for optimal security');
    }

    if (!/[A-Z]/.test(key)) {
      errors.push('Master key should contain uppercase letters');
    }

    if (!/[a-z]/.test(key)) {
      errors.push('Master key should contain lowercase letters');
    }

    if (!/[0-9]/.test(key)) {
      errors.push('Master key should contain numbers');
    }

    if (!/[^A-Za-z0-9]/.test(key)) {
      errors.push('Master key should contain special characters');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

/**
 * Environment variable manager with encryption support
 */
export class SecureEnvironmentManager {
  private encryption: EnvironmentEncryption;
  private cache: Map<string, string> = new Map();

  constructor(masterKey: string) {
    this.encryption = new EnvironmentEncryption(masterKey);
  }

  /**
   * Get environment variable with automatic decryption
   */
  async get(key: string, defaultValue?: string): Promise<string | undefined> {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    const value = process.env[key];
    if (!value) {
      return defaultValue;
    }

    try {
      // Try to decrypt if it looks encrypted
      if (this.encryption['isEncrypted'](value)) {
        const decrypted = await this.encryption.decrypt(value);
        this.cache.set(key, decrypted);
        return decrypted;
      }
      
      // Return plain value
      this.cache.set(key, value);
      return value;
    } catch (error) {
      console.warn(`Failed to decrypt environment variable ${key}, using plain value`);
      this.cache.set(key, value);
      return value;
    }
  }

  /**
   * Set environment variable with automatic encryption
   */
  async set(key: string, value: string, encrypt: boolean = true): Promise<void> {
    if (encrypt && this.encryption['shouldEncrypt'](key)) {
      const encrypted = await this.encryption.encrypt(value);
      process.env[key] = encrypted;
    } else {
      process.env[key] = value;
    }

    // Update cache with plain value
    this.cache.set(key, value);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Load environment variables from encrypted file
   */
  async loadFromFile(filePath: string): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const content = await fs.readFile(filePath, 'utf8');
      const env = JSON.parse(content);
      
      const decryptedEnv = await this.encryption.decryptEnvironment(env);
      
      for (const [key, value] of Object.entries(decryptedEnv)) {
        process.env[key] = value;
        this.cache.set(key, value);
      }
    } catch (error) {
      throw new Error(`Failed to load environment from file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Save environment variables to encrypted file
   */
  async saveToFile(filePath: string, keys: string[]): Promise<void> {
    try {
      const env: Record<string, string> = {};
      
      for (const key of keys) {
        const value = await this.get(key);
        if (value !== undefined) {
          env[key] = value;
        }
      }

      const encryptedEnv = await this.encryption.encryptEnvironment(env);
      
      const fs = await import('fs/promises');
      await fs.writeFile(filePath, JSON.stringify(encryptedEnv, null, 2), 'utf8');
    } catch (error) {
      throw new Error(`Failed to save environment to file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Create a secure environment manager
 */
export function createSecureEnvironmentManager(): SecureEnvironmentManager {
  const masterKey = process.env.ENCRYPTION_MASTER_KEY || EnvironmentEncryption.generateMasterKey();
  
  if (!process.env.ENCRYPTION_MASTER_KEY) {
    console.warn('ENCRYPTION_MASTER_KEY not set, using generated key. This should be set in production.');
  }

  return new SecureEnvironmentManager(masterKey);
}

/**
 * Utility functions for common operations
 */
export const envUtils = {
  /**
   * Get database URL with automatic decryption
   */
  async getDatabaseUrl(): Promise<string> {
    const manager = createSecureEnvironmentManager();
    const url = await manager.get('DATABASE_URL');
    if (!url) {
      throw new Error('DATABASE_URL not configured');
    }
    return url;
  },

  /**
   * Get JWT secrets with automatic decryption
   */
  async getJWTSecrets(): Promise<{ accessSecret: string; refreshSecret: string }> {
    const manager = createSecureEnvironmentManager();
    const [accessSecret, refreshSecret] = await Promise.all([
      manager.get('JWT_ACCESS_SECRET'),
      manager.get('JWT_REFRESH_SECRET')
    ]);

    if (!accessSecret || !refreshSecret) {
      throw new Error('JWT secrets not configured');
    }

    return { accessSecret, refreshSecret };
  },

  /**
   * Get API keys with automatic decryption
   */
  async getAPIKeys(): Promise<Record<string, string>> {
    const manager = createSecureEnvironmentManager();
    const keys = [
      'STRIPE_SECRET_KEY',
      'STRIPE_PUBLISHABLE_KEY',
      'GOOGLE_API_KEY',
      'FACEBOOK_APP_SECRET',
      'TWITTER_API_SECRET'
    ];

    const apiKeys: Record<string, string> = {};
    
    for (const key of keys) {
      const value = await manager.get(key);
      if (value) {
        apiKeys[key] = value;
      }
    }

    return apiKeys;
  }
};