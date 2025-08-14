'use client';

/**
 * Home Page
 *
 * This page now follows the container/presentational pattern.
 * All business logic has been moved to HomeContainer,
 * and this page serves as the entry point.
 * Optimized with dynamic imports for better code splitting.
 */

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/loading-screen/LoadingScreen';
import { DIErrorFallback } from '@/components/fallback/DIErrorFallback';
import '@/app/css/motions.css';

// Dynamic import for better code splitting
const HomeContainer = dynamic(
  () =>
    import('@/components/containers/HomeContainer').then(mod => ({ default: mod.HomeContainer })),
  {
    ssr: true,
    loading: () => <LoadingScreen />,
  }
);

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <DIErrorFallback error={this.state.error} resetErrorBoundary={() => {
        this.setState({ hasError: false, error: undefined });
      }} />;
    }

    return this.props.children;
  }
}

export default function Home() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <HomeContainer />
      </Suspense>
    </ErrorBoundary>
  );
}
