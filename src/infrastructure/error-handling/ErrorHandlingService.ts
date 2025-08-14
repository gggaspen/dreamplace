import { Logger } from '../logging/Logger';
import { monitoringService } from '../monitoring/MonitoringService';

/**
 * Error severity levels
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Error categories for better organization
 */
export enum ErrorCategory {
  API = 'api',
  UI = 'ui',
  VALIDATION = 'validation',
  PERMISSION = 'permission',
  NETWORK = 'network',
  UNKNOWN = 'unknown',
}

/**
 * Structured error information
 */
export interface ErrorReport {
  id: string;
  error: Error;
  severity: ErrorSeverity;
  category: ErrorCategory;
  context?: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
  stackTrace?: string;
  componentStack?: string;
}

/**
 * Error handler function type
 */
export type ErrorHandler = (report: ErrorReport) => void | Promise<void>;

/**
 * Recovery strategy function type
 */
export type RecoveryStrategy = (
  error: Error,
  context?: Record<string, unknown>
) => boolean | Promise<boolean>;

/**
 * Centralized error handling service
 */
export class ErrorHandlingService {
  private static instance: ErrorHandlingService | null = null;
  private logger: Logger;
  private handlers: Map<ErrorCategory, ErrorHandler[]> = new Map();
  private recoveryStrategies: Map<ErrorCategory, RecoveryStrategy[]> = new Map();
  private errorHistory: ErrorReport[] = [];
  private maxHistorySize = 100;

  private constructor() {
    this.logger = new Logger('ErrorHandlingService');
    this.setupDefaultHandlers();
    this.setupGlobalErrorHandlers();
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): ErrorHandlingService {
    if (!ErrorHandlingService.instance) {
      ErrorHandlingService.instance = new ErrorHandlingService();
    }
    return ErrorHandlingService.instance;
  }

  /**
   * Setup default error handlers
   */
  private setupDefaultHandlers(): void {
    // Console logging handler for all categories
    const consoleHandler: ErrorHandler = report => {
      this.logger.error(`[${report.category.toUpperCase()}] ${report.error.message}`, {
        errorId: report.id,
        severity: report.severity,
        context: report.context,
        stackTrace: report.stackTrace,
      });
    };

    // Add console handler to all categories
    Object.values(ErrorCategory).forEach(category => {
      this.addHandler(category, consoleHandler);
    });

    // Critical error handler
    this.addHandler(ErrorCategory.API, report => {
      if (report.severity === ErrorSeverity.CRITICAL) {
        // In a real app, this would send to monitoring service
        console.error('🚨 CRITICAL ERROR DETECTED', report);
      }
    });
  }

