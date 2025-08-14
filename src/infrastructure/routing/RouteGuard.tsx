/**
 * Route Guard Component
 * Protects routes based on authentication status and user permissions
 */

'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthContext';
import { UserRole } from '../../domain/auth/entities/User';
import { LoadingScreen } from '@/components/loading-screen/LoadingScreen';

export interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireRoles?: UserRole[];
  fallbackComponent?: ReactNode;
  redirectTo?: string;
}

export function RouteGuard({
  children,
  requireAuth = false,
  requireRoles = [],
  fallbackComponent,
  redirectTo = '/login'
}: RouteGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check role requirements
    if (requireRoles.length > 0 && user) {
      const hasRequiredRole = user.hasAnyRole(requireRoles);
      if (!hasRequiredRole) {
        setIsAuthorized(false);
        return;
      }
    }

    setIsAuthorized(true);
  }, [user, isLoading, isAuthenticated, requireAuth, requireRoles, router, redirectTo]);

  // Show loading while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show fallback if not authorized
  if (!isAuthorized && (requireAuth || requireRoles.length > 0)) {
    if (fallbackComponent) {
      return <>{fallbackComponent}</>;
    }
    
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Higher-order component version
export function withRouteGuard(
  Component: React.ComponentType,
  guardProps: Omit<RouteGuardProps, 'children'>
) {
  return function GuardedComponent(props: any) {
    return (
      <RouteGuard {...guardProps}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}

// Specific guards for common use cases
export function AdminGuard({ children }: { children: ReactNode }) {
  return (
    <RouteGuard requireAuth requireRoles={['admin']}>
      {children}
    </RouteGuard>
  );
}

export function ArtistGuard({ children }: { children: ReactNode }) {
  return (
    <RouteGuard requireAuth requireRoles={['artist', 'admin']}>
      {children}
    </RouteGuard>
  );
}

export function AuthGuard({ children }: { children: ReactNode }) {
  return (
    <RouteGuard requireAuth>
      {children}
    </RouteGuard>
  );
}