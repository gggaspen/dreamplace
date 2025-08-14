import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { createApiError, ApiError, CircuitBreakerError } from '../errors/ApiErrors';
import { Logger } from '../../logging/Logger';

/**
 * Circuit breaker states
 */
export enum CircuitBreakerState {
  CLOSED = 'closed',
  OPEN = 'open',
  HALF_OPEN = 'half-open',
}

/**
 * Circuit breaker configuration
 */
export interface CircuitBreakerConfig {
  failureThreshold: number;
  recoveryTimeout: number;
  monitoringWindow: number;
}

/**
 * Request retry configuration
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  retryCondition?: (error: any) => boolean;
}

/**
 * API client configuration
 */
export interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
  retry?: RetryConfig;
  circuitBreaker?: CircuitBreakerConfig;
  enableLogging?: boolean;
}

/**
 * Request/Response logging data
 */
export interface RequestLog {
  method: string;
  url: string;
  headers?: Record<string, unknown>;
  data?: unknown;
  timestamp: Date;
}

export interface ResponseLog extends RequestLog {
  status: number;
  statusText: string;
  responseData?: unknown;
  duration: number;
}

/**
 * Circuit breaker state tracking
 */
class CircuitBreaker {
  private state = CircuitBreakerState.CLOSED;
  private failures = 0;
  private lastFailureTime = 0;
  private config: CircuitBreakerConfig;

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
  }

  public canExecute(): boolean {
    if (this.state === CircuitBreakerState.CLOSED) {
      return true;
    }

    if (this.state === CircuitBreakerState.OPEN) {
      const now = Date.now();
      if (now - this.lastFailureTime >= this.config.recoveryTimeout) {
        this.state = CircuitBreakerState.HALF_OPEN;
        return true;
      }
      return false;
    }

    // HALF_OPEN state
    return true;
  }

  public onSuccess(): void {
    this.failures = 0;
    this.state = CircuitBreakerState.CLOSED;
  }

  public onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();

    if (this.failures >= this.config.failureThreshold) {
      this.state = CircuitBreakerState.OPEN;
    }
  }

  public getState(): CircuitBreakerState {
    return this.state;
  }
}

/**
 * Abstract base API client with advanced features
 */
export abstract class BaseApiClient {
  protected readonly client: AxiosInstance;
  protected readonly logger: Logger;
  private readonly circuitBreaker?: CircuitBreaker;
  private readonly retryConfig?: RetryConfig;

  constructor(config: ApiClientConfig) {
    this.logger = new Logger(this.constructor.name);

    // Initialize circuit breaker
    if (config.circuitBreaker) {
      this.circuitBreaker = new CircuitBreaker(config.circuitBreaker);
    }

    this.retryConfig = config.retry;

    // Create axios instance
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Setup interceptors
    this.setupRequestInterceptors(config.enableLogging);
    this.setupResponseInterceptors(config.enableLogging);
  }

  /**
   * Setup request interceptors
   */
  private setupRequestInterceptors(enableLogging?: boolean): void {
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Circuit breaker check
        if (this.circuitBreaker && !this.circuitBreaker.canExecute()) {
          const error = new CircuitBreakerError(
            'Circuit breaker is open',
            this.circuitBreaker.getState() as 'open' | 'half-open',
            config.url,
            config.method?.toUpperCase()
          );
          throw error;
        }

        // Add request timestamp for duration calculation
        config.metadata = { startTime: Date.now() };

        // Log request if enabled
        if (enableLogging) {
          this.logRequest(config);
        }

        return config;
      },
      error => {
        this.logger.error('Request interceptor error:', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Setup response interceptors with retry logic
   */
  private setupResponseInterceptors(enableLogging?: boolean): void {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        const duration = Date.now() - (response.config.metadata?.startTime || 0);

        // Circuit breaker success
        if (this.circuitBreaker) {
          this.circuitBreaker.onSuccess();
        }

        // Log response if enabled
        if (enableLogging) {
          this.logResponse(response, duration);
        }

        return response;
      },
      async error => {
        const duration = Date.now() - (error.config?.metadata?.startTime || 0);

        // Circuit breaker failure
        if (this.circuitBreaker) {
          this.circuitBreaker.onFailure();
        }

        // Log error response if enabled
        if (enableLogging && error.response) {
          this.logResponse(error.response, duration, error);
        }

        // Retry logic
        if (this.shouldRetry(error)) {
          return this.retryRequest(error);
        }

        // Create and throw appropriate API error
        const apiError = createApiError(
          error,
          error.config?.url,
          error.config?.method?.toUpperCase()
        );

        this.logger.error('API request failed:', {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          message: apiError.message,
        });

        throw apiError;
      }
    );
  }

