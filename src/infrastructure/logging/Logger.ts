import { LoggingConfig } from '../config/AppConfig';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: Record<string, unknown>;
  error?: Error;
}

export interface ILogger {
  debug(message: string, meta?: Record<string, unknown>): void;
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, error?: Error, meta?: Record<string, unknown>): void;
  child(meta: Record<string, unknown>): ILogger;
}

class Logger implements ILogger {
  private readonly config: LoggingConfig;
  private readonly contextMeta: Record<string, unknown>;

  constructor(config: LoggingConfig, contextMeta: Record<string, unknown> = {}) {
    this.config = config;
    this.contextMeta = contextMeta;
  }

  debug(message: string, meta: Record<string, unknown> = {}): void {
    this.log('debug', message, meta);
  }

  info(message: string, meta: Record<string, unknown> = {}): void {
    this.log('info', message, meta);
  }

  warn(message: string, meta: Record<string, unknown> = {}): void {
    this.log('warn', message, meta);
  }

  error(message: string, error?: Error, meta: Record<string, unknown> = {}): void {
    this.log('error', message, meta, error);
  }

  child(meta: Record<string, unknown>): ILogger {
    return new Logger(this.config, { ...this.contextMeta, ...meta });
  }

  private log(level: LogLevel, message: string, meta: Record<string, unknown> = {}, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta: { ...this.contextMeta, ...meta },
      error
    };

    if (this.config.outputs.includes('console')) {
      this.logToConsole(entry);
    }

    if (this.config.outputs.includes('file') && this.config.filename) {
      this.logToFile(entry);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    
    return messageLevelIndex >= currentLevelIndex;
  }

  private logToConsole(entry: LogEntry): void {
    if (this.config.format === 'json') {
      console.log(JSON.stringify(entry));
      return;
    }

    // Pretty format
    const timestamp = entry.timestamp;
    const level = entry.level.toUpperCase().padEnd(5);
    const message = entry.message;
    
    let output = `[${timestamp}] ${level} ${message}`;
    
    if (Object.keys(entry.meta || {}).length > 0) {
      output += ` ${JSON.stringify(entry.meta, null, 2)}`;
    }
    
    if (entry.error) {
      output += `\\n${entry.error.stack}`;
    }

    switch (entry.level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'debug':
        console.debug(output);
        break;
      default:
        console.log(output);
    }
  }

  private logToFile(entry: LogEntry): void {
    // In a real implementation, this would write to a file
    // For now, we'll just log to console with a file prefix
    console.log(`[FILE] ${JSON.stringify(entry)}`);
  }
}

let loggerInstance: ILogger;

export const createLogger = (config: LoggingConfig): ILogger => {
  loggerInstance = new Logger(config);
  return loggerInstance;
};

export const getLogger = (meta?: Record<string, unknown>): ILogger => {
  if (!loggerInstance) {
    throw new Error('Logger not initialized. Call createLogger first.');
  }
  
  return meta ? loggerInstance.child(meta) : loggerInstance;
};