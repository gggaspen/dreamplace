/**
 * Lazy Loader Component
 * Provides loading states and error handling for dynamically imported components
 */

'use client';

import React, { ComponentType, LazyExoticComponent, Suspense } from 'react';
import { Box, Spinner, Text, VStack, Button, Alert } from '@chakra-ui/react';
import { LoadingScreen } from '../../components/loading-screen/LoadingScreen';

export interface LazyLoaderProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  error?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export interface LazyComponentOptions {
  fallback?: React.ComponentType;
  error?: React.ComponentType<{ error: Error; retry: () => void }>;
  chunkName?: string;
}

/**
 * Wrapper component for lazy-loaded routes with error boundaries
 */
export function LazyLoader({
  children,
  fallback: FallbackComponent = DefaultFallback,
  error: ErrorComponent = DefaultErrorBoundary,
}: LazyLoaderProps) {
  return (
    <Suspense fallback={<FallbackComponent />}>
      <ErrorBoundary ErrorComponent={ErrorComponent}>{children}</ErrorBoundary>
    </Suspense>
  );
}

/**
 * Error boundary for lazy-loaded components
 */
class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    ErrorComponent: React.ComponentType<{ error: Error; retry: () => void }>;
  },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <this.props.ErrorComponent
          error={this.state.error}
          retry={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default loading fallback
 */
function DefaultFallback() {
  return (
    <Box minH='400px' display='flex' alignItems='center' justifyContent='center' bg='gray.50'>
      <VStack spacing={4}>
        <Spinner size='xl' color='blue.500' thickness='4px' />
        <Text color='gray.600'>Loading...</Text>
      </VStack>
    </Box>
  );
}

/**
 * Default error boundary component
 */
function DefaultErrorBoundary({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <Box p={8} textAlign='center'>
      <Alert status='error' flexDirection='column' alignItems='center' p={6}>
        <VStack spacing={4} mt={4}>
          <Text fontSize='lg' fontWeight='bold' color='red.500'>
            ⚠️ Failed to load component
          </Text>
          <Text color='gray.600' fontSize='sm'>
            {error.message || 'An unexpected error occurred'}
          </Text>
          <Button onClick={retry} colorScheme='blue' size='sm'>
            Try Again
          </Button>
        </VStack>
      </Alert>
    </Box>
  );
}

/**
 * Higher-order function to create lazy-loaded components with options
 */
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: LazyComponentOptions = {}
): LazyExoticComponent<ComponentType<P>> {
  const LazyComponent = React.lazy(importFn);

  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <LazyLoader fallback={options.fallback} error={options.error}>
      <LazyComponent {...props} ref={ref} />
    </LazyLoader>
  ));

  WrappedComponent.displayName = `LazyWrapper(${LazyComponent.displayName || 'Component'})`;

  return WrappedComponent as LazyExoticComponent<ComponentType<P>>;
}

/**
 * Preload a lazy component
 */
export function preloadComponent<P>(
  lazyComponent: LazyExoticComponent<ComponentType<P>>
): Promise<void> {
  // @ts-ignore - accessing internal preload method
  if (lazyComponent._init) {
    // @ts-ignore
    return lazyComponent._init();
  }
  return Promise.resolve();
}

/**
 * Component for progressive loading with skeleton
 */
export function ProgressiveLoader({
  children,
  skeleton,
}: {
  children: React.ReactNode;
  skeleton?: React.ReactNode;
}) {
  return <Suspense fallback={skeleton || <DefaultFallback />}>{children}</Suspense>;
}

/**
 * Hook for preloading components on hover/focus
 */
export function usePreloadOnHover<P>(lazyComponent: LazyExoticComponent<ComponentType<P>>) {
  const preload = React.useCallback(() => {
    preloadComponent(lazyComponent);
  }, [lazyComponent]);

  return {
    onMouseEnter: preload,
    onFocus: preload,
  };
}
