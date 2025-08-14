/**
 * Route Preloading Hook
 * Provides intelligent route preloading based on user behavior
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { RoutePreloader, ROUTE_GROUPS, LazyRoutes } from '@/infrastructure/routing/LazyRoutes';

export interface PreloadingConfig {
  preloadOnHover?: boolean;
  preloadOnVisible?: boolean;
  preloadDelay?: number;
  preloadCritical?: boolean;
}

export function useRoutePreloading(config: PreloadingConfig = {}) {
  const {
    preloadOnHover = true,
    preloadOnVisible = true,
    preloadDelay = 1000,
    preloadCritical = true,
  } = config;

  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const preloadTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Preload routes based on user roles
  useEffect(() => {
    if (preloadCritical) {
      RoutePreloader.preloadCriticalRoutes();
    }

    if (user) {
      RoutePreloader.preloadUserRoutes(user.profile.roles);
    }
  }, [user, preloadCritical]);

  // Preload routes based on current location
  useEffect(() => {
    const currentRoute = pathname;

    // Preload related routes based on current page
    if (currentRoute.startsWith('/admin')) {
      RoutePreloader.preloadRouteGroup(ROUTE_GROUPS.ADMIN);
    } else if (currentRoute.startsWith('/artist')) {
      RoutePreloader.preloadRouteGroup(ROUTE_GROUPS.ARTIST);
    } else if (currentRoute === '/dashboard') {
      RoutePreloader.preloadRouteGroup(ROUTE_GROUPS.HIGH_PRIORITY);
    }
  }, [pathname]);

  // Create preload handler for links
  const createPreloadHandler = useCallback(
    (routePath: string) => {
      return {
        onMouseEnter: preloadOnHover
          ? () => {
              const timer = setTimeout(() => {
                // Find the corresponding lazy route component
                const routeComponent = findRouteComponent(routePath);
                if (routeComponent) {
                  RoutePreloader.preloadRoute(routeComponent);
                }
              }, preloadDelay);

              preloadTimersRef.current.set(routePath, timer);
            }
          : undefined,

        onMouseLeave: preloadOnHover
          ? () => {
              const timer = preloadTimersRef.current.get(routePath);
              if (timer) {
                clearTimeout(timer);
                preloadTimersRef.current.delete(routePath);
              }
            }
          : undefined,

        onFocus: preloadOnHover
          ? () => {
              // Find the corresponding lazy route component
              const routeComponent = findRouteComponent(routePath);
              if (routeComponent) {
                RoutePreloader.preloadRoute(routeComponent);
              }
            }
          : undefined,
      };
    },
    [preloadOnHover, preloadDelay]
  );

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      preloadTimersRef.current.forEach(timer => clearTimeout(timer));
      preloadTimersRef.current.clear();
    };
  }, []);

  return {
    createPreloadHandler,
    preloadRoute: RoutePreloader.preloadRoute,
    preloadRouteGroup: RoutePreloader.preloadRouteGroup,
    getPreloadedRoutes: RoutePreloader.getPreloadedRoutes,
  };
}

// Helper function to find the route component for a given path
function findRouteComponent(routePath: string): React.LazyExoticComponent<any> | null {
  const routeMap: Record<string, React.LazyExoticComponent<any>> = {
    '/login': LazyRoutes.Login,
    '/register': LazyRoutes.Register,
    '/forgot-password': LazyRoutes.ForgotPassword,
    '/dashboard': LazyRoutes.Dashboard,
    '/profile': LazyRoutes.Profile,
    '/settings': LazyRoutes.Settings,
    '/admin': LazyRoutes.Admin,
    '/admin/users': LazyRoutes.AdminUsers,
    '/admin/events': LazyRoutes.AdminEvents,
    '/admin/settings': LazyRoutes.AdminSettings,
    '/artist': LazyRoutes.ArtistDashboard,
    '/artist/profile': LazyRoutes.ArtistProfile,
    '/artist/events': LazyRoutes.ArtistEvents,
    '/events': LazyRoutes.Events,
    '/artists': LazyRoutes.Artists,
    '/analytics': LazyRoutes.Analytics,
    '/reports': LazyRoutes.Reports,
    '/demo': LazyRoutes.Demo,
  };

  return routeMap[routePath] || null;
}

/**
 * Hook for intersection observer-based preloading
 */
export function useVisibilityPreloading(routePath: string, options: IntersectionObserverInit = {}) {
  const elementRef = useRef<HTMLElement>(null);
  const hasPreloaded = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasPreloaded.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasPreloaded.current) {
            const routeComponent = findRouteComponent(routePath);
            if (routeComponent) {
              RoutePreloader.preloadRoute(routeComponent);
              hasPreloaded.current = true;
            }
          }
        });
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [routePath, options]);

  return elementRef;
}

/**
 * Hook for prefetching routes based on user navigation patterns
 */
export function useSmartPreloading() {
  const pathname = usePathname();
  const navigationHistory = useRef<string[]>([]);

  useEffect(() => {
    // Track navigation history
    navigationHistory.current.push(pathname);

    // Keep only last 5 routes
    if (navigationHistory.current.length > 5) {
      navigationHistory.current = navigationHistory.current.slice(-5);
    }

    // Predict next routes based on patterns
    const predictedRoutes = predictNextRoutes(navigationHistory.current);

    // Preload predicted routes
    predictedRoutes.forEach(route => {
      const routeComponent = findRouteComponent(route);
      if (routeComponent) {
        RoutePreloader.preloadRoute(routeComponent);
      }
    });
  }, [pathname]);

  return {
    navigationHistory: navigationHistory.current,
    predictedRoutes: predictNextRoutes(navigationHistory.current),
  };
}

// Simple route prediction based on common navigation patterns
function predictNextRoutes(history: string[]): string[] {
  const current = history[history.length - 1];
  const predicted: string[] = [];

  // Common navigation patterns
  if (current === '/dashboard') {
    predicted.push('/profile', '/events', '/artists');
  } else if (current === '/admin') {
    predicted.push('/admin/users', '/admin/events', '/admin/settings');
  } else if (current === '/events') {
    predicted.push('/artists', '/dashboard');
  } else if (current === '/artists') {
    predicted.push('/events', '/dashboard');
  } else if (current.startsWith('/admin/')) {
    predicted.push('/admin');
  }

  return predicted;
}
