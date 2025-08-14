/**
 * Console Logger Implementation
 * Simple console-based logger for development and testing
 */

import { Logger, LogLevel, LogContext } from '../../domain/common/Logger';

export class ConsoleLogger implements Logger {
  constructor(
    private readonly namespace: string = 'DreamPlace',
    private readonly minLevel: LogLevel = 'info'
  ) {}

  debug(message: string, context?: LogContext): void {
    if (this.shouldLog('debug')) {
      this.log('debug', message, context);
    }
  }

  info(message: string, context?: LogContext): void {
    if (this.shouldLog('info')) {
      this.log('info', message, context);
    }
  }

  warn(message: string, context?: LogContext): void {
    if (this.shouldLog('warn')) {
      this.log('warn', message, context);
    }
  }

  error(message: string, context?: LogContext): void {
    if (this.shouldLog('error')) {
      this.log('error', message, context);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentIndex = levels.indexOf(level);
    const minIndex = levels.indexOf(this.minLevel);
    return currentIndex >= minIndex;
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${this.namespace}] [${level.toUpperCase()}]`;
    
    const logMethod = this.getConsoleMethod(level);
    
    if (context && Object.keys(context).length > 0) {
      logMethod(`${prefix} ${message}`, context);
    } else {
      logMethod(`${prefix} ${message}`);
    }
  }

  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case 'debug':
        return console.debug;
      case 'info':
        return console.info;
      case 'warn':
        return console.warn;
      case 'error':
        return console.error;
      default:
        return console.log;
    }
  }
}