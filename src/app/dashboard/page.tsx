/**
 * Dashboard Page
 * Protected user dashboard
 * Optimized with dynamic imports for better code splitting
 */

'use client';

// Force dynamic rendering to prevent SSR issues with auth
export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import dynamicImport from 'next/dynamic';
import { AuthGuard } from '@/infrastructure/routing/RouteGuard';
import LoadingScreen from '@/components/loading-screen/LoadingScreen';

// Dynamic import for dashboard content to reduce initial bundle size
const DashboardContent = dynamicImport(() => import('./DashboardContent'), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Suspense fallback={<LoadingScreen />}>
        <DashboardContent />
      </Suspense>
    </AuthGuard>
  );
}
