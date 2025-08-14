/**
 * Deep Linking Demo Page
 * Demonstrates URL state management capabilities
 * Optimized with dynamic imports for better code splitting
 */

'use client';

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

import React, { Suspense } from 'react';
import dynamicImport from 'next/dynamic';
import LoadingScreen from '@/components/loading-screen/LoadingScreen';

// Dynamic imports for better code splitting
const DeepLinkDemo = dynamicImport(() => import('@/components/examples/DeepLinkDemo').then(mod => ({ default: mod.DeepLinkDemo })), {
  ssr: false,
  loading: () => <LoadingScreen />
});

const PageHeader = dynamicImport(() => import('@/components/navigation/PageHeader').then(mod => ({ default: mod.PageHeader })), {
  ssr: true,
  loading: () => <LoadingScreen />
});

const ChakraBox = dynamicImport(() => import('@chakra-ui/react').then(mod => ({ default: mod.Box })), {
  ssr: true
});

export default function DemoPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ChakraBox>
        <PageHeader
          title='Deep Linking Demo'
          subtitle='URL State Management'
          description='Experience how application state can be synchronized with URL parameters for shareable links and browser navigation.'
        />
        <DeepLinkDemo />
      </ChakraBox>
    </Suspense>
  );
}
