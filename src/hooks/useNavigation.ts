/**
 * Navigation Hook
 * Provides navigation state and utilities
 */

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import {
  RouteHelpers,
  BreadcrumbItem,
  NavigationItem,
  RouteMetadata,
} from '@/infrastructure/routing/RouteHelpers';
import { RoutePermissions } from '@/infrastructure/routing/RouteConfig';

export interface NavigationState {
  pathname: string;
  breadcrumbs: BreadcrumbItem[];
  navigationItems: NavigationItem[];
  routeMetadata: RouteMetadata;
  canAccessRoute: (path: string) => boolean;
  isCurrentRoute: (path: string) => boolean;
  navigateTo: (path: string) => void;
  goBack: () => void;
}

export function useNavigation(): NavigationState {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const userRoles = user?.profile.roles || [];

  const navigationState = useMemo(() => {
    const breadcrumbs = RouteHelpers.generateBreadcrumbs(pathname);
    const navigationItems = RouteHelpers.getNavigationItems(userRoles);
    const routeMetadata = RouteHelpers.getRouteMetadata(pathname);

    return {
      pathname,
      breadcrumbs,
      navigationItems,
      routeMetadata,
      canAccessRoute: (path: string) => RouteHelpers.canUserAccessRoute(path, userRoles),
      isCurrentRoute: (path: string) => RouteHelpers.matchesRoute(pathname, path),
      navigateTo: (path: string) => {
        if (RouteHelpers.canUserAccessRoute(path, userRoles)) {
          router.push(path);
        } else {
          console.warn(`User does not have permission to access ${path}`);
        }
      },
      goBack: () => router.back(),
    };
  }, [pathname, router, userRoles]);

  return navigationState;
}

/**
 * Hook for managing page-specific breadcrumbs
 */
export function useBreadcrumbs(customBreadcrumbs?: BreadcrumbItem[]) {
  const { breadcrumbs: defaultBreadcrumbs } = useNavigation();

  return useMemo(() => {
    return customBreadcrumbs || defaultBreadcrumbs;
  }, [customBreadcrumbs, defaultBreadcrumbs]);
}

/**
 * Hook for checking route permissions
 */
export function useRoutePermissions() {
  const { user } = useAuth();
  const userRoles = user?.profile.roles || [];

  return useMemo(
    () => ({
      canAccessRoute: (path: string) => RouteHelpers.canUserAccessRoute(path, userRoles),
      requiresAuth: (path: string) => RouteHelpers.requiresAuth(path),
      getDefaultRoute: () => RouteHelpers.getDefaultRouteForUser(userRoles),
      userRoles,
    }),
    [userRoles]
  );
}

/**
 * Hook for managing page metadata
 */
export function usePageMetadata(customMetadata?: Partial<RouteMetadata>) {
  const { routeMetadata } = useNavigation();

  return useMemo(
    () => ({
      ...routeMetadata,
      ...customMetadata,
    }),
    [routeMetadata, customMetadata]
  );
}
