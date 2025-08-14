import { 
  IAPIFacade, 
  APIResponse, 
  RequestConfig, 
  BatchRequest, 
  FacadeConfig, 
  CacheStats, 
  HealthStatus, 
  FacadeMetrics,
  APIError,
  ResponseMetadata 
} from './types';

/**
 * Base implementation of the API Facade
 * Provides common functionality for all API facades
 */
export abstract class BaseAPIFacade implements IAPIFacade {
  public readonly name: string;
  protected config: FacadeConfig;
  protected cache: Map<string, { data: unknown; expiry: number }> = new Map();
  protected metrics: FacadeMetrics;
  protected rateLimitMap: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(name: string, config: Partial<FacadeConfig> = {}) {
    this.name = name;
    this.config = this.mergeWithDefaults(config);
    this.initializeMetrics();
  }

  private mergeWithDefaults(config: Partial<FacadeConfig>): FacadeConfig {
    return {
      baseURL: '',
      timeout: 10000,
      retries: 3,
      cache: {
        ttl: 300000, // 5 minutes
        strategy: 'memory',
      },
      authentication: {
        type: 'bearer',
      },
      rateLimit: {
        enabled: true,
        maxRequests: 100,
        windowMs: 60000, // 1 minute
      },
      logging: {
        enabled: process.env.NODE_ENV === 'development',
        level: 'info',
      },
      metrics: {
        enabled: true,
      },
      ...config,
    };
  }

  private initializeMetrics(): void {
    this.metrics = {
      requests: {
        total: 0,
        successful: 0,
        failed: 0,
        averageTime: 0,
      },
      cache: {
        hits: 0,
        misses: 0,
        size: 0,
        hitRate: 0,
      },
      rateLimit: {
        throttled: 0,
        rejected: 0,
      },
      errors: {
        byCode: {},
        byEndpoint: {},
      },
    };
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.makeRequest<T>('GET', endpoint, undefined, config);
  }

