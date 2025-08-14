/**
 * Authentication Repository Interface
 * Defines the contract for authentication operations in the domain layer
 */

import { User } from '../entities/User';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  displayName: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  tokenType: 'Bearer';
}

export interface AuthSession {
  user: User;
  token: AuthToken;
  isAuthenticated: boolean;
}

export interface AuthRepository {
  /**
   * Authenticate user with email and password
   */
  login(credentials: LoginCredentials): Promise<AuthSession>;

  /**
   * Register a new user
   */
  register(credentials: RegisterCredentials): Promise<AuthSession>;

  /**
   * Sign out the current user
   */
  logout(): Promise<void>;

  /**
   * Get current authenticated user
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Refresh authentication token
   */
  refreshToken(refreshToken: string): Promise<AuthToken>;

  /**
   * Send password reset email
   */
  resetPassword(email: string): Promise<void>;

  /**
   * Verify email address
   */
  verifyEmail(token: string): Promise<void>;

  /**
   * Update user password
   */
  updatePassword(currentPassword: string, newPassword: string): Promise<void>;

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): Promise<boolean>;

  /**
   * Get authentication token
   */
  getToken(): Promise<AuthToken | null>;

  /**
   * Subscribe to authentication state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
