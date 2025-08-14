/**
 * Authentication Context
 * Provides authentication state and methods throughout the React component tree
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '../../domain/auth/entities/User';
import {
  AuthRepository,
  AuthSession,
  LoginCredentials,
  RegisterCredentials,
} from '../../domain/auth/repositories/AuthRepository';
import { LoginUseCase } from '../../domain/auth/usecases/LoginUseCase';

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  session: AuthSession | null;

  // Actions
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export interface AuthProviderProps {
  children: ReactNode;
  authRepository: AuthRepository;
  loginUseCase: LoginUseCase;
}

export function AuthProvider({ children, authRepository, loginUseCase }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to authentication state changes
    const unsubscribe = authRepository.onAuthStateChanged(authUser => {
      setUser(authUser);
      setIsLoading(false);

      if (authUser) {
        authRepository.getToken().then(token => {
          if (token) {
            setSession({
              user: authUser,
              token,
              isAuthenticated: true,
            });
          }
        });
      } else {
        setSession(null);
      }
    });

    return unsubscribe;
  }, [authRepository]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const result = await loginUseCase.execute(credentials);

      if (result.success && result.session) {
        setUser(result.session.user);
        setSession(result.session);
      }

      return { success: result.success, error: result.error };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      const session = await authRepository.register(credentials);
      setUser(session.user);
      setSession(session);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authRepository.logout();
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await authRepository.resetPassword(email);
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    await authRepository.updatePassword(currentPassword, newPassword);
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    session,
    login,
    register,
    logout,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    // During SSR/build time, provide a safe default instead of throwing
    if (typeof window === 'undefined') {
      return {
        user: null,
        isLoading: true,
        isAuthenticated: false,
        session: null,
        login: async () => ({ success: false, error: 'Auth not available during SSR' }),
        register: async () => ({ success: false, error: 'Auth not available during SSR' }),
        logout: async () => {},
        resetPassword: async () => {},
        updatePassword: async () => {},
      };
    }
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for components that require authentication
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>; // You can replace this with a proper loading component
    }

    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>; // You can replace this with a login component
    }

    return <Component {...props} />;
  };
}