  async post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.makeRequest<T>('POST', endpoint, data, config);
  }

  async put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.makeRequest<T>('PUT', endpoint, data, config);
  }

  async patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.makeRequest<T>('PATCH', endpoint, data, config);
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>> {
    return this.makeRequest<T>('DELETE', endpoint, undefined, config);
  }

  async batch<T>(requests: BatchRequest[]): Promise<APIResponse<T[]>> {
    const startTime = performance.now();
    const requestId = this.generateRequestId();

    try {
      const promises = requests.map(request => 
        this.makeRequest(request.method, request.endpoint, request.data, request.config)
      );

      const results = await Promise.allSettled(promises);
      const successfulResults: T[] = [];
      const errors: APIError[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          if (result.value.data) {
            successfulResults.push(result.value.data as T);
          }
          if (result.value.error) {
            errors.push(result.value.error);
          }
        } else {
          errors.push({
            code: 'BATCH_REQUEST_FAILED',
            message: `Request ${index} failed: ${result.reason}`,
            timestamp: new Date(),
          });
        }
      });

      const duration = performance.now() - startTime;
      
      return {
        data: successfulResults,
        error: errors.length > 0 ? {
          code: 'BATCH_PARTIAL_FAILURE',
          message: `${errors.length} out of ${requests.length} requests failed`,
          details: { errors },
          timestamp: new Date(),
        } : undefined,
        metadata: {
          requestId,
          timestamp: new Date(),
          duration,
        },
      };
    } catch (error) {
      const duration = performance.now() - startTime;
      
      return {
        error: this.createAPIError('BATCH_REQUEST_ERROR', error),
        metadata: {
          requestId,
          timestamp: new Date(),
          duration,
        },
      };
    }
  }

  protected async makeRequest<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    config: RequestConfig = {}
  ): Promise<APIResponse<T>> {
    const startTime = performance.now();
    const requestId = this.generateRequestId();
    const requestConfig = { ...this.config, ...config };

    try {
      // Rate limiting check
      if (this.config.rateLimit.enabled && !this.checkRateLimit(endpoint)) {
        this.metrics.rateLimit.rejected++;
        throw new Error('Rate limit exceeded');
      }

      // Cache check for GET requests
      if (method === 'GET' && (requestConfig.cache || this.config.cache)) {
        const cachedResponse = this.getFromCache<T>(endpoint);
        if (cachedResponse) {
          this.metrics.cache.hits++;
          return cachedResponse;
        }
        this.metrics.cache.misses++;
      }

      // Request validation
      if (config.validation?.request) {
        const isValid = await config.validation.request(data);
        if (!isValid) {
          throw new Error('Request validation failed');
        }
      }

      // Transform request data
      let transformedData = data;
      if (config.transform?.request) {
        transformedData = config.transform.request(data);
      }

      // Make the actual HTTP request
      const response = await this.executeRequest<T>(
        method,
        endpoint,
        transformedData,
        requestConfig
      );

      // Response validation
      if (config.validation?.response) {
        const isValid = await config.validation.response(response.data);
        if (!isValid) {
          throw new Error('Response validation failed');
        }
      }

      // Transform response data
      if (config.transform?.response && response.data) {
        response.data = config.transform.response(response.data) as T;
      }

      // Cache the response for GET requests
      if (method === 'GET' && (requestConfig.cache || this.config.cache) && response.data) {
        this.addToCache(endpoint, response);
      }

      // Update metrics
      const duration = performance.now() - startTime;
      this.updateSuccessMetrics(duration);
      
      this.log('info', `${method} ${endpoint} - Success (${duration.toFixed(2)}ms)`, {
        requestId,
        duration,
        cached: response.metadata.cached,
      });

      return {
        ...response,
        metadata: {
          ...response.metadata,
          requestId,
          duration,
        },
      };

    } catch (error) {
      const duration = performance.now() - startTime;
      const apiError = this.createAPIError('REQUEST_FAILED', error);
      
      // Update error metrics
      this.updateErrorMetrics(apiError, endpoint);
      
      this.log('error', `${method} ${endpoint} - Failed (${duration.toFixed(2)}ms)`, {
        requestId,
        duration,
        error: apiError,
      });

      return {
        error: apiError,
        metadata: {
          requestId,
          timestamp: new Date(),
          duration,
        },
      };
    }
  }

  protected abstract executeRequest<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<APIResponse<T>>;

  private checkRateLimit(endpoint: string): boolean {
    const now = Date.now();
    const key = `${this.name}:${endpoint}`;
    const current = this.rateLimitMap.get(key);

    if (!current || now > current.resetTime) {
      // Reset or initialize
      this.rateLimitMap.set(key, {
        count: 1,
        resetTime: now + this.config.rateLimit.windowMs,
      });
      return true;
    }

    if (current.count >= this.config.rateLimit.maxRequests) {
      return false;
    }

    current.count++;
    return true;
  }

  private getFromCache<T>(key: string): APIResponse<T> | null {
    const cached = this.cache.get(key);
    if (!cached || Date.now() > cached.expiry) {
      if (cached) {
        this.cache.delete(key);
      }
      return null;
    }

    return {
      data: cached.data as T,
      metadata: {
        requestId: this.generateRequestId(),
        timestamp: new Date(),
        duration: 0,
        cached: true,
      },
    };
  }

  private addToCache<T>(key: string, response: APIResponse<T>): void {
    const ttl = this.config.cache.ttl;
    this.cache.set(key, {
      data: response.data,
      expiry: Date.now() + ttl,
    });

    // Update cache size metric
    this.metrics.cache.size = this.cache.size;
  }

  private updateSuccessMetrics(duration: number): void {
    this.metrics.requests.total++;
    this.metrics.requests.successful++;
    
    // Update average time
    const total = this.metrics.requests.total;
    const current = this.metrics.requests.averageTime;
    this.metrics.requests.averageTime = (current * (total - 1) + duration) / total;
  }

  private updateErrorMetrics(error: APIError, endpoint: string): void {
    this.metrics.requests.total++;
    this.metrics.requests.failed++;
    
    // Update error counts
    this.metrics.errors.byCode[error.code] = (this.metrics.errors.byCode[error.code] || 0) + 1;
    this.metrics.errors.byEndpoint[endpoint] = (this.metrics.errors.byEndpoint[endpoint] || 0) + 1;
  }

  private createAPIError(code: string, error: unknown): APIError {
    const message = error instanceof Error ? error.message : String(error);
    
    return {
      code,
      message,
      details: error instanceof Error ? { stack: error.stack } : { error },
      timestamp: new Date(),
    };
  }

  private generateRequestId(): string {
    return `${this.name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Configuration methods
  configure(config: Partial<FacadeConfig>): void {
    this.config = { ...this.config, ...config };
  }

  getConfiguration(): FacadeConfig {
    return { ...this.config };
  }

  // Cache management
  clearCache(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
    } else {
      const regex = new RegExp(pattern);
      for (const [key] of this.cache) {
        if (regex.test(key)) {
          this.cache.delete(key);
        }
      }
    }
    this.metrics.cache.size = this.cache.size;
  }

  getCacheStats(): CacheStats {
    const total = this.metrics.cache.hits + this.metrics.cache.misses;
    
    return {
      hits: this.metrics.cache.hits,
      misses: this.metrics.cache.misses,
      size: this.cache.size,
      hitRate: total > 0 ? this.metrics.cache.hits / total : 0,
    };
  }

  // Health and monitoring
  async getHealthStatus(): Promise<HealthStatus> {
    const startTime = performance.now();
    
    try {
      // Perform a simple health check request
      await this.get('/health', { timeout: 5000 });
      const responseTime = performance.now() - startTime;
      
      return {
        status: 'healthy',
        uptime: Date.now() - (this.metrics as any).startTime || 0,
        responseTime,
        errors: this.metrics.requests.failed,
        details: {
          requests: this.metrics.requests,
          cache: this.getCacheStats(),
        },
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      
      return {
        status: 'unhealthy',
        uptime: Date.now() - (this.metrics as any).startTime || 0,
        responseTime,
        errors: this.metrics.requests.failed,
        details: {
          error: error instanceof Error ? error.message : String(error),
          requests: this.metrics.requests,
        },
      };
    }
  }

  getMetrics(): FacadeMetrics {
    // Update cache hit rate
    const total = this.metrics.cache.hits + this.metrics.cache.misses;
    this.metrics.cache.hitRate = total > 0 ? this.metrics.cache.hits / total : 0;
    
    return { ...this.metrics };
  }

  protected log(level: string, message: string, data?: unknown): void {
    if (!this.config.logging.enabled) return;
    
    const logLevels = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = logLevels.indexOf(this.config.logging.level);
    const messageLevelIndex = logLevels.indexOf(level);
    
    if (messageLevelIndex >= currentLevelIndex) {
      console.log(`[${this.name}Facade] [${level.toUpperCase()}] ${message}`, data || '');
    }
  }
}