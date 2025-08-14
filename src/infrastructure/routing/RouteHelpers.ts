/**
 * Route Helper Functions
 * Utility functions for route management and navigation
 */

import { UserRole } from '../../domain/auth/entities/User';
import { ROUTES, RouteDefinition, RoutePermissions } from './RouteConfig';

export class RouteHelpers {
  /**
   * Check if a route requires authentication
   */
  static requiresAuth(path: string): boolean {
    const route = RoutePermissions.getRouteByPath(path);
    return route?.requireAuth ?? false;
  }

  /**
   * Check if a user can access a specific route
   */
  static canUserAccessRoute(path: string, userRoles: UserRole[] = []): boolean {
    const route = RoutePermissions.getRouteByPath(path);
    if (!route) return true; // Allow access to undefined routes (fallback)
    return RoutePermissions.canAccessRoute(route, userRoles);
  }

  /**
   * Get the appropriate redirect URL based on user roles
   */
  static getDefaultRouteForUser(userRoles: UserRole[] = []): string {
    // Admin users go to admin panel
    if (userRoles.includes('admin')) {
      return ROUTES.ADMIN.path;
    }
    
    // Artist users go to artist dashboard
    if (userRoles.includes('artist')) {
      return ROUTES.ARTIST_DASHBOARD.path;
    }
    
    // Regular users go to dashboard
    return ROUTES.DASHBOARD.path;
  }

  /**
   * Build a navigation menu based on user permissions
   */
  static getNavigationItems(userRoles: UserRole[] = []): NavigationItem[] {
    const items: NavigationItem[] = [];

    // Always include home
    items.push({
      label: 'Home',
      path: ROUTES.HOME.path,
      icon: 'home'
    });

    // Add user-specific navigation items
    if (userRoles.length > 0) {
      items.push({
        label: 'Dashboard',
        path: ROUTES.DASHBOARD.path,
        icon: 'dashboard'
      });

      items.push({
        label: 'Profile',
        path: ROUTES.PROFILE.path,
        icon: 'user'
      });

      // Artist-specific items
      if (userRoles.includes('artist') || userRoles.includes('admin')) {
        items.push({
          label: 'Artist Panel',
          path: ROUTES.ARTIST_DASHBOARD.path,
          icon: 'music'
        });
      }

      // Admin-specific items
      if (userRoles.includes('admin')) {
        items.push({
          label: 'Admin Panel',
          path: ROUTES.ADMIN.path,
          icon: 'admin'
        });
      }
    } else {
      // Public navigation items
      items.push({
        label: 'Sign In',
        path: ROUTES.LOGIN.path,
        icon: 'login'
      });
    }

    return items;
  }

  /**
   * Generate breadcrumb trail for a given path
   */
  static generateBreadcrumbs(path: string): BreadcrumbItem[] {
    const segments = path.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];

    // Always start with home
    breadcrumbs.push({
      label: 'Home',
      path: '/',
      isActive: path === '/'
    });

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isActive = index === segments.length - 1;
      
      // Try to find route definition for better labels
      const route = RoutePermissions.getRouteByPath(currentPath);
      const label = route?.title || this.formatSegmentLabel(segment);

      breadcrumbs.push({
        label,
        path: currentPath,
        isActive
      });
    });

    return breadcrumbs;
  }

  /**
   * Format a URL segment into a readable label
   */
  private static formatSegmentLabel(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Check if the current path matches a route pattern
   */
  static matchesRoute(currentPath: string, routePath: string): boolean {
    // Exact match
    if (currentPath === routePath) return true;
    
    // Check if current path starts with route path (for nested routes)
    if (routePath !== '/' && currentPath.startsWith(routePath)) {
      return true;
    }
    
    return false;
  }

  /**
   * Get route metadata for SEO and page titles
   */
  static getRouteMetadata(path: string): RouteMetadata {
    const route = RoutePermissions.getRouteByPath(path);
    
    return {
      title: route?.title || 'DreamPlace',
      description: route?.description || 'Electronic music events and artists platform',
      path
    };
  }
}

// Type definitions
export interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  children?: NavigationItem[];
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive: boolean;
}

export interface RouteMetadata {
  title: string;
  description: string;
  path: string;
}