  /**
   * Determine if request should be retried
   */
  private shouldRetry(error: any): boolean {
    if (!this.retryConfig || !error.config) {
      return false;
    }

    // Don't retry if we've already exhausted retries
    const currentRetries = error.config.__retryCount || 0;
    if (currentRetries >= this.retryConfig.maxRetries) {
      return false;
    }

    // Use custom retry condition if provided
    if (this.retryConfig.retryCondition) {
      return this.retryConfig.retryCondition(error);
    }

    // Default retry conditions
    return (
      // Network errors
      !error.response ||
      // Server errors (5xx)
      error.response.status >= 500 ||
      // Timeout errors
      error.code === 'ECONNABORTED' ||
      // Rate limit errors (with retry-after)
      error.response.status === 429
    );
  }

  /**
   * Retry failed request with exponential backoff
   */
  private async retryRequest(error: any): Promise<AxiosResponse> {
    const config = error.config;
    const currentRetries = config.__retryCount || 0;

    config.__retryCount = currentRetries + 1;

    // Calculate delay with exponential backoff
    const baseDelay = this.retryConfig?.baseDelay || 1000;
    const maxDelay = this.retryConfig?.maxDelay || 10000;
    const delay = Math.min(baseDelay * Math.pow(2, currentRetries), maxDelay);

    // Add jitter to prevent thundering herd
    const jitteredDelay = delay + Math.random() * 1000;

    this.logger.warn(
      `Retrying request (attempt ${currentRetries + 1}/${this.retryConfig?.maxRetries}) after ${jitteredDelay}ms`,
      {
        url: config.url,
        method: config.method,
      }
    );

    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, jitteredDelay));

    // Retry the request
    return this.client(config);
  }

  /**
   * Log outgoing requests
   */
  private logRequest(config: InternalAxiosRequestConfig): void {
    const logData: RequestLog = {
      method: config.method?.toUpperCase() || 'GET',
      url: `${config.baseURL || ''}${config.url || ''}`,
      timestamp: new Date(),
    };

    // Only log headers/data in development
    if (process.env.NODE_ENV === 'development') {
      logData.headers = config.headers as Record<string, unknown>;
      logData.data = config.data;
    }

    this.logger.info('API Request:', logData);
  }

  /**
   * Log incoming responses
   */
  private logResponse(response: AxiosResponse, duration: number, error?: any): void {
    const logData: ResponseLog = {
      method: response.config.method?.toUpperCase() || 'GET',
      url: response.config.url || '',
      status: response.status,
      statusText: response.statusText,
      duration,
      timestamp: new Date(),
    };

    // Only log response data in development
    if (process.env.NODE_ENV === 'development') {
      logData.responseData = response.data;
    }

    if (error) {
      this.logger.error('API Response Error:', logData);
    } else {
      this.logger.info('API Response:', logData);
    }
  }

  /**
   * Generic GET request
   */
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  /**
   * Generic POST request
   */
  protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic PUT request
   */
  protected async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic PATCH request
   */
  protected async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config);
    return response.data;
  }

  /**
   * Generic DELETE request
   */
  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}
