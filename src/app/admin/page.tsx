/**
 * Admin Page
 * Protected admin-only dashboard
 * Optimized with dynamic imports for better code splitting
 */

'use client';

// Force dynamic rendering to prevent SSR issues with auth
export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import dynamicImport from 'next/dynamic';
import { AdminGuard } from '@/infrastructure/routing/RouteGuard';
import LoadingScreen from '@/components/loading-screen/LoadingScreen';

// Dynamic import for admin content to reduce initial bundle size
const AdminContent = dynamicImport(() => import('./AdminContent'), {
  ssr: false,
  loading: () => <LoadingScreen />
});

export default function AdminPage() {
  return (
    <AdminGuard>
      <Suspense fallback={<LoadingScreen />}>
        <AdminContent />
      </Suspense>
    </AdminGuard>
  );
}
