/**
 * useErrorHandling Hook
 * 
 * Custom hook for managing error states and error recovery.
 * Provides consistent error handling patterns across components.
 */

import { useState, useCallback } from 'react';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorMessage: string;
}

interface UseErrorHandlingOptions {
  defaultErrorMessage?: string;
  logErrors?: boolean;
}

export const useErrorHandling = ({
  defaultErrorMessage = 'An unexpected error occurred',
  logErrors = true,
}: UseErrorHandlingOptions = {}) => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorMessage: '',
  });

  // Handle error
  const handleError = useCallback((error: Error | string) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    const message = errorObj.message || defaultErrorMessage;

    if (logErrors) {
      console.error('Error caught by useErrorHandling:', errorObj);
    }

    setErrorState({
      hasError: true,
      error: errorObj,
      errorMessage: message,
    });
  }, [defaultErrorMessage, logErrors]);

  // Clear error
  const clearError = useCallback(() => {
    setErrorState({
      hasError: false,
      error: null,
      errorMessage: '',
    });
  }, []);

  // Try/catch wrapper
  const withErrorHandling = useCallback(
    <T extends any[], R>(
      fn: (...args: T) => R,
      errorCallback?: (error: Error) => void
    ) => {
      return (...args: T): R | undefined => {
        try {
          return fn(...args);
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          handleError(errorObj);
          errorCallback?.(errorObj);
          return undefined;
        }
      };
    },
    [handleError]
  );

  // Async try/catch wrapper
  const withAsyncErrorHandling = useCallback(
    <T extends any[], R>(
      fn: (...args: T) => Promise<R>,
      errorCallback?: (error: Error) => void
    ) => {
      return async (...args: T): Promise<R | undefined> => {
        try {
          return await fn(...args);
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error));
          handleError(errorObj);
          errorCallback?.(errorObj);
          return undefined;
        }
      };
    },
    [handleError]
  );

  return {
    // State
    hasError: errorState.hasError,
    error: errorState.error,
    errorMessage: errorState.errorMessage,
    
    // Actions
    handleError,
    clearError,
    
    // Utilities
    withErrorHandling,
    withAsyncErrorHandling,
  };
};