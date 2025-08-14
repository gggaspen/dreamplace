/**
 * Base API Error class
 */
export abstract class ApiError extends Error {
  public readonly status?: number;
  public readonly timestamp: Date;
  public readonly endpoint?: string;
  public readonly method?: string;

  constructor(message: string, status?: number, endpoint?: string, method?: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.timestamp = new Date();
    this.endpoint = endpoint;
    this.method = method;

    // Ensure proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Network-related errors (connection issues, timeouts)
 */
export class NetworkError extends ApiError {
  constructor(message: string = 'Network error occurred', endpoint?: string, method?: string) {
    super(message, undefined, endpoint, method);
  }
}

/**
 * HTTP 4xx errors (client errors)
 */
export class ClientError extends ApiError {
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    endpoint?: string,
    method?: string,
    details?: Record<string, unknown>
  ) {
    super(message, status, endpoint, method);
    this.details = details;
  }
}

/**
 * HTTP 401 Unauthorized
 */
export class UnauthorizedError extends ClientError {
  constructor(message: string = 'Unauthorized access', endpoint?: string, method?: string) {
    super(message, 401, endpoint, method);
  }
}

/**
 * HTTP 403 Forbidden
 */
export class ForbiddenError extends ClientError {
  constructor(message: string = 'Access forbidden', endpoint?: string, method?: string) {
    super(message, 403, endpoint, method);
  }
}

/**
 * HTTP 404 Not Found
 */
export class NotFoundError extends ClientError {
  constructor(message: string = 'Resource not found', endpoint?: string, method?: string) {
    super(message, 404, endpoint, method);
  }
}

/**
 * HTTP 422 Unprocessable Entity
 */
export class ValidationError extends ClientError {
  public readonly validationErrors?: Record<string, string[]>;

  constructor(
    message: string = 'Validation failed',
    endpoint?: string,
    method?: string,
    validationErrors?: Record<string, string[]>
  ) {
    super(message, 422, endpoint, method);
    this.validationErrors = validationErrors;
  }
}

/**
 * HTTP 5xx errors (server errors)
 */
export class ServerError extends ApiError {
  constructor(
    message: string = 'Internal server error',
    status: number = 500,
    endpoint?: string,
    method?: string
  ) {
    super(message, status, endpoint, method);
  }
}

/**
 * Rate limiting errors
 */
export class RateLimitError extends ClientError {
  public readonly retryAfter?: number;

  constructor(
    message: string = 'Rate limit exceeded',
    retryAfter?: number,
    endpoint?: string,
    method?: string
  ) {
    super(message, 429, endpoint, method);
    this.retryAfter = retryAfter;
  }
}

/**
 * Timeout errors
 */
export class TimeoutError extends NetworkError {
  public readonly timeoutMs: number;

  constructor(timeoutMs: number, endpoint?: string, method?: string) {
    super(`Request timed out after ${timeoutMs}ms`, endpoint, method);
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Circuit breaker errors
 */
export class CircuitBreakerError extends ApiError {
  public readonly state: 'open' | 'half-open';

  constructor(
    message: string = 'Circuit breaker is open',
    state: 'open' | 'half-open' = 'open',
    endpoint?: string,
    method?: string
  ) {
    super(message, undefined, endpoint, method);
    this.state = state;
  }
}

/**
 * Utility function to create appropriate error instances from axios errors
 */
export const createApiError = (error: any, endpoint?: string, method?: string): ApiError => {
  // Network errors (no response)
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      const timeout = error.config?.timeout || 0;
      return new TimeoutError(timeout, endpoint, method);
    }
    return new NetworkError(error.message || 'Network error', endpoint, method);
  }

  const { status, data } = error.response;
  const message = data?.message || data?.error || error.message || 'Unknown error';

  // Client errors (4xx)
  if (status >= 400 && status < 500) {
    switch (status) {
      case 401:
        return new UnauthorizedError(message, endpoint, method);
      case 403:
        return new ForbiddenError(message, endpoint, method);
      case 404:
        return new NotFoundError(message, endpoint, method);
      case 422:
        return new ValidationError(message, endpoint, method, data?.errors);
      case 429:
        const retryAfter = error.response.headers?.['retry-after'];
        return new RateLimitError(
          message,
          retryAfter ? parseInt(retryAfter) : undefined,
          endpoint,
          method
        );
      default:
        return new ClientError(message, status, endpoint, method, data);
    }
  }

  // Server errors (5xx)
  if (status >= 500) {
    return new ServerError(message, status, endpoint, method);
  }

  // Fallback
  return new ApiError(message, status, endpoint, method);
};
