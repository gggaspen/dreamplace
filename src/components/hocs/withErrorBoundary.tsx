/**
 * withErrorBoundary HOC
 *
 * Higher-Order Component that wraps components with error boundary functionality.
 * Provides automatic error handling and fallback UI for any wrapped component.
 */

import React, { ComponentType } from 'react';
import { ErrorBoundary } from '@/infrastructure/error-handling/ErrorBoundary';
import { ErrorDisplay } from '@/components/presentations/ErrorDisplay';

interface ErrorBoundaryOptions {
  fallback?: ComponentType<{ error?: Error; resetErrorBoundary?: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
}

export function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  options: ErrorBoundaryOptions = {}
) {
  const {
    fallback: FallbackComponent = ErrorDisplay,
    onError,
    resetOnPropsChange = true,
  } = options;

  const WithErrorBoundaryComponent = (props: P) => {
    return (
      <ErrorBoundary
        fallback={({ error, resetErrorBoundary }) => (
          <FallbackComponent
            error={error}
            resetErrorBoundary={resetErrorBoundary}
            message={error?.message || 'Something went wrong'}
          />
        )}
        onError={onError}
        resetKeys={resetOnPropsChange ? Object.values(props as object) : undefined}
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WithErrorBoundaryComponent;
}
