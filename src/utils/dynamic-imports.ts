/**
 * Dynamic Import Utilities
 *
 * Utilities for implementing code splitting with dynamic imports.
 * Provides type-safe lazy loading of components and modules.
 */

import { lazy, ComponentType } from 'react';

// Type-safe dynamic component loader
export function lazyLoad<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  fallback?: ComponentType<any>
): T {
  const LazyComponent = lazy(factory) as T;

  if (fallback) {
    // Add fallback display name for debugging
    LazyComponent.displayName = `Lazy(${factory.name || 'Component'})`;
  }

  return LazyComponent;
}

// Preload function for eager loading
export function preloadComponent<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): Promise<void> {
  return factory().then(() => {
    // Component is now loaded and cached
  });
}

// Lazy load with retry mechanism
export function lazyLoadWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  maxRetries: number = 3,
  retryDelay: number = 1000
): T {
  return lazyLoad(() => {
    let retryCount = 0;

    const tryLoad = async (): Promise<{ default: T }> => {
      try {
        return await factory();
      } catch (error) {
        if (retryCount < maxRetries) {
          retryCount++;
          await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
          return tryLoad();
        }
        throw error;
      }
    };

    return tryLoad();
  });
}

// Dynamic import for non-component modules
export async function dynamicImport<T = any>(moduleFactory: () => Promise<T>): Promise<T> {
  try {
    return await moduleFactory();
  } catch (error) {
    console.error('Failed to dynamically import module:', error);
    throw error;
  }
}

// Conditional dynamic import based on feature flags or conditions
export function conditionalImport<T extends ComponentType<any>>(
  condition: boolean | (() => boolean),
  factory: () => Promise<{ default: T }>,
  fallback: T
): T {
  const shouldLoad = typeof condition === 'function' ? condition() : condition;

  if (shouldLoad) {
    return lazyLoad(factory);
  }

  return fallback;
}
