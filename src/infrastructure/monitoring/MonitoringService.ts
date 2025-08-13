import * as Sentry from '@sentry/nextjs';
import { Logger } from '../logging/Logger';
import { ErrorReport, ErrorCategory, ErrorSeverity } from '../error-handling/ErrorHandlingService';

/**
 * Performance metric types
 */
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

/**
 * User action tracking
 */
export interface UserAction {
  action: string;
  category: string;
  label?: string;
  value?: number;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  context?: Record<string, unknown>;
}

/**
 * Custom event tracking
 */
export interface CustomEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: Date;
}

/**
 * Monitoring service configuration
 */
export interface MonitoringConfig {
  enableSentry: boolean;
  enableConsoleLogging: boolean;
  enablePerformanceMonitoring: boolean;
  enableUserActionTracking: boolean;
  sampleRate: number;
}

/**
 * Comprehensive monitoring service with Sentry integration
 */
export class MonitoringService {
  private static instance: MonitoringService | null = null;
  private logger: Logger;
  private config: MonitoringConfig;
  private performanceObserver: PerformanceObserver | null = null;
  
  private constructor(config?: Partial<MonitoringConfig>) {
    this.logger = new Logger('MonitoringService');
    this.config = {
      enableSentry: process.env.NODE_ENV === 'production',
      enableConsoleLogging: process.env.NODE_ENV === 'development',
      enablePerformanceMonitoring: true,
      enableUserActionTracking: true,
      sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      ...config,
    };
    
    this.initializeMonitoring();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(config?: Partial<MonitoringConfig>): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService(config);
    }
    return MonitoringService.instance;
  }

  /**
   * Initialize monitoring services
   */
  private initializeMonitoring(): void {
    if (typeof window !== 'undefined') {
      this.initializePerformanceMonitoring();
      this.initializeUserActionTracking();
      this.initializeWebVitals();
    }
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (!this.config.enablePerformanceMonitoring) return;

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.trackPerformanceMetric({
            name: entry.name,
            value: entry.duration,
            unit: 'ms',
            timestamp: new Date(entry.startTime),
            context: {
              entryType: entry.entryType,
              startTime: entry.startTime,
            },
          });
        }
      });

      this.performanceObserver.observe({
        entryTypes: ['navigation', 'resource', 'measure', 'mark']
      });
    } catch (error) {
      this.logger.warn('Performance monitoring not available:', error);
    }
  }

  /**
   * Initialize user action tracking
   */
  private initializeUserActionTracking(): void {
    if (!this.config.enableUserActionTracking) return;

    // Track page views
    this.trackUserAction({
      action: 'page_view',
      category: 'navigation',
      label: window.location.pathname,
      timestamp: new Date(),
    });

    // Track clicks on important elements
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        const button = target.tagName === 'BUTTON' ? target : target.closest('button');
        this.trackUserAction({
          action: 'button_click',
          category: 'interaction',
          label: button?.textContent?.trim() || 'unknown',
          timestamp: new Date(),
          context: {
            elementId: button?.id,
            className: button?.className,
          },
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.trackUserAction({
        action: 'form_submit',
        category: 'interaction',
        label: form.id || form.className || 'unknown',
        timestamp: new Date(),
        context: {
          formId: form.id,
          formAction: form.action,
        },
      });
    });
  }

  /**
   * Initialize Web Vitals monitoring
   */
  private initializeWebVitals(): void {
    if (typeof window === 'undefined' || !this.config.enablePerformanceMonitoring) return;

    // Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          this.trackPerformanceMetric({
            name: 'LCP',
            value: entry.startTime,
            unit: 'ms',
            timestamp: new Date(),
          });
        }
        
        if (entry.entryType === 'first-input') {
          const fidEntry = entry as PerformanceEventTiming;
          this.trackPerformanceMetric({
            name: 'FID',
            value: fidEntry.processingStart - fidEntry.startTime,
            unit: 'ms',
            timestamp: new Date(),
          });
        }
        
        if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
          this.trackPerformanceMetric({
            name: 'CLS',
            value: (entry as any).value,
            unit: 'score',
            timestamp: new Date(),
          });
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (error) {
      this.logger.warn('Web Vitals monitoring not available:', error);
    }
  }

  /**
   * Report error to monitoring services
   */
  public reportError(errorReport: ErrorReport): void {
    if (this.config.enableConsoleLogging) {
      this.logger.error('Error reported to monitoring:', errorReport);
    }

    if (this.config.enableSentry) {
      Sentry.withScope((scope) => {
        // Set error context
        scope.setTag('errorId', errorReport.id);
        scope.setTag('category', errorReport.category);
        scope.setLevel(this.mapSeverityToSentryLevel(errorReport.severity));
        scope.setContext('errorReport', {
          id: errorReport.id,
          category: errorReport.category,
          severity: errorReport.severity,
          timestamp: errorReport.timestamp,
        });

        // Add user context
        if (errorReport.userId) {
          scope.setUser({ id: errorReport.userId });
        }

        // Add additional context
        if (errorReport.context) {
          scope.setContext('additionalContext', errorReport.context);
        }

        // Add component stack if available
        if (errorReport.componentStack) {
          scope.setContext('componentStack', {
            stack: errorReport.componentStack,
          });
        }

        // Capture the error
        Sentry.captureException(errorReport.error);
      });
    }
  }

  /**
   * Track performance metric
   */
  public trackPerformanceMetric(metric: PerformanceMetric): void {
    if (this.config.enableConsoleLogging) {
      this.logger.info(`Performance metric: ${metric.name} = ${metric.value}${metric.unit}`, metric.context);
    }

    if (this.config.enableSentry && Math.random() <= this.config.sampleRate) {
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `${metric.name}: ${metric.value}${metric.unit}`,
        level: 'info',
        data: metric.context,
        timestamp: metric.timestamp.getTime() / 1000,
      });
    }
  }

  /**
   * Track user action
   */
  public trackUserAction(action: UserAction): void {
    if (this.config.enableConsoleLogging) {
      this.logger.info(`User action: ${action.category}:${action.action}`, action);
    }

    if (this.config.enableSentry && Math.random() <= this.config.sampleRate) {
      Sentry.addBreadcrumb({
        category: action.category,
        message: action.action,
        level: 'info',
        data: {
          label: action.label,
          value: action.value,
          ...action.context,
        },
        timestamp: action.timestamp.getTime() / 1000,
      });
    }
  }

  /**
   * Track custom event
   */
  public trackEvent(event: CustomEvent): void {
    if (this.config.enableConsoleLogging) {
      this.logger.info(`Custom event: ${event.name}`, event.properties);
    }

    if (this.config.enableSentry) {
      Sentry.addBreadcrumb({
        category: 'custom',
        message: event.name,
        level: 'info',
        data: event.properties,
        timestamp: event.timestamp.getTime() / 1000,
      });
    }
  }

  /**
   * Set user context for monitoring
   */
  public setUser(user: { id: string; email?: string; username?: string }): void {
    if (this.config.enableSentry) {
      Sentry.setUser(user);
    }
  }

  /**
   * Set additional context tags
   */
  public setContext(key: string, context: Record<string, unknown>): void {
    if (this.config.enableSentry) {
      Sentry.setContext(key, context);
    }
  }

  /**
   * Add breadcrumb for debugging
   */
  public addBreadcrumb(message: string, category: string, data?: Record<string, unknown>): void {
    if (this.config.enableSentry) {
      Sentry.addBreadcrumb({
        message,
        category,
        level: 'info',
        data,
      });
    }
  }

  /**
   * Start a performance transaction
   */
  public startTransaction(name: string, operation: string): any {
    if (this.config.enableSentry) {
      return Sentry.startTransaction({
        name,
        op: operation,
      });
    }
    return null;
  }

  /**
   * Map error severity to Sentry level
   */
  private mapSeverityToSentryLevel(severity: ErrorSeverity): Sentry.SeverityLevel {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
        return 'fatal';
      case ErrorSeverity.HIGH:
        return 'error';
      case ErrorSeverity.MEDIUM:
        return 'warning';
      case ErrorSeverity.LOW:
        return 'info';
      default:
        return 'error';
    }
  }

  /**
   * Configure monitoring settings
   */
  public configure(config: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  public getConfig(): MonitoringConfig {
    return { ...this.config };
  }

  /**
   * Cleanup monitoring services
   */
  public cleanup(): void {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
  }
}

/**
 * Global monitoring service instance
 */
export const monitoringService = MonitoringService.getInstance();

/**
 * Convenience functions for common monitoring scenarios
 */
export const Monitor = {
  /**
   * Report error
   */
  reportError: (errorReport: ErrorReport) => {
    monitoringService.reportError(errorReport);
  },

  /**
   * Track performance
   */
  trackPerformance: (name: string, value: number, unit: string = 'ms') => {
    monitoringService.trackPerformanceMetric({
      name,
      value,
      unit,
      timestamp: new Date(),
    });
  },

  /**
   * Track user action
   */
  trackAction: (action: string, category: string, label?: string) => {
    monitoringService.trackUserAction({
      action,
      category,
      label,
      timestamp: new Date(),
    });
  },

  /**
   * Track custom event
   */
  trackEvent: (name: string, properties?: Record<string, unknown>) => {
    monitoringService.trackEvent({
      name,
      properties,
      timestamp: new Date(),
    });
  },

  /**
   * Set user context
   */
  setUser: (user: { id: string; email?: string; username?: string }) => {
    monitoringService.setUser(user);
  },

  /**
   * Add breadcrumb
   */
  addBreadcrumb: (message: string, category: string = 'custom', data?: Record<string, unknown>) => {
    monitoringService.addBreadcrumb(message, category, data);
  },
};