import React from 'react';
import { ErrorBoundary, ErrorBoundaryProps } from './ErrorBoundary';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { WarningIcon, RefreshIcon } from '@chakra-ui/icons';

/**
 * Page-level error boundary with full-page error UI
 */
export function withPageErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Partial<ErrorBoundaryProps>
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary
      level="page"
      fallback={(error, errorInfo, reset) => (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="red.50"
          p={8}
        >
          <VStack spacing={6} textAlign="center" maxW="md">
            <WarningIcon boxSize={16} color="red.500" />
            <Heading size="lg" color="red.700">
              Oops! Something went wrong
            </Heading>
            <Text color="red.600">
              We encountered an unexpected error while loading this page. 
              Please try refreshing or contact support if the problem persists.
            </Text>
            <VStack spacing={3}>
              <Button
                leftIcon={<RefreshIcon />}
                colorScheme="red"
                onClick={reset}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </VStack>
            {process.env.NODE_ENV === 'development' && (
              <Box
                bg="white"
                p={4}
                rounded="md"
                border="1px solid"
                borderColor="red.200"
                fontSize="sm"
                textAlign="left"
                maxW="full"
                overflow="auto"
              >
                <Text fontWeight="bold" mb={2}>Development Error Details:</Text>
                <Text fontFamily="mono" whiteSpace="pre-wrap" fontSize="xs">
                  {error.message}
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      )}
      {...options}
    >
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));

  WrappedComponent.displayName = `withPageErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Section-level error boundary with compact error UI
 */
export function withSectionErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Partial<ErrorBoundaryProps>
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary
      level="section"
      fallback={(error, errorInfo, reset) => (
        <Box
          p={6}
          bg="red.50"
          border="1px solid"
          borderColor="red.200"
          rounded="md"
          textAlign="center"
        >
          <VStack spacing={4}>
            <WarningIcon color="red.500" />
            <Heading size="sm" color="red.700">
              Section Unavailable
            </Heading>
            <Text fontSize="sm" color="red.600">
              This section could not be loaded due to an error.
            </Text>
            <Button size="sm" colorScheme="red" onClick={reset}>
              Retry
            </Button>
          </VStack>
        </Box>
      )}
      {...options}
    >
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));

  WrappedComponent.displayName = `withSectionErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Component-level error boundary with minimal error UI
 */
export function withComponentErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Partial<ErrorBoundaryProps>
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary
      level="component"
      fallback={(error, errorInfo, reset) => (
        <Box
          p={3}
          bg="red.50"
          border="1px dashed"
          borderColor="red.300"
          rounded="sm"
          fontSize="sm"
          textAlign="center"
        >
          <Text color="red.600" mb={2}>
            Component failed to load
          </Text>
          <Button size="xs" colorScheme="red" variant="outline" onClick={reset}>
            Retry
          </Button>
        </Box>
      )}
      {...options}
    >
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));

  WrappedComponent.displayName = `withComponentErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Async component error boundary for handling async operations
 */
export function withAsyncErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: Partial<ErrorBoundaryProps>
) {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary
      level="section"
      resetOnPropsChange={true}
      fallback={(error, errorInfo, reset) => (
        <Box
          p={6}
          bg="orange.50"
          border="1px solid"
          borderColor="orange.200"
          rounded="md"
          textAlign="center"
        >
          <VStack spacing={4}>
            <WarningIcon color="orange.500" />
            <Heading size="sm" color="orange.700">
              Loading Failed
            </Heading>
            <Text fontSize="sm" color="orange.600">
              Failed to load data. Please check your connection and try again.
            </Text>
            <Button size="sm" colorScheme="orange" onClick={reset}>
              Retry Loading
            </Button>
          </VStack>
        </Box>
      )}
      {...options}
    >
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));

  WrappedComponent.displayName = `withAsyncErrorBoundary(${Component.displayName || Component.name})`;
  return WrappedComponent;
}

/**
 * Error boundary hook for functional components
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
}

/**
 * Suspense error boundary for handling React Suspense errors
 */
export function SuspenseErrorBoundary({ 
  children, 
  fallback = <div>Loading...</div>,
  errorFallback
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}) {
  const ErrorFallback = errorFallback || (({ error, retry }: { error: Error; retry: () => void }) => (
    <Box p={6} textAlign="center" bg="red.50" rounded="md">
      <VStack spacing={4}>
        <WarningIcon color="red.500" />
        <Text color="red.600">Failed to load content</Text>
        <Button size="sm" colorScheme="red" onClick={retry}>
          Try Again
        </Button>
      </VStack>
    </Box>
  ));

  return (
    <ErrorBoundary
      fallback={(error, errorInfo, reset) => <ErrorFallback error={error} retry={reset} />}
    >
      <React.Suspense fallback={fallback}>
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
}