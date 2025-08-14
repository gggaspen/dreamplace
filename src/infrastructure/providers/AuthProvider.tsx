/**
 * Authentication Provider with Dependency Injection
 * Integrates the AuthContext with the DI container
 */

'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { AuthProvider as BaseAuthProvider } from '../auth/AuthContext';
import { useDI } from '../di/DIContext';
import { SERVICE_TOKENS } from '../di/ServiceTokens';
import { AuthRepository } from '../../domain/auth/repositories/AuthRepository';
import { LoginUseCase } from '../../domain/auth/usecases/LoginUseCase';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const container = useDI();
  const [authRepository, setAuthRepository] = useState<AuthRepository | null>(null);
  const [loginUseCase, setLoginUseCase] = useState<LoginUseCase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDependencies = async () => {
      try {
        const authRepo = await container.resolve<AuthRepository>(SERVICE_TOKENS.AUTH_REPOSITORY);
        const loginUC = await container.resolve<LoginUseCase>(SERVICE_TOKENS.LOGIN_USE_CASE);
        
        setAuthRepository(authRepo);
        setLoginUseCase(loginUC);
      } catch (error) {
        console.error('Failed to initialize auth dependencies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDependencies();
  }, [container]);

  if (isLoading || !authRepository || !loginUseCase) {
    return <div>Loading authentication...</div>;
  }

  return (
    <BaseAuthProvider 
      authRepository={authRepository}
      loginUseCase={loginUseCase}
    >
      {children}
    </BaseAuthProvider>
  );
}