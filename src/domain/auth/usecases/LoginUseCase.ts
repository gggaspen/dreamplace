/**
 * Login Use Case
 * Handles user authentication business logic
 */

import { AuthRepository, LoginCredentials, AuthSession } from '../repositories/AuthRepository';
import { Logger } from '../../common/Logger';

export interface LoginUseCaseInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginUseCaseOutput {
  success: boolean;
  session?: AuthSession;
  error?: string;
}

export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly logger: Logger
  ) {}

  async execute(input: LoginUseCaseInput): Promise<LoginUseCaseOutput> {
    try {
      this.logger.info('Attempting user login', { email: input.email });

      // Validate input
      if (!this.validateInput(input)) {
        return {
          success: false,
          error: 'Invalid email or password format'
        };
      }

      // Attempt login
      const credentials: LoginCredentials = {
        email: input.email.toLowerCase().trim(),
        password: input.password
      };

      const session = await this.authRepository.login(credentials);

      this.logger.info('User login successful', { 
        userId: session.user.id,
        email: session.user.email 
      });

      return {
        success: true,
        session
      };

    } catch (error) {
      this.logger.error('Login failed', { 
        email: input.email,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  private validateInput(input: LoginUseCaseInput): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return (
      typeof input.email === 'string' &&
      emailRegex.test(input.email) &&
      typeof input.password === 'string' &&
      input.password.length >= 6
    );
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      switch (error.message) {
        case 'auth/user-not-found':
          return 'No account found with this email address';
        case 'auth/wrong-password':
          return 'Incorrect password';
        case 'auth/invalid-email':
          return 'Invalid email address';
        case 'auth/user-disabled':
          return 'This account has been disabled';
        case 'auth/too-many-requests':
          return 'Too many failed attempts. Please try again later';
        default:
          return 'Login failed. Please try again';
      }
    }
    return 'An unexpected error occurred';
  }
}