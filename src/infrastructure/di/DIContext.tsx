/**
 * Dependency Injection Context
 * Provides DI container access throughout the React component tree
 */

'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { Container, DIContainer } from './Container';
import { ServiceToken } from './ServiceTokens';
import { setupContainer } from './ContainerSetup';

const DIContext = createContext<DIContainer | null>(null);

interface DIProviderProps {
  children: ReactNode;
  container?: DIContainer;
}

export function DIProvider({ children, container }: DIProviderProps) {
  // Create and setup container if not provided
  const diContainer =
    container ||
    (() => {
      const newContainer = new Container();
      setupContainer(newContainer);
      return newContainer;
    })();

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
  // For React components, we need to handle async resolution differently
  // This is a simplified sync version - in real implementation you might need
  // to use React.Suspense or loading states for async dependencies
  try {
    const dependency = container.resolve<T>(token);
    if (dependency instanceof Promise) {
      throw new Error(
        `Async dependency ${token.toString()} cannot be used directly in React component. Use a loading state or Suspense.`
      );
    }
    return dependency;
  } catch (error) {
    console.error(`Failed to resolve dependency ${token.toString()}:`, error);
    throw error;
  }
}
