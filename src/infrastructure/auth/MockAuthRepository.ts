/**
 * Mock Authentication Repository Implementation
 * Used when Firebase is not available or configured
 */

import {
  AuthRepository,
  LoginCredentials,
  RegisterCredentials,
  AuthSession,
  AuthToken,
} from '../../domain/auth/repositories/AuthRepository';
import { User, UserProfile } from '../../domain/auth/entities/User';
import { Logger } from '../../domain/common/Logger';
import { Unsubscribe } from 'firebase/auth';

export class MockAuthRepository implements AuthRepository {
  constructor(private readonly logger: Logger) {}

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    this.logger.warn('Mock login attempted - Firebase authentication disabled', {
      email: credentials.email,
    });
    throw new Error('Authentication service unavailable - Firebase not configured');
  }

  async register(credentials: RegisterCredentials): Promise<AuthSession> {
    this.logger.warn('Mock registration attempted - Firebase authentication disabled', {
      email: credentials.email,
    });
    throw new Error('Authentication service unavailable - Firebase not configured');
  }

  async logout(): Promise<void> {
    this.logger.info('Mock logout - no action needed');
  }

  async getCurrentUser(): Promise<User | null> {
    return null;
  }

  async refreshToken(refreshToken: string): Promise<AuthToken> {
    throw new Error('Authentication service unavailable - Firebase not configured');
  }

  async resetPassword(email: string): Promise<void> {
    this.logger.warn('Mock password reset attempted - Firebase authentication disabled', {
      email,
    });
    throw new Error('Authentication service unavailable - Firebase not configured');
  }

  async verifyEmail(token: string): Promise<void> {
    this.logger.warn('Mock email verification attempted - Firebase authentication disabled');
    throw new Error('Authentication service unavailable - Firebase not configured');
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    throw new Error('Authentication service unavailable - Firebase not configured');
  }

  async isAuthenticated(): Promise<boolean> {
    return false;
  }

  async getToken(): Promise<AuthToken | null> {
    return null;
  }

  onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe {
    // Call callback immediately with null user
    callback(null);
    // Return a no-op unsubscribe function
    return () => {};
  }
}