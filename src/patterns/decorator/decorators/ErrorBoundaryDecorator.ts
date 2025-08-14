import React, { JSX, ComponentType, Component, ReactNode, ErrorInfo } from 'react';
import { BaseDecorator } from '../BaseDecorator';
import { DecoratorConfig, ErrorBoundaryDecoratorConfig } from '../types';
import {Hero} from '@/app/pages/hero/Hero';

/**
 * Error Boundary Decorator - wraps components with error boundary functionality
 */
export class ErrorBoundaryDecorator extends BaseDecorator {
  static displayName: string;

  constructor() {
    super({
      name: 'errorBoundary',
      description: 'Wraps components with error boundary to catch and handle errors gracefully',
      version: '1.0.0',
      dependencies: [],
      requiresProps: [],
    }, 10); // High priority - applied early to catch errors from other decorators
  }

  canDecorate(component: ComponentType, props?: any): boolean {
    return this.isValidComponent(component);
  }

  decorate(component: ComponentType, config?: DecoratorConfig): ComponentType {
    if (!this.validateConfig(config)) {
      throw new Error('Invalid error boundary decorator configuration');
    }

    const errorConfig = config as ErrorBoundaryDecoratorConfig;
    
    // Create error boundary class component
    class ErrorBoundaryWrapper extends Component<any, { hasError: boolean; error?: Error; errorInfo?: ErrorInfo }> {
      private resetTimeoutId?: NodeJS.Timeout;
      private previousProps?: any;
      static displayName: string;

      constructor(props: any) {
        super(props);
        this.state = { hasError: false };
        this.previousProps = props;
      }

      static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
      }

      componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ errorInfo });
        
        // Log error
        console.error(`[ErrorBoundary] Error caught in component:`, {
          error,
          errorInfo,
          component: component.displayName || component.name,
        });

        // Call custom error handler
        if (errorConfig?.options?.onError) {
          try {
            errorConfig.options.onError(error, errorInfo);
          } catch (handlerError) {
            console.error('[ErrorBoundary] Error in custom error handler:', handlerError);
          }
        }

        // Send error to monitoring service
        this.sendErrorToMonitoring(error, errorInfo);
      }

      componentDidUpdate(prevProps: any) {
        const { resetOnPropsChange, resetKeys } = errorConfig?.options || {};
        
        if (this.state.hasError && resetOnPropsChange) {
          if (resetKeys && resetKeys.length > 0) {
            // Check if any of the specified keys changed
            const hasKeyChanged = resetKeys.some(key => 
              prevProps[key] !== this.props[key]
            );
            
            if (hasKeyChanged) {
              this.resetErrorState();
            }
          } else {
            // Reset on any prop change
            if (JSON.stringify(prevProps) !== JSON.stringify(this.props)) {
              this.resetErrorState();
            }
          }
        }
      }

      componentWillUnmount() {
        if (this.resetTimeoutId) {
          clearTimeout(this.resetTimeoutId);
        }
      }

      resetErrorState = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      };

      retry = () => {
        this.resetErrorState();
      };

      render() {
        if (this.state.hasError) {
          return this.renderErrorFallback();
        }

        try {
          return React.createElement(component, this.props);
        } catch (error) {
          // Catch synchronous errors that might not trigger componentDidCatch
          console.error('[ErrorBoundary] Synchronous error caught:', error);
          return this.renderErrorFallback();
        }
      }

      private renderErrorFallback(): ReactNode {
        const { fallbackComponent: FallbackComponent } = errorConfig?.options || {};
        
        if (FallbackComponent) {
          return React.createElement(FallbackComponent, {
            error: this.state.error,
            errorInfo: this.state.errorInfo,
            retry: this.retry,
            resetErrorState: this.resetErrorState,
          });
        }

        return this.renderDefaultErrorFallback();
      }

      private renderDefaultErrorFallback(): ReactNode {
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        return React.createElement(
          'div',
          {
            style: {
              padding: '20px',
              border: '1px solid #ff6b6b',
              borderRadius: '8px',
              backgroundColor: '#fff5f5',
              color: '#d63031',
              fontFamily: 'system-ui, sans-serif',
              margin: '10px',
            },
          },
          React.createElement('h3', { 
            style: { margin: '0 0 10px 0', fontSize: '18px' } 
          }, '⚠️ Something went wrong'),
          
          React.createElement('p', { 
            style: { margin: '0 0 15px 0', fontSize: '14px' } 
          }, 'This component encountered an error and couldn\'t render properly.'),
          
          React.createElement('button', {
            onClick: this.retry,
            style: {
              padding: '8px 16px',
              backgroundColor: '#0984e3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              marginRight: '10px',
            },
          }, 'Try Again'),
          
          isDevelopment && this.state.error && React.createElement(
            'details',
            { style: { marginTop: '15px', fontSize: '12px' } },
            React.createElement('summary', { 
              style: { cursor: 'pointer', fontWeight: 'bold' } 
            }, 'Error Details (Development Only)'),
            React.createElement('pre', {
              style: {
                marginTop: '10px',
                padding: '10px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '200px',
                fontSize: '11px',
              },
            }, this.state.error.stack)
          )
        );
      }

      private sendErrorToMonitoring(error: Error, errorInfo: ErrorInfo): void {
        try {
          // Send to error monitoring service (Sentry, Bugsnag, etc.)
          if (typeof window !== 'undefined') {
            // Sentry
            if ((window as any).Sentry) {
              (window as any).Sentry.captureException(error, {
                contexts: {
                  react: {
                    componentStack: errorInfo.componentStack,
                  },
                },
                tags: {
                  component: component.displayName || component.name || 'Unknown',
                  decorator: 'errorBoundary',
                },
              });
            }

            // Custom error reporting
            this.reportToCustomEndpoint(error, errorInfo);
          }
        } catch (reportingError) {
          console.error('[ErrorBoundary] Failed to report error to monitoring:', reportingError);
        }
      }

      private async reportToCustomEndpoint(error: Error, errorInfo: ErrorInfo): Promise<void> {
        try {
          const endpoint = process.env.NEXT_PUBLIC_ERROR_REPORTING_ENDPOINT;
          if (!endpoint) return;

          const errorReport = {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            component: component.displayName || component.name || 'Unknown',
            url: typeof window !== 'undefined' ? window.location.href : 'unknown',
            userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
            timestamp: new Date().toISOString(),
            props: this.props,
          };

          await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(errorReport),
          });
        } catch (reportingError) {
          console.error('[ErrorBoundary] Failed to send error report:', reportingError);
        }
      }
    }

    // Set display name for debugging
    ErrorBoundaryWrapper.displayName = `ErrorBoundary(${component.displayName || component.name || 'Component'})`;

    return ErrorBoundaryWrapper as ComponentType;
  }
}

/**
 * Default Error Fallback Component
 */
export const DefaultErrorFallback: React.FC<{
  error?: Error;
  errorInfo?: ErrorInfo;
  retry?: () => void;
  resetErrorState?: () => void;
}> = ({ error, errorInfo, retry, resetErrorState }) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div style={{
      padding: '20px',
      border: '1px solid #ff6b6b',
      borderRadius: '8px',
      backgroundColor: '#fff5f5',
      color: '#d63031',
      fontFamily: 'system-ui, sans-serif',
      margin: '10px',
      textAlign: 'center',
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>⚠️ Component Error</h3>
      <p style={{ margin: '0 0 15px 0' }}>
        This component encountered an error. Please try refreshing the page or contact support if the problem persists.
      </p>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        {retry && (
          <button
            onClick={retry}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0984e3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        )}
        
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#636e72',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reload Page
        </button>
      </div>
  
      {isDevelopment && error && (
        <details style={{ marginTop: '20px', textAlign: 'left' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            Technical Details (Development Only)
          </summary>
          <pre style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '300px',
            fontSize: '12px',
          }}>
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
};