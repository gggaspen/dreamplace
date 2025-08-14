/**
 * Route Configuration
 * Centralized route definitions and permissions
 */

import { UserRole } from '../../domain/auth/entities/User';

export interface RouteDefinition {
  path: string;
  requireAuth: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  title?: string;
  description?: string;
}

export const ROUTES: Record<string, RouteDefinition> = {
  // Public routes
  HOME: {
    path: '/',
    requireAuth: false,
    title: 'Home',
    description: 'DreamPlace main page'
  },
  LOGIN: {
    path: '/login',
    requireAuth: false,
    title: 'Sign In',
    description: 'User authentication'
  },
  REGISTER: {
    path: '/register',
    requireAuth: false,
    title: 'Sign Up',
    description: 'User registration'
  },
  FORGOT_PASSWORD: {
    path: '/forgot-password',
    requireAuth: false,
    title: 'Reset Password',
    description: 'Password recovery'
  },

  // Protected routes
  DASHBOARD: {
    path: '/dashboard',
    requireAuth: true,
    title: 'Dashboard',
    description: 'User dashboard'
  },
  PROFILE: {
    path: '/profile',
    requireAuth: true,
    title: 'Profile',
    description: 'User profile management'
  },
  SETTINGS: {
    path: '/settings',
    requireAuth: true,
    title: 'Settings',
    description: 'User settings'
  },

  // Admin routes
  ADMIN: {
    path: '/admin',
    requireAuth: true,
    allowedRoles: ['admin'],
    title: 'Admin Panel',
    description: 'Administrative dashboard'
  },
  ADMIN_USERS: {
    path: '/admin/users',
    requireAuth: true,
    allowedRoles: ['admin'],
    title: 'User Management',
    description: 'Manage platform users'
  },
  ADMIN_EVENTS: {
    path: '/admin/events',
    requireAuth: true,
    allowedRoles: ['admin', 'moderator'],
    title: 'Event Management',
    description: 'Manage events'
  },

  // Artist routes
  ARTIST_DASHBOARD: {
    path: '/artist',
    requireAuth: true,
    allowedRoles: ['artist', 'admin'],
    title: 'Artist Dashboard',
    description: 'Artist management panel'
  },
  ARTIST_EVENTS: {
    path: '/artist/events',
    requireAuth: true,
    allowedRoles: ['artist', 'admin'],
    title: 'My Events',
    description: 'Manage artist events'
  }
} as const;

export class RoutePermissions {
  static canAccessRoute(route: RouteDefinition, userRoles: UserRole[] = []): boolean {
    // Public routes are always accessible
    if (!route.requireAuth) {
      return true;
    }

    // If authentication is required but no roles specified, any authenticated user can access
    if (!route.allowedRoles || route.allowedRoles.length === 0) {
      return true;
    }

    // Check if user has any of the required roles
    return route.allowedRoles.some(role => userRoles.includes(role));
  }

  static getRouteByPath(path: string): RouteDefinition | undefined {
    return Object.values(ROUTES).find(route => route.path === path);
  }

  static getRoutesForUser(userRoles: UserRole[] = []): RouteDefinition[] {
    return Object.values(ROUTES).filter(route => 
      this.canAccessRoute(route, userRoles)
    );
  }

  static getRedirectUrl(route: RouteDefinition): string {
    return route.redirectTo || '/dashboard';
  }
}

// Route groups for easier management
export const ROUTE_GROUPS = {
  PUBLIC: [ROUTES.HOME, ROUTES.LOGIN, ROUTES.REGISTER, ROUTES.FORGOT_PASSWORD],
  PROTECTED: [ROUTES.DASHBOARD, ROUTES.PROFILE, ROUTES.SETTINGS],
  ADMIN: [ROUTES.ADMIN, ROUTES.ADMIN_USERS, ROUTES.ADMIN_EVENTS],
  ARTIST: [ROUTES.ARTIST_DASHBOARD, ROUTES.ARTIST_EVENTS]
} as const;