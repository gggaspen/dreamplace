'use client';
/**
 * Lazy Routes Configuration
 * Centralized configuration for code-split routes using Next.js dynamic imports
 */

import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { LoadingScreen } from '../../components/loading-screen/LoadingScreen';

// Custom loading components for different sections
const DashboardFallback = () => <LoadingScreen message='Loading dashboard...' />;
const AdminFallback = () => <LoadingScreen message='Loading admin panel...' />;
const AuthFallback = () => <LoadingScreen message='Loading authentication...' />;
const DemoFallback = () => <LoadingScreen message='Loading demo...' />;

// Lazy-loaded route components using Next.js dynamic imports
export const LazyRoutes = {
  // Authentication routes
  Login: dynamic(() => import('../../app/login/page'), {
    loading: AuthFallback,
    ssr: false, // Client-side only for auth pages
  }),

  // User routes
  Dashboard: dynamic(() => import('../../app/dashboard/page'), {
    loading: DashboardFallback,
    ssr: false, // Dashboard requires authentication
  }),

  // Admin routes
  Admin: dynamic(() => import('../../app/admin/page'), {
    loading: AdminFallback,
    ssr: false, // Admin requires authentication
  }),

  // Demo and utility routes
  Demo: dynamic(() => import('../../app/demo/page'), {
    loading: DemoFallback,
    ssr: true, // Demo can be server-side rendered
  }),
} as const;

// Route groups for preloading strategies
export const ROUTE_GROUPS = {
  // Critical routes - preload immediately
  CRITICAL: ['login', 'dashboard'],

  // Admin routes - preload only for admin users
  ADMIN: ['admin'],

  // Demo routes
  DEMO: ['demo'],
} as const;

// Route name mapping for dynamic imports
export const ROUTE_IMPORT_MAP = {
  login: () => import('../../app/login/page'),
  dashboard: () => import('../../app/dashboard/page'),
  admin: () => import('../../app/admin/page'),
  demo: () => import('../../app/demo/page'),
} as const;

// Preloading utilities optimized for Next.js dynamic imports
export class RoutePreloader {
  private static preloadedRoutes = new Set<string>();

  static async preloadRoute(routeName: keyof typeof ROUTE_IMPORT_MAP): Promise<void> {
    if (this.preloadedRoutes.has(routeName)) {
      return; // Already preloaded
    }

    try {
      // Preload the dynamic import
      await ROUTE_IMPORT_MAP[routeName]();
      this.preloadedRoutes.add(routeName);
      console.debug(`Preloaded route: ${routeName}`);
    } catch (error) {
      console.error(`Failed to preload route ${routeName}:`, error);
    }
  }

  static async preloadRouteGroup(routes: string[]): Promise<void> {
    const preloadPromises = routes.map(route =>
      this.preloadRoute(route as keyof typeof ROUTE_IMPORT_MAP)
    );
    await Promise.allSettled(preloadPromises);
  }

  static preloadCriticalRoutes(): void {
    // Preload critical routes immediately
    this.preloadRouteGroup(ROUTE_GROUPS.CRITICAL);
  }

  static preloadUserRoutes(userRoles: string[] = []): void {
    if (userRoles.includes('admin')) {
      this.preloadRouteGroup(ROUTE_GROUPS.ADMIN);
    }
  }

  static getPreloadedRoutes(): string[] {
    return Array.from(this.preloadedRoutes);
  }
}

// React component for route preloading
export function RoutePreloadManager({ userRoles = [] }: { userRoles?: string[] }) {
  useEffect(() => {
    // Preload critical routes on mount
    RoutePreloader.preloadCriticalRoutes();
  }, []);

  useEffect(() => {
    // Preload user-specific routes when roles change
    if (userRoles.length > 0) {
      RoutePreloader.preloadUserRoutes(userRoles);
    }
  }, [userRoles]);

  return null; // This component doesn't render anything
}
