/**
 * App Providers Component
 * Centralizes all application providers with route preloading
 */

'use client';

import React, { ReactNode } from 'react';
import { Provider } from '@/components/ui/provider';
import { QueryProvider } from '@/infrastructure/providers/QueryProvider';
import { DIProvider } from '@/infrastructure/di/DIContext';
import { AuthProvider } from '@/infrastructure/providers/AuthProvider';
import { RoutePreloadManager } from '@/infrastructure/routing/LazyRoutes';
import { useAuth } from '@/infrastructure/auth/AuthContext';

interface AppProvidersProps {
  children: ReactNode;
}

function RoutePreloadWrapper({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <>
      <RoutePreloadManager userRoles={user?.profile.roles} />
      {children}
    </>
  );
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <DIProvider>
      <QueryProvider>
        <Provider>
          <AuthProvider>
            <RoutePreloadWrapper>{children}</RoutePreloadWrapper>
          </AuthProvider>
        </Provider>
      </QueryProvider>
    </DIProvider>
  );
}
