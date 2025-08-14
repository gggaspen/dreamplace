/**
 * Lazy Routes Configuration
 * Centralized configuration for code-split routes
 */

import React from 'react';
import { createLazyComponent } from './LazyLoader';
import { LoadingScreen } from '@/components/loading-screen/LoadingScreen';

// Custom loading components for different sections
const DashboardFallback = () => (
  <LoadingScreen message="Loading dashboard..." />
);

const AdminFallback = () => (
  <LoadingScreen message="Loading admin panel..." />
);

const ArtistFallback = () => (
  <LoadingScreen message="Loading artist dashboard..." />
);

// Lazy-loaded route components
export const LazyRoutes = {
  // Authentication routes
  Login: createLazyComponent(
    () => import('@/app/login/page'),
    { chunkName: 'auth-login' }
  ),
  
  // Register: createLazyComponent(
  //   () => import('@/components/auth/RegisterForm'),
  //   { chunkName: 'auth-register' }
  // ),

  // ForgotPassword: createLazyComponent(
  //   () => import('@/components/auth/ForgotPasswordForm'),
  //   { chunkName: 'auth-forgot-password' }
  // ),

  // User routes
  Dashboard: createLazyComponent(
    () => import('@/app/dashboard/page'),
    { 
      fallback: DashboardFallback,
      chunkName: 'user-dashboard' 
    }
  ),

  // Profile: createLazyComponent(
  //   () => import('@/components/user/ProfilePage'),
  //   { chunkName: 'user-profile' }
  // ),

  // Settings: createLazyComponent(
  //   () => import('@/components/user/SettingsPage'),
  //   { chunkName: 'user-settings' }
  // ),

  // Admin routes
  Admin: createLazyComponent(
    () => import('@/app/admin/page'),
    { 
      fallback: AdminFallback,
      chunkName: 'admin-dashboard' 
    }
  ),

  // AdminUsers: createLazyComponent(
  //   () => import('@/components/admin/UserManagement'),
  //   { chunkName: 'admin-users' }
  // ),

  // AdminEvents: createLazyComponent(
  //   () => import('@/components/admin/EventManagement'),
  //   { chunkName: 'admin-events' }
  // ),

  // AdminSettings: createLazyComponent(
  //   () => import('@/components/admin/SystemSettings'),
  //   { chunkName: 'admin-settings' }
  // ),

  // Artist routes
  // ArtistDashboard: createLazyComponent(
  //   () => import('@/components/artist/ArtistDashboard'),
  //   { 
  //     fallback: ArtistFallback,
  //     chunkName: 'artist-dashboard' 
  //   }
  // ),

  // ArtistProfile: createLazyComponent(
  //   () => import('@/components/artist/ArtistProfile'),
  //   { chunkName: 'artist-profile' }
  // ),

  // ArtistEvents: createLazyComponent(
  //   () => import('@/components/artist/ArtistEvents'),
  //   { chunkName: 'artist-events' }
  // ),

  // Feature routes
  // Events: createLazyComponent(
  //   () => import('@/components/events/EventsPage'),
  //   { chunkName: 'events' }
  // ),

  // EventDetails: createLazyComponent(
  //   () => import('@/components/events/EventDetailsPage'),
  //   { chunkName: 'event-details' }
  // ),

  // Artists: createLazyComponent(
  //   () => import('@/components/artists/ArtistsPage'),
  //   { chunkName: 'artists' }
  // ),

  // ArtistDetails: createLazyComponent(
  //   () => import('@/components/artists/ArtistDetailsPage'),
  //   { chunkName: 'artist-details' }
  // ),

  // Demo and utility routes
  Demo: createLazyComponent(
    () => import('@/app/demo/page'),
    { chunkName: 'demo' }
  ),

  // Heavy components (charts, analytics, etc.)
  // Analytics: createLazyComponent(
  //   () => import('@/components/analytics/AnalyticsPage'),
  //   { chunkName: 'analytics' }
  // ),

  // Reports: createLazyComponent(
  //   () => import('@/components/reports/ReportsPage'),
  //   { chunkName: 'reports' }
  // )
} as const;

// Route groups for preloading strategies
export const ROUTE_GROUPS = {
  // Critical routes - preload immediately
  CRITICAL: [
    LazyRoutes.Login,
    LazyRoutes.Dashboard
  ],

  // High priority routes - preload on user interaction
  HIGH_PRIORITY: [
    // LazyRoutes.Profile,
    // LazyRoutes.Events,
    // LazyRoutes.Artists
  ],

  // Admin routes - preload only for admin users
  ADMIN: [
    LazyRoutes.Admin,
    // LazyRoutes.AdminUsers,
    // LazyRoutes.AdminEvents,
    // LazyRoutes.AdminSettings
  ],

  // Artist routes - preload only for artist users
  ARTIST: [
    // LazyRoutes.ArtistDashboard,
    // LazyRoutes.ArtistProfile,
    // LazyRoutes.ArtistEvents
  ],

  // Heavy routes - preload only when needed
  HEAVY: [
    // LazyRoutes.Analytics,
    // LazyRoutes.Reports
  ]
} as const;

// Preloading utilities
export class RoutePreloader {
  private static preloadedRoutes = new Set<string>();

  static async preloadRoute(routeComponent: React.LazyExoticComponent<any>): Promise<void> {
    const componentName = routeComponent.displayName || 'Unknown';
    
    if (this.preloadedRoutes.has(componentName)) {
      return; // Already preloaded
    }

    try {
      // @ts-ignore - accessing internal preload method
      if (routeComponent._init) {
        // @ts-ignore
        await routeComponent._init();
        this.preloadedRoutes.add(componentName);
        console.debug(`Preloaded route: ${componentName}`);
      }
    } catch (error) {
      console.error(`Failed to preload route ${componentName}:`, error);
    }
  }

  static async preloadRouteGroup(routes: React.LazyExoticComponent<any>[]): Promise<void> {
    const preloadPromises = routes.map(route => this.preloadRoute(route));
    await Promise.allSettled(preloadPromises);
  }

  static preloadCriticalRoutes(): void {
    // Preload critical routes immediately
    this.preloadRouteGroup(ROUTE_GROUPS.CRITICAL);
  }

  static preloadUserRoutes(userRoles: string[] = []): void {
    // Preload routes based on user roles
    this.preloadRouteGroup(ROUTE_GROUPS.HIGH_PRIORITY);

    if (userRoles.includes('admin')) {
      this.preloadRouteGroup(ROUTE_GROUPS.ADMIN);
    }

    if (userRoles.includes('artist')) {
      this.preloadRouteGroup(ROUTE_GROUPS.ARTIST);
    }
  }

  static getPreloadedRoutes(): string[] {
    return Array.from(this.preloadedRoutes);
  }
}

// React component for route preloading
export function RoutePreloadManager({ 
  userRoles = [] 
}: { 
  userRoles?: string[] 
}) {
  React.useEffect(() => {
    // Preload critical routes on mount
    RoutePreloader.preloadCriticalRoutes();
  }, []);

  React.useEffect(() => {
    // Preload user-specific routes when roles change
    if (userRoles.length > 0) {
      RoutePreloader.preloadUserRoutes(userRoles);
    }
  }, [userRoles]);

  return null; // This component doesn't render anything
}