  /**
   * Setup global error handlers for uncaught errors
   */
  private setupGlobalErrorHandlers(): void {
    if (typeof window !== 'undefined') {
      // Handle uncaught JavaScript errors
      window.addEventListener('error', event => {
        this.handleError(event.error || new Error(event.message), {
          category: ErrorCategory.UNKNOWN,
          severity: ErrorSeverity.HIGH,
          context: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
          },
        });
      });

      // Handle unhandled promise rejections
      window.addEventListener('unhandledrejection', event => {
        this.handleError(
          event.reason instanceof Error ? event.reason : new Error(String(event.reason)),
          {
            category: ErrorCategory.UNKNOWN,
            severity: ErrorSeverity.HIGH,
            context: {
              type: 'unhandledPromiseRejection',
              reason: event.reason,
            },
          }
        );
      });
    }
  }

  /**
   * Generate unique error ID
   */
  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Get current context information
   */
  private getCurrentContext(): Partial<ErrorReport> {
    const context: Partial<ErrorReport> = {
      timestamp: new Date(),
    };

    if (typeof window !== 'undefined') {
      context.url = window.location.href;
      context.userAgent = navigator.userAgent;
      context.sessionId = sessionStorage.getItem('sessionId') || undefined;
    }

    return context;
  }

  /**
   * Determine error category from error
   */
  private determineCategory(error: Error): ErrorCategory {
    const message = error.message.toLowerCase();
    const name = error.name.toLowerCase();

    if (name.includes('networkerror') || message.includes('network')) {
      return ErrorCategory.NETWORK;
    }

    if (name.includes('validationerror') || message.includes('validation')) {
      return ErrorCategory.VALIDATION;
    }

    if (name.includes('permissionerror') || message.includes('permission')) {
      return ErrorCategory.PERMISSION;
    }

    if (message.includes('fetch') || message.includes('api') || message.includes('http')) {
      return ErrorCategory.API;
    }

    if (message.includes('render') || message.includes('component')) {
      return ErrorCategory.UI;
    }

    return ErrorCategory.UNKNOWN;
  }

  /**
   * Determine error severity from error
   */
  private determineSeverity(error: Error, category: ErrorCategory): ErrorSeverity {
    const message = error.message.toLowerCase();

    // Critical errors
    if (
      message.includes('out of memory') ||
      message.includes('security') ||
      message.includes('cors') ||
      category === ErrorCategory.PERMISSION
    ) {
      return ErrorSeverity.CRITICAL;
    }

    // High severity errors
    if (
      message.includes('network') ||
      message.includes('500') ||
      message.includes('internal server error') ||
      category === ErrorCategory.API
    ) {
      return ErrorSeverity.HIGH;
    }

    // Medium severity errors
    if (
      message.includes('404') ||
      message.includes('validation') ||
      category === ErrorCategory.VALIDATION
    ) {
      return ErrorSeverity.MEDIUM;
    }

    return ErrorSeverity.LOW;
  }

  /**
   * Main error handling method
   */
  public async handleError(
    error: Error,
    options: {
      category?: ErrorCategory;
      severity?: ErrorSeverity;
      context?: Record<string, unknown>;
      componentStack?: string;
    } = {}
  ): Promise<string> {
    const category = options.category || this.determineCategory(error);
    const severity = options.severity || this.determineSeverity(error, category);

    const report: ErrorReport = {
      id: this.generateErrorId(),
      error,
      severity,
      category,
      context: options.context,
      componentStack: options.componentStack,
      stackTrace: error.stack,
      ...this.getCurrentContext(),
    };

    // Add to error history
    this.addToHistory(report);

    // Try recovery strategies first
    const recovered = await this.tryRecovery(report);
    if (recovered) {
      this.logger.info(`Error recovered successfully: ${report.id}`);
      return report.id;
    }

    // Execute error handlers
    const handlers = this.handlers.get(category) || [];
    await Promise.all(
      handlers.map(async handler => {
        try {
          await handler(report);
        } catch (handlerError) {
          this.logger.error('Error in error handler:', handlerError);
        }
      })
    );

    // Report to monitoring service
    try {
      monitoringService.reportError(report);
    } catch (monitoringError) {
      this.logger.error('Failed to report error to monitoring service:', monitoringError);
    }

    return report.id;
  }

  /**
   * Try recovery strategies for the error
   */
  private async tryRecovery(report: ErrorReport): Promise<boolean> {
    const strategies = this.recoveryStrategies.get(report.category) || [];

    for (const strategy of strategies) {
      try {
        const recovered = await strategy(report.error, report.context);
        if (recovered) {
          return true;
        }
      } catch (recoveryError) {
        this.logger.error('Error in recovery strategy:', recoveryError);
      }
    }

    return false;
  }

  /**
   * Add error to history
   */
  private addToHistory(report: ErrorReport): void {
    this.errorHistory.unshift(report);

    // Maintain history size limit
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize);
    }
  }

  /**
   * Add error handler for specific category
   */
  public addHandler(category: ErrorCategory, handler: ErrorHandler): void {
    if (!this.handlers.has(category)) {
      this.handlers.set(category, []);
    }
    this.handlers.get(category)!.push(handler);
  }

  /**
   * Remove error handler
   */
  public removeHandler(category: ErrorCategory, handler: ErrorHandler): void {
    const handlers = this.handlers.get(category);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Add recovery strategy for specific category
   */
  public addRecoveryStrategy(category: ErrorCategory, strategy: RecoveryStrategy): void {
    if (!this.recoveryStrategies.has(category)) {
      this.recoveryStrategies.set(category, []);
    }
    this.recoveryStrategies.get(category)!.push(strategy);
  }

  /**
   * Get error history
   */
  public getErrorHistory(): ErrorReport[] {
    return [...this.errorHistory];
  }

  /**
   * Clear error history
   */
  public clearErrorHistory(): void {
    this.errorHistory = [];
  }

  /**
   * Get error statistics
   */
  public getErrorStatistics(): {
    total: number;
    byCategory: Record<ErrorCategory, number>;
    bySeverity: Record<ErrorSeverity, number>;
  } {
    const stats = {
      total: this.errorHistory.length,
      byCategory: {} as Record<ErrorCategory, number>,
      bySeverity: {} as Record<ErrorSeverity, number>,
    };

    // Initialize counters
    Object.values(ErrorCategory).forEach(category => {
      stats.byCategory[category] = 0;
    });
    Object.values(ErrorSeverity).forEach(severity => {
      stats.bySeverity[severity] = 0;
    });

    // Count errors
    this.errorHistory.forEach(report => {
      stats.byCategory[report.category]++;
      stats.bySeverity[report.severity]++;
    });

    return stats;
  }

  /**
   * Check if error is recoverable
   */
  public isRecoverable(error: Error): boolean {
    const message = error.message.toLowerCase();

    // Non-recoverable errors
    if (
      message.includes('out of memory') ||
      message.includes('security') ||
      message.includes('permission denied')
    ) {
      return false;
    }

    return true;
  }

  /**
   * Create error from message
   */
  public createError(
    message: string,
    category: ErrorCategory = ErrorCategory.UNKNOWN,
    severity: ErrorSeverity = ErrorSeverity.LOW,
    context?: Record<string, unknown>
  ): Error {
    const error = new Error(message);
    error.name = `${category.toUpperCase()}Error`;

    // Handle the error immediately
    this.handleError(error, { category, severity, context });

    return error;
  }
}

/**
 * Global error handling service instance
 */
export const errorHandlingService = ErrorHandlingService.getInstance();

/**
 * Convenience functions for common error handling scenarios
 */
export const ErrorHandlers = {
  /**
   * Handle API errors
   */
  handleApiError: (error: Error, context?: Record<string, unknown>) => {
    return errorHandlingService.handleError(error, {
      category: ErrorCategory.API,
      severity: ErrorSeverity.HIGH,
      context,
    });
  },

  /**
   * Handle UI errors
   */
  handleUIError: (error: Error, context?: Record<string, unknown>) => {
    return errorHandlingService.handleError(error, {
      category: ErrorCategory.UI,
      severity: ErrorSeverity.MEDIUM,
      context,
    });
  },

  /**
   * Handle validation errors
   */
  handleValidationError: (error: Error, context?: Record<string, unknown>) => {
    return errorHandlingService.handleError(error, {
      category: ErrorCategory.VALIDATION,
      severity: ErrorSeverity.LOW,
      context,
    });
  },

  /**
   * Handle network errors
   */
  handleNetworkError: (error: Error, context?: Record<string, unknown>) => {
    return errorHandlingService.handleError(error, {
      category: ErrorCategory.NETWORK,
      severity: ErrorSeverity.HIGH,
      context,
    });
  },
};
