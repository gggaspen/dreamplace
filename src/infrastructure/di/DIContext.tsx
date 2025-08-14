/**
 * Dependency Injection Context
 * Provides DI container access throughout the React component tree
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { DIContainer } from './Container';
import { ServiceToken } from './ServiceTokens';
import { setupContainer } from './ContainerSetup';

const DIContext = createContext<DIContainer | null>(null);

interface DIProviderProps {
  children: ReactNode;
  container?: DIContainer;
}

export function DIProvider({ children, container }: DIProviderProps) {
  // Create and setup container if not provided
  const diContainer = React.useMemo(() => {
    if (container) return container;
    
    try {
      const newContainer = new DIContainer();
      setupContainer(newContainer);
      return newContainer;
    } catch (error) {
      console.error('Failed to setup DI container:', error);
      // Return minimal container to prevent crashes
      const fallbackContainer = new DIContainer();
      return fallbackContainer;
    }
  }, [container]);

  return <DIContext.Provider value={diContainer}>{children}</DIContext.Provider>;
}

export function useDI(): DIContainer {
  const container = useContext(DIContext);
  if (!container) {
    throw new Error('useDI must be used within a DIProvider');
  }
  return container;
}

export function useDependency<T>(token: ServiceToken): T {
  const container = useDI();
  try {
    // Use synchronous resolution for React components
    return container.resolveSync<T>(token);
  } catch (error) {
    console.error(`Failed to resolve dependency ${token.toString()}:`, error);
    // For critical errors during development, provide fallback
    if (process.env.NODE_ENV === 'development') {
      console.warn('Using fallback for dependency resolution during development');
      throw new Error(`Dependency ${token.toString()} not available - check container setup`);
    }
    throw error;
  }
}
