import { BaseObserver } from '../BaseObserver';
import { IObservable } from '../types';

export interface LogEvent {
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  category?: string;
  data?: unknown;
  userId?: string;
  sessionId?: string;
  source?: string;
}

/**
 * Logging Observer - centralizes application logging
 */
export class LoggingObserver extends BaseObserver<LogEvent> {
  private logService: any; // External logging service (Winston, Pino, etc.)
  private logBuffer: LogEvent[] = [];
  private maxBufferSize: number = 100;
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(logService?: any, maxBufferSize: number = 100) {
    super('logging_observer');
    this.logService = logService;
    this.maxBufferSize = maxBufferSize;

    // Auto-flush logs every 10 seconds
    this.flushInterval = setInterval(() => this.flushLogs(), 10000);
  }

  async update(data: LogEvent, eventType: string, source: IObservable<LogEvent>): Promise<void> {
    if (!this.isActive()) return;

    const enrichedLog = this.enrichLogEvent(data, eventType);

    // Add to buffer
    this.logBuffer.push(enrichedLog);

    // Flush if buffer is full or high priority log
    if (this.logBuffer.length >= this.maxBufferSize || data.level === 'error') {
      await this.flushLogs();
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(enrichedLog);
    }
  }

  onError(error: Error, eventType: string): void {
    const errorLog: LogEvent = {
      level: 'error',
      message: `Observer error for event ${eventType}: ${error.message}`,
      category: 'observer',
      data: {
        error: error.message,
        stack: error.stack,
        eventType,
      },
    };

    // Log the error immediately without going through the buffer
    this.logToConsole(errorLog);
    if (this.logService) {
      this.logService.error(errorLog.message, errorLog.data);
    }
  }

  private enrichLogEvent(data: LogEvent, eventType: string): LogEvent {
    return {
      ...data,
      data: {
        ...data.data,
        eventType,
        timestamp: new Date().toISOString(),
        observerId: this.id,
        environment: process.env.NODE_ENV,
      },
    };
  }

  private logToConsole(logEvent: LogEvent): void {
    const { level, message, data } = logEvent;
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    switch (level) {
      case 'debug':
        console.debug(prefix, message, data);
        break;
      case 'info':
        console.info(prefix, message, data);
        break;
      case 'warn':
        console.warn(prefix, message, data);
        break;
      case 'error':
        console.error(prefix, message, data);
        break;
    }
  }

  private async flushLogs(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    const logsToFlush = [...this.logBuffer];
    this.logBuffer = [];

    try {
      if (this.logService?.batch) {
        await this.logService.batch(logsToFlush);
      } else if (this.logService) {
        // Send logs individually
        for (const log of logsToFlush) {
          switch (log.level) {
            case 'debug':
              this.logService.debug?.(log.message, log.data);
              break;
            case 'info':
              this.logService.info?.(log.message, log.data);
              break;
            case 'warn':
              this.logService.warn?.(log.message, log.data);
              break;
            case 'error':
              this.logService.error?.(log.message, log.data);
              break;
          }
        }
      }

      this.log(`Flushed ${logsToFlush.length} log entries`);
    } catch (error) {
      console.error('Failed to flush logs to external service:', error);
      // Re-add logs to buffer for retry (with limit to prevent memory issues)
      if (this.logBuffer.length < this.maxBufferSize) {
        this.logBuffer.unshift(...logsToFlush.slice(-this.maxBufferSize / 2));
      }
    }
  }

  // Cleanup method
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }

    // Flush remaining logs
    this.flushLogs().catch(console.error);
    this.deactivate();
  }

  // Get current buffer size for monitoring
  getBufferSize(): number {
    return this.logBuffer.length;
  }

  // Manual flush
  async flush(): Promise<void> {
    await this.flushLogs();
  }
}
