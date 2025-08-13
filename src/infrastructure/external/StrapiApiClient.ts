export interface StrapiConfig {
  baseUrl: string;
  timeout?: number;
  retries?: number;
}

export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export class StrapiApiClient {
  private readonly baseUrl: string;
  private readonly timeout: number;
  private readonly retries: number;

  constructor(config: StrapiConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = config.timeout || 10000;
    this.retries = config.retries || 3;
  }

  async get<T>(endpoint: string, params?: Record<string, string | string[] | number>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    return this.executeWithRetry(() => this.fetch<T>(url));
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.executeWithRetry(() => this.fetch<T>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }));
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.executeWithRetry(() => this.fetch<T>(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }));
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = this.buildUrl(endpoint);
    return this.executeWithRetry(() => this.fetch<T>(url, {
      method: 'DELETE',
    }));
  }

  private buildUrl(endpoint: string, params?: Record<string, string | string[] | number>): string {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    const url = `${this.baseUrl}/api/${cleanEndpoint}`;

    if (!params) return url;

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v, index) => {
          searchParams.append(`${key}[${index}]`, v);
        });
      } else {
        searchParams.append(key, String(value));
      }
    });

    return `${url}?${searchParams.toString()}`;
  }

  private async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData: StrapiError = await response.json().catch(() => ({
          error: {
            status: response.status,
            name: 'HTTPError',
            message: response.statusText,
          },
        }));

        throw new Error(
          `Strapi API error: ${errorData.error.status} ${errorData.error.message}`
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.timeout}ms`);
        }
        throw error;
      }
      
      throw new Error('Unknown error occurred during API request');
    }
  }

  private async executeWithRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= this.retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt === this.retries) {
          break;
        }

        // Exponential backoff
        const delay = Math.pow(2, attempt - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error(`API request failed after ${this.retries} attempts: ${lastError.message}`);
  }
}