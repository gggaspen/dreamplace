/**
 * Deep Linking Demo Page
 * Demonstrates URL state management capabilities
 */

'use client';

import React from 'react';
import { DeepLinkDemo } from '@/components/examples/DeepLinkDemo';
import { PageHeader } from '@/components/navigation/PageHeader';
import { Box } from '@chakra-ui/react';

export default function DemoPage() {
  return (
    <Box>
      <PageHeader
        title="Deep Linking Demo"
        subtitle="URL State Management"
        description="Experience how application state can be synchronized with URL parameters for shareable links and browser navigation."
      />
      <DeepLinkDemo />
    </Box>
  );
}