/**
 * Login Page
 * Authentication entry point for users
 * Optimized with dynamic imports for better code splitting
 */

'use client';

// Force dynamic rendering to prevent SSR issues with auth
export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import dynamicImport from 'next/dynamic';
import LoadingScreen from '@/components/loading-screen/LoadingScreen';

// Dynamic import for login form to reduce initial bundle size
const LoginForm = dynamicImport(() => import('./LoginForm'), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <LoginForm />
    </Suspense>
  );
}
