/**
 * ErrorBoundaryProvider Render Props Component
 * 
 * Provides error boundary functionality through render props pattern.
 * Gives full control over error UI while managing error state.
 */

import React, { ReactNode } from 'react';
import { ErrorBoundary } from '@/infrastructure/error-handling/ErrorBoundary';

interface ErrorBoundaryProviderRenderProps {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  resetError: () => void;
}

interface ErrorBoundaryProviderProps {
  children: (props: ErrorBoundaryProviderRenderProps) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetKeys?: Array<string | number | boolean | null | undefined>;
  resetOnPropsChange?: boolean;
}

export const ErrorBoundaryProvider: React.FC<ErrorBoundaryProviderProps> = ({
  children,
  onError,
  resetKeys,
  resetOnPropsChange = true,
}) => {
  return (
    <ErrorBoundary
      fallback={({ error, resetErrorBoundary, errorInfo }) => {
        return (
          <>
            {children({
              hasError: true,
              error,
              errorInfo,
              resetError: resetErrorBoundary,
            })}
          </>
        );
      }}
      onError={onError}
      resetKeys={resetOnPropsChange ? resetKeys : undefined}
    >
      {children({
        hasError: false,
        error: null,
        errorInfo: null,
        resetError: () => {},
      })}
    </ErrorBoundary>
  );
};