/**
 * Decorator Pattern Implementation for Component Enhancement
 *
 * The Decorator pattern allows behavior to be added to objects dynamically
 * without altering their structure. This is particularly useful for enhancing
 * React components with additional functionality like analytics, caching,
 * error boundaries, and performance monitoring.
 */

import { ComponentType, ReactElement } from 'react';

export interface ComponentDecorator<P = any> {
  name: string;
  description: string;
  order: number; // Lower numbers are applied first
  canDecorate(component: ComponentType<P>, props?: P): boolean;
  decorate(component: ComponentType<P>, config?: DecoratorConfig): ComponentType<P>;
  getMetadata(): DecoratorMetadata;
}

export interface DecoratorConfig {
  enabled?: boolean;
  priority?: number;
  options?: Record<string, unknown>;
  conditions?: DecoratorCondition[];
}

export interface DecoratorCondition {
  type: 'prop' | 'context' | 'environment' | 'custom';
  check: (props: any, context?: any) => boolean;
}

export interface DecoratorMetadata {
  name: string;
  description: string;
  version: string;
  dependencies?: string[];
  conflictsWith?: string[];
  requiresProps?: string[];
}

export interface IDecoratorRegistry {
  register(decorator: ComponentDecorator): void;
  unregister(decoratorName: string): boolean;
  getDecorator(name: string): ComponentDecorator | null;
  getAllDecorators(): ComponentDecorator[];
  decorateComponent<P>(
    component: ComponentType<P>,
    decoratorNames?: string[],
    config?: Record<string, DecoratorConfig>
  ): ComponentType<P>;
  canDecorate<P>(component: ComponentType<P>, decoratorName: string): boolean;
}

export enum DecoratorType {
  // Performance decorators
  MEMOIZATION = 'memoization',
  LAZY_LOADING = 'lazy_loading',
  VIRTUAL_SCROLLING = 'virtual_scrolling',

  // Analytics decorators
  CLICK_TRACKING = 'click_tracking',
  VIEW_TRACKING = 'view_tracking',
  PERFORMANCE_TRACKING = 'performance_tracking',

  // Error handling decorators
  ERROR_BOUNDARY = 'error_boundary',
  RETRY_LOGIC = 'retry_logic',
  FALLBACK_UI = 'fallback_ui',

  // Authentication decorators
  AUTH_REQUIRED = 'auth_required',
  ROLE_BASED = 'role_based',
  PERMISSION_CHECK = 'permission_check',

  // UI enhancement decorators
  LOADING_STATE = 'loading_state',
  SKELETON_LOADER = 'skeleton_loader',
  RESPONSIVE_WRAPPER = 'responsive_wrapper',
  THEME_PROVIDER = 'theme_provider',

  // Accessibility decorators
  FOCUS_TRAP = 'focus_trap',
  ARIA_ANNOUNCER = 'aria_announcer',
  KEYBOARD_NAV = 'keyboard_nav',

  // Data decorators
  CACHE_WRAPPER = 'cache_wrapper',
  DATA_FETCHER = 'data_fetcher',
  REAL_TIME_UPDATES = 'real_time_updates',
}

export interface AnalyticsDecoratorConfig extends DecoratorConfig {
  options?: {
    trackClicks?: boolean;
    trackViews?: boolean;
    trackScroll?: boolean;
    customEvents?: string[];
    userId?: string;
    sessionId?: string;
  };
}

export interface PerformanceDecoratorConfig extends DecoratorConfig {
  options?: {
    measureRender?: boolean;
    measureInteraction?: boolean;
    threshold?: number;
    reportToService?: boolean;
    serviceEndpoint?: string;
  };
}

export interface ErrorBoundaryDecoratorConfig extends DecoratorConfig {
  options?: {
    fallbackComponent?: ComponentType<any>;
    onError?: (error: Error, errorInfo: any) => void;
    resetOnPropsChange?: boolean;
    resetKeys?: string[];
    isolate?: boolean;
  };
}

export interface AuthDecoratorConfig extends DecoratorConfig {
  options?: {
    requiredRoles?: string[];
    requiredPermissions?: string[];
    redirectTo?: string;
    fallbackComponent?: ComponentType<any>;
    checkInterval?: number;
  };
}

export interface LoadingDecoratorConfig extends DecoratorConfig {
  options?: {
    showSpinner?: boolean;
    showSkeleton?: boolean;
    customLoader?: ComponentType<any>;
    minLoadingTime?: number;
    timeout?: number;
  };
}

export interface CacheDecoratorConfig extends DecoratorConfig {
  options?: {
    ttl?: number;
    strategy?: 'memory' | 'localStorage' | 'sessionStorage';
    keyGenerator?: (props: any) => string;
    invalidateOn?: string[];
    maxSize?: number;
  };
}

// Higher-order component factory
export interface HOCFactory<P = any> {
  create(config?: DecoratorConfig): (component: ComponentType<P>) => ComponentType<P>;
  withProps(additionalProps: Partial<P>): HOCFactory<P>;
  withCondition(condition: (props: P) => boolean): HOCFactory<P>;
  compose(...decorators: ComponentDecorator[]): ComponentType<P>;
}

// Decorator chain for multiple enhancements
export interface DecoratorChain<P = any> {
  add(decorator: ComponentDecorator, config?: DecoratorConfig): DecoratorChain<P>;
  remove(decoratorName: string): DecoratorChain<P>;
  reorder(decoratorNames: string[]): DecoratorChain<P>;
  apply(component: ComponentType<P>): ComponentType<P>;
  getOrder(): string[];
  validate(): { valid: boolean; conflicts: string[]; missing: string[] };
}

// Runtime decorator application
export interface RuntimeDecorator {
  applyDecorators(
    element: ReactElement,
    decorators: Array<{ name: string; config?: DecoratorConfig }>
  ): ReactElement;
  removeDecorators(element: ReactElement, decoratorNames: string[]): ReactElement;
  getAppliedDecorators(element: ReactElement): string[];
}
