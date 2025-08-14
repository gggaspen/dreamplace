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

// Dynamic import for better code splitting
const HomeContainer = dynamic(() => import('@/components/containers/HomeContainer').then(mod => ({ default: mod.HomeContainer })), {
  ssr: true,
  loading: () => <LoadingScreen />
});

export default function Home() {
  // Import CSS normally, but load HomeContainer dynamically
  React.useEffect(() => {
    import('@/app/css/motions.css');
  }, []);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <HomeContainer />
    </Suspense>
  );
}
