/**
 * Firebase Authentication Repository Implementation
 * Implements the AuthRepository interface using Firebase Auth
 */

import {
  Auth,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword as firebaseUpdatePassword,
  sendEmailVerification,
  getIdToken,
  Unsubscribe
} from 'firebase/auth';

import { AuthRepository, LoginCredentials, RegisterCredentials, AuthSession, AuthToken } from '../../domain/auth/repositories/AuthRepository';
import { User, UserProfile } from '../../domain/auth/entities/User';
import { Logger } from '../../domain/common/Logger';

export class FirebaseAuthRepository implements AuthRepository {
  constructor(
    private readonly auth: Auth,
    private readonly logger: Logger
  ) {}

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    try {
      this.logger.info('Attempting Firebase login', { email: credentials.email });
      
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      );

      const user = await this.mapFirebaseUserToDomainUser(userCredential.user);
      const token = await this.createAuthToken(userCredential.user);

      const session: AuthSession = {
        user,
        token,
        isAuthenticated: true
      };

      this.logger.info('Firebase login successful', { userId: user.id });
      return session;

    } catch (error) {
      this.logger.error('Firebase login failed', { 
        email: credentials.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthSession> {
    try {
      this.logger.info('Attempting Firebase registration', { email: credentials.email });

      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        credentials.email,
        credentials.password
      );

      // Send email verification
      await sendEmailVerification(userCredential.user);

      const user = await this.mapFirebaseUserToDomainUser(userCredential.user, {
        displayName: credentials.displayName
      });
      const token = await this.createAuthToken(userCredential.user);

      const session: AuthSession = {
        user,
        token,
        isAuthenticated: true
      };

      this.logger.info('Firebase registration successful', { userId: user.id });
      return session;

    } catch (error) {
      this.logger.error('Firebase registration failed', { 
        email: credentials.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      this.logger.info('Attempting Firebase logout');
      await signOut(this.auth);
      this.logger.info('Firebase logout successful');
    } catch (error) {
      this.logger.error('Firebase logout failed', { 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) return null;

    return this.mapFirebaseUserToDomainUser(firebaseUser);
  }

  async refreshToken(refreshToken: string): Promise<AuthToken> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) {
      throw new Error('No authenticated user to refresh token');
    }

    return this.createAuthToken(firebaseUser);
  }

  async resetPassword(email: string): Promise<void> {
    try {
      this.logger.info('Sending password reset email', { email });
      await sendPasswordResetEmail(this.auth, email);
      this.logger.info('Password reset email sent', { email });
    } catch (error) {
      this.logger.error('Failed to send password reset email', { 
        email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<void> {
    // Firebase handles email verification automatically
    // This method is kept for interface compliance
    this.logger.info('Email verification requested', { token });
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) {
      throw new Error('No authenticated user to update password');
    }

    try {
      this.logger.info('Updating user password', { userId: firebaseUser.uid });
      await firebaseUpdatePassword(firebaseUser, newPassword);
      this.logger.info('Password updated successfully', { userId: firebaseUser.uid });
    } catch (error) {
      this.logger.error('Failed to update password', { 
        userId: firebaseUser.uid,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return this.auth.currentUser !== null;
  }

  async getToken(): Promise<AuthToken | null> {
    const firebaseUser = this.auth.currentUser;
    if (!firebaseUser) return null;

    return this.createAuthToken(firebaseUser);
  }

  onAuthStateChanged(callback: (user: User | null) => void): Unsubscribe {
    return onAuthStateChanged(this.auth, async (firebaseUser) => {
      if (firebaseUser) {
        const domainUser = await this.mapFirebaseUserToDomainUser(firebaseUser);
        callback(domainUser);
      } else {
        callback(null);
      }
    });
  }

  private async mapFirebaseUserToDomainUser(
    firebaseUser: FirebaseUser,
    overrides?: Partial<UserProfile>
  ): Promise<User> {
    const profile: UserProfile = {
      displayName: overrides?.displayName || firebaseUser.displayName || 'Anonymous',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || undefined,
      roles: ['user'], // Default role, can be enhanced with custom claims
      preferences: {
        theme: 'system',
        language: 'en',
        notifications: {
          email: true,
          push: true,
          events: true,
          artists: true
        }
      }
    };

    return new User(
      firebaseUser.uid,
      firebaseUser.email || '',
      firebaseUser.emailVerified,
      profile,
      new Date(firebaseUser.metadata.creationTime || Date.now()),
      new Date(firebaseUser.metadata.lastSignInTime || Date.now())
    );
  }

  private async createAuthToken(firebaseUser: FirebaseUser): Promise<AuthToken> {
    const accessToken = await getIdToken(firebaseUser);
    
    return {
      accessToken,
      refreshToken: firebaseUser.refreshToken,
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
      tokenType: 'Bearer'
    };
  }
}