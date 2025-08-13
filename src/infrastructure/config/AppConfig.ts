export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  username?: string;
  password?: string;
  ssl?: boolean;
}

export interface ApiConfig {
  strapiBaseUrl: string;
  timeout: number;
  retries: number;
  rateLimitRps?: number;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  format: 'json' | 'pretty';
  outputs: ('console' | 'file')[];
  filename?: string;
}

export interface CacheConfig {
  provider: 'memory' | 'redis';
  ttl: number;
  maxSize?: number;
  redisUrl?: string;
}

export interface SecurityConfig {
  corsOrigins: string[];
  rateLimitWindowMs: number;
  rateLimitMaxRequests: number;
  enableHelmet: boolean;
}

export interface AppConfig {
  environment: 'development' | 'test' | 'staging' | 'production';
  port: number;
  api: ApiConfig;
  database?: DatabaseConfig;
  logging: LoggingConfig;
  cache: CacheConfig;
  security: SecurityConfig;
}

class ConfigService {
  private static instance: ConfigService;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public get(): AppConfig {
    return { ...this.config };
  }

  public getApi(): ApiConfig {
    return { ...this.config.api };
  }

  public getLogging(): LoggingConfig {
    return { ...this.config.logging };
  }

  public getCache(): CacheConfig {
    return { ...this.config.cache };
  }

  public getSecurity(): SecurityConfig {
    return { ...this.config.security };
  }

  public isProduction(): boolean {
    return this.config.environment === 'production';
  }

  public isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  public isTest(): boolean {
    return this.config.environment === 'test';
  }

  private loadConfig(): AppConfig {
    const env = process.env.NODE_ENV || 'development';
    
    return {
      environment: env as AppConfig['environment'],
      port: parseInt(process.env.PORT || '3000', 10),
      api: {
        strapiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337',
        timeout: parseInt(process.env.API_TIMEOUT || '10000', 10),
        retries: parseInt(process.env.API_RETRIES || '3', 10),
        rateLimitRps: process.env.API_RATE_LIMIT_RPS 
          ? parseInt(process.env.API_RATE_LIMIT_RPS, 10) 
          : undefined
      },
      logging: {
        level: (process.env.LOG_LEVEL as LoggingConfig['level']) || 'info',
        format: (process.env.LOG_FORMAT as LoggingConfig['format']) || 'pretty',
        outputs: process.env.LOG_OUTPUTS?.split(',') as LoggingConfig['outputs'] || ['console'],
        filename: process.env.LOG_FILENAME
      },
      cache: {
        provider: (process.env.CACHE_PROVIDER as CacheConfig['provider']) || 'memory',
        ttl: parseInt(process.env.CACHE_TTL || '300000', 10), // 5 minutes default
        maxSize: process.env.CACHE_MAX_SIZE 
          ? parseInt(process.env.CACHE_MAX_SIZE, 10) 
          : undefined,
        redisUrl: process.env.REDIS_URL
      },
      security: {
        corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['*'],
        rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
        rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
        enableHelmet: process.env.ENABLE_HELMET !== 'false'
      }
    };
  }

  private validateConfig(): void {
    const errors: string[] = [];

    if (!this.config.api.strapiBaseUrl) {
      errors.push('API base URL is required');
    }

    if (this.config.api.timeout < 0) {
      errors.push('API timeout must be positive');
    }

    if (this.config.api.retries < 0) {
      errors.push('API retries must be non-negative');
    }

    if (this.config.cache.ttl < 0) {
      errors.push('Cache TTL must be positive');
    }

    if (this.config.cache.provider === 'redis' && !this.config.cache.redisUrl) {
      errors.push('Redis URL is required when using Redis cache provider');
    }

    if (this.config.security.rateLimitWindowMs < 1000) {
      errors.push('Rate limit window must be at least 1 second');
    }

    if (this.config.security.rateLimitMaxRequests < 1) {
      errors.push('Rate limit max requests must be positive');
    }

    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }
  }
}

export const configService = ConfigService.getInstance();