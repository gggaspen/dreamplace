import React, { ErrorInfo, ReactNode } from 'react';
import { getLogger, ILogger } from '../logging/Logger';

/**
 * Error boundary state interface
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

/**
 * Error boundary props interface
 */
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode | ((error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo, errorId: string) => void;
  resetKeys?: Array<string | number>;
  resetOnPropsChange?: boolean;
  isolate?: boolean;
  level?: 'page' | 'section' | 'component';
}

/**
 * Generate unique error ID
 */
function generateErrorId(): string {
  return `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Enhanced React Error Boundary with comprehensive error handling
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private logger: ILogger;
  private resetTimeoutId: number | null = null;
  private previousResetKeys: Array<string | number> = [];

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };

    try {
      this.logger = getLogger({ component: 'ErrorBoundary' });
    } catch (error) {
      // Fallback to console logging if logger not initialized
      this.logger = {
        debug: console.debug.bind(console),
        info: console.info.bind(console),
        warn: console.warn.bind(console),
        error: console.error.bind(console),
        child: () => this.logger,
      };
    }
    this.previousResetKeys = this.props.resetKeys || [];
  }

  /**
   * Static method called when error occurs
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: generateErrorId(),
    };
  }

  /**
   * Component did catch - called after error occurs
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorId = this.state.errorId || generateErrorId();

    // Update state with error info
    this.setState({ errorInfo, errorId });

    // Log the error
    this.logError(error, errorInfo, errorId);

    // Call optional error handler
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo, errorId);
      } catch (handlerError) {
        this.logger.error('Error in onError handler:', handlerError);
      }
    }

    // Report to external services if needed
    this.reportError(error, errorInfo, errorId);
  }

  /**
   * Component did update - check for reset conditions
   */
  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    const { resetKeys, resetOnPropsChange } = this.props;
    const { hasError } = this.state;

    // Check if component should reset based on resetKeys
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some((key, index) => {
        return prevProps.resetKeys?.[index] !== key;
      });

      if (hasResetKeyChanged) {
        this.resetError();
      }
    }

    // Check if component should reset based on props change
    if (hasError && resetOnPropsChange && prevProps !== this.props) {
      this.resetError();
    }
  }

  /**
   * Component will unmount - cleanup
   */
  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  /**
   * Log error with comprehensive information
   */
  private logError(error: Error, errorInfo: ErrorInfo, errorId: string): void {
    const errorData = {
      errorId,
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
      level: this.props.level || 'component',
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      props: this.props.isolate ? '[ISOLATED]' : this.filterSensitiveProps(),
    };

    this.logger.error('React Error Boundary caught error:', errorData);
  }

  /**
   * Filter sensitive information from props
   */
  private filterSensitiveProps(): Record<string, unknown> {
    const { children, onError, fallback, ...safeProps } = this.props;
    return safeProps;
  }

  /**
   * Report error to external monitoring services
   */
  private reportError(error: Error, errorInfo: ErrorInfo, errorId: string): void {
    // In a real application, you would send this to services like Sentry
    if (typeof window !== 'undefined' && window.console) {
      window.console.group(`🚨 Error Boundary [${errorId}]`);
      window.console.error('Error:', error);
      window.console.error('Component Stack:', errorInfo.componentStack);
      window.console.groupEnd();
    }
  }

  /**
   * Reset error boundary state
   */
  private resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  /**
   * Reset error with delay (useful for automatic recovery)
   */
  public resetErrorWithDelay(delay: number = 5000): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.resetTimeoutId = window.setTimeout(() => {
      this.resetError();
    }, delay);
  }

  /**
   * Get error summary for external use
   */
  public getErrorSummary(): {
    hasError: boolean;
    errorId: string | null;
    errorMessage: string | null;
  } {
    return {
      hasError: this.state.hasError,
      errorId: this.state.errorId,
      errorMessage: this.state.error?.message || null,
    };
  }

  render(): ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { fallback, children } = this.props;

    if (hasError && error) {
      // If custom fallback provided, use it
      if (fallback) {
        if (typeof fallback === 'function') {
          try {
            return fallback(error, errorInfo!, this.resetError);
          } catch (fallbackError) {
            this.logger.error('Error in fallback component:', fallbackError);
            // Fallback to default error UI if custom fallback fails
          }
        } else {
          return fallback;
        }
      }

      // Default error UI based on error level
      return this.renderDefaultErrorUI();
    }

    return children;
  }

  /**
   * Render default error UI based on level
   */
  private renderDefaultErrorUI(): ReactNode {
    const { level = 'component' } = this.props;
    const { error, errorId } = this.state;

    const baseStyles: React.CSSProperties = {
      padding: '1rem',
      margin: '0.5rem',
      border: '1px solid #ef4444',
      borderRadius: '0.5rem',
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      fontFamily: 'system-ui, sans-serif',
    };

    const levelStyles: Record<string, React.CSSProperties> = {
      page: {
        ...baseStyles,
        minHeight: '50vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.125rem',
      },
      section: {
        ...baseStyles,
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      },
      component: {
        ...baseStyles,
        fontSize: '0.875rem',
      },
    };

    return (
      <div style={levelStyles[level]} role='alert'>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.25em' }}>
          {level === 'page'
            ? 'Application Error'
            : level === 'section'
              ? 'Section Error'
              : 'Component Error'}
        </h2>

        <p style={{ margin: '0 0 1rem 0', textAlign: 'center' }}>
          {level === 'page'
            ? 'We encountered an unexpected error. Please try refreshing the page.'
            : 'This section encountered an error and could not be displayed.'}
        </p>

        {process.env.NODE_ENV === 'development' && (
          <>
            <details style={{ marginTop: '1rem', width: '100%' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                Error Details (Development Only)
              </summary>
              <div
                style={{
                  background: '#fff',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  whiteSpace: 'pre-wrap',
                  overflow: 'auto',
                  maxHeight: '200px',
                }}
              >
                <strong>Error ID:</strong> {errorId}
                <br />
                <strong>Message:</strong> {error?.message}
                <br />
                <strong>Stack:</strong>
                <br />
                {error?.stack}
              </div>
            </details>
          </>
        )}

        <button
          onClick={this.resetError}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            fontSize: '0.875rem',
          }}
          onMouseOver={e => {
            e.currentTarget.style.backgroundColor = '#b91c1c';
          }}
          onMouseOut={e => {
            e.currentTarget.style.backgroundColor = '#dc2626';
          }}
        >
          Try Again
        </button>
      </div>
    );
  }
}
