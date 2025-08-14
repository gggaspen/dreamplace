import { BaseObserver } from '../BaseObserver';
import { IObservable } from '../types';

export interface ErrorEvent {
  error: Error;
  context: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Error Observer - centralized error handling and reporting
 */
export class ErrorObserver extends BaseObserver<ErrorEvent> {
  private errorService?: any; // External error service (Sentry, Bugsnag, etc.)
  private errorHistory: Array<ErrorEvent & { timestamp: Date; id: string }> = [];
  private maxHistorySize: number = 100;
  private errorCounts: Map<string, number> = new Map();

  constructor(errorService?: any, maxHistorySize: number = 100) {
    super('error_observer');
    this.errorService = errorService;
    this.maxHistorySize = maxHistorySize;
  }

  async update(
    data: ErrorEvent,
    eventType: string,
    source: IObservable<ErrorEvent>
  ): Promise<void> {
    if (!this.isActive()) return;

    const errorWithMetadata = {
      ...data,
      timestamp: new Date(),
      id: this.generateErrorId(),
    };

    // Add to history
    this.errorHistory.push(errorWithMetadata);

    // Maintain history size
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory.shift();
    }

    // Track error frequency
    const errorKey = this.getErrorKey(data.error);
    this.errorCounts.set(errorKey, (this.errorCounts.get(errorKey) || 0) + 1);

    // Log error
    this.logError(errorWithMetadata);

    // Report to external service
    await this.reportError(errorWithMetadata);

    // Check for error patterns
    this.analyzeErrorPatterns(errorWithMetadata);
  }

  onError(error: Error, eventType: string): void {
    // Handle errors in the error observer itself
    console.error(`ErrorObserver failed for event ${eventType}:`, error);
  }

  private generateErrorId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getErrorKey(error: Error): string {
    return `${error.name}:${error.message}`;
  }

  private logError(errorEvent: ErrorEvent & { timestamp: Date; id: string }): void {
    const { error, context, severity, component, action, timestamp, id } = errorEvent;

    const severityEmoji = {
      low: '📝',
      medium: '⚠️',
      high: '❌',
      critical: '🚨',
    }[severity];

    console.group(`${severityEmoji} Error [${severity.toUpperCase()}] - ${id}`);
    console.log('Timestamp:', timestamp.toISOString());
    console.log('Context:', context);
    console.log('Component:', component || 'Unknown');
    console.log('Action:', action || 'Unknown');
    console.log('Error:', error);
    if (errorEvent.metadata) {
      console.log('Metadata:', errorEvent.metadata);
    }
    console.groupEnd();
  }

  private async reportError(
    errorEvent: ErrorEvent & { timestamp: Date; id: string }
  ): Promise<void> {
    try {
      if (this.errorService?.captureException) {
        // Sentry-style service
        this.errorService.captureException(errorEvent.error, {
          tags: {
            context: errorEvent.context,
            severity: errorEvent.severity,
            component: errorEvent.component,
          },
          extra: {
            ...errorEvent.metadata,
            timestamp: errorEvent.timestamp,
            errorId: errorEvent.id,
          },
          user: errorEvent.userId ? { id: errorEvent.userId } : undefined,
        });
      } else if (this.errorService?.notify) {
        // Bugsnag-style service
        this.errorService.notify(errorEvent.error, {
          context: errorEvent.context,
          severity: errorEvent.severity,
          metaData: {
            custom: errorEvent.metadata,
            system: {
              timestamp: errorEvent.timestamp,
              errorId: errorEvent.id,
              component: errorEvent.component,
            },
          },
          user: errorEvent.userId ? { id: errorEvent.userId } : undefined,
        });
      } else if (this.errorService?.log) {
        // Generic logging service
        await this.errorService.log({
          level: 'error',
          message: errorEvent.error.message,
          error: errorEvent.error,
          ...errorEvent,
        });
      }
    } catch (reportError) {
      console.error('Failed to report error to external service:', reportError);
    }
  }

  private analyzeErrorPatterns(errorEvent: ErrorEvent & { timestamp: Date; id: string }): void {
    const errorKey = this.getErrorKey(errorEvent.error);
    const errorCount = this.errorCounts.get(errorKey) || 0;

    // Check for repeated errors
    if (errorCount > 5) {
      console.warn(`🔁 Repeated error detected: ${errorKey}`, `Occurred ${errorCount} times`);

      // Escalate if it's becoming frequent
      if (errorCount > 20) {
        this.escalateError(errorEvent, `Frequent error: ${errorCount} occurrences`);
      }
    }

    // Check for error bursts (multiple errors in short time)
    const recentErrors = this.errorHistory.filter(
      e => Date.now() - e.timestamp.getTime() < 60000 // Last minute
    );

    if (recentErrors.length > 10) {
      console.warn(`💥 Error burst detected: ${recentErrors.length} errors in the last minute`);
      this.escalateError(errorEvent, `Error burst: ${recentErrors.length} errors/minute`);
    }

    // Check for critical errors
    if (errorEvent.severity === 'critical') {
      this.escalateError(errorEvent, 'Critical error occurred');
    }
  }

  private escalateError(
    errorEvent: ErrorEvent & { timestamp: Date; id: string },
    reason: string
  ): void {
    console.error(`🚨 ESCALATED ERROR: ${reason}`, errorEvent);

    // In a real application, this might:
    // - Send alerts to monitoring systems
    // - Notify development team
    // - Trigger automated recovery procedures
    // - Create incident tickets
  }

  // Get error statistics
  getErrorStatistics(): {
    totalErrors: number;
    errorsByContext: Record<string, number>;
    errorsBySeverity: Record<string, number>;
    mostFrequentErrors: Array<{ error: string; count: number }>;
    recentErrorRate: number;
  } {
    const totalErrors = this.errorHistory.length;

    const errorsByContext = this.errorHistory.reduce(
      (acc, event) => {
        acc[event.context] = (acc[event.context] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const errorsBySeverity = this.errorHistory.reduce(
      (acc, event) => {
        acc[event.severity] = (acc[event.severity] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostFrequentErrors = Array.from(this.errorCounts.entries())
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate recent error rate (errors per minute in last 10 minutes)
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const recentErrors = this.errorHistory.filter(e => e.timestamp.getTime() > tenMinutesAgo);
    const recentErrorRate = recentErrors.length / 10; // errors per minute

    return {
      totalErrors,
      errorsByContext,
      errorsBySeverity,
      mostFrequentErrors,
      recentErrorRate,
    };
  }

  // Get error history
  getErrorHistory(): Array<ErrorEvent & { timestamp: Date; id: string }> {
    return [...this.errorHistory];
  }

  // Clear error history
  clearHistory(): void {
    this.errorHistory = [];
    this.errorCounts.clear();
  }
}
