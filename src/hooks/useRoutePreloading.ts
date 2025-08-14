/**
 * Route Preloading Hook
 * Provides intelligent route preloading based on user behavior
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import {
  RoutePreloader,
  ROUTE_GROUPS,
  ROUTE_IMPORT_MAP,
} from '@/infrastructure/routing/LazyRoutes';

export interface PreloadingConfig {
  preloadOnHover?: boolean;
  preloadOnVisible?: boolean;
  preloadDelay?: number;
  preloadCritical?: boolean;
}

export function useRoutePreloading(config: PreloadingConfig = {}) {
  const {
    preloadOnHover = true,
    preloadOnVisible: _preloadOnVisible = true,
    preloadDelay = 1000,
    preloadCritical = true,
  } = config;

  const { user } = useAuth();
  const pathname = usePathname();
  useRouter();
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
    } else if (currentRoute === '/dashboard') {
      RoutePreloader.preloadRouteGroup(ROUTE_GROUPS.CRITICAL);
    } else if (currentRoute === '/demo') {
      RoutePreloader.preloadRouteGroup(ROUTE_GROUPS.DEMO);
    }
  }, [pathname]);

  // Create preload handler for links
  const createPreloadHandler = useCallback(
    (routePath: string) => {
      return {
        onMouseEnter: preloadOnHover
          ? () => {
              const timer = setTimeout(() => {
                // Find the corresponding route name and preload
                const routeName = findRouteName(routePath);
                if (routeName) {
                  RoutePreloader.preloadRoute(routeName);
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
              // Find the corresponding route name and preload
              const routeName = findRouteName(routePath);
              if (routeName) {
                RoutePreloader.preloadRoute(routeName);
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

// Helper function to find the route name for a given path
function findRouteName(routePath: string): keyof typeof ROUTE_IMPORT_MAP | null {
  const routeMap: Record<string, keyof typeof ROUTE_IMPORT_MAP> = {
    '/login': 'login',
    '/dashboard': 'dashboard',
    '/admin': 'admin',
    '/demo': 'demo',
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
            const routeName = findRouteName(routePath);
            if (routeName) {
              RoutePreloader.preloadRoute(routeName);
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
      const routeName = findRouteName(route);
      if (routeName) {
        RoutePreloader.preloadRoute(routeName);
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

  // Common navigation patterns for existing routes only
  if (current === '/dashboard') {
    predicted.push('/admin', '/demo');
  } else if (current === '/admin') {
    predicted.push('/dashboard');
  } else if (current === '/demo') {
    predicted.push('/dashboard');
  } else if (current === '/login') {
    predicted.push('/dashboard');
  } else if (current === '/') {
    predicted.push('/login', '/demo');
  }

  return predicted;
}
