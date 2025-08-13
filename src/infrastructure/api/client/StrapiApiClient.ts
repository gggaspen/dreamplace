import { BaseApiClient, ApiClientConfig } from './BaseApiClient';
import { AppConfig } from '../../config/AppConfig';

/**
 * Strapi-specific API response structure
 */
export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

/**
 * Strapi entity structure
 */
export interface StrapiEntity<T = Record<string, unknown>> {
  id: number;
  attributes: T;
}

/**
 * Strapi query parameters
 */
export interface StrapiQueryParams {
  fields?: string[];
  populate?: string | string[] | Record<string, unknown>;
  filters?: Record<string, unknown>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
  publicationState?: 'live' | 'preview';
  locale?: string;
}

/**
 * Enhanced Strapi API client with CMS-specific features
 */
export class StrapiApiClient extends BaseApiClient {
  private static instance: StrapiApiClient | null = null;

  private constructor() {
    const config: ApiClientConfig = {
      baseURL: AppConfig.API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
      retry: {
        maxRetries: 3,
        baseDelay: 1000,
        maxDelay: 10000,
        retryCondition: (error) => {
          // Retry on network errors, 5xx errors, and timeout
          return !error.response || 
                 error.response.status >= 500 || 
                 error.code === 'ECONNABORTED';
        },
      },
      circuitBreaker: {
        failureThreshold: 5,
        recoveryTimeout: 60000, // 1 minute
        monitoringWindow: 300000, // 5 minutes
      },
      enableLogging: process.env.NODE_ENV === 'development',
    };

    super(config);
  }

  /**
   * Singleton instance getter
   */
  public static getInstance(): StrapiApiClient {
    if (!StrapiApiClient.instance) {
      StrapiApiClient.instance = new StrapiApiClient();
    }
    return StrapiApiClient.instance;
  }

  /**
   * Build Strapi query string from parameters
   */
  private buildQueryString(params: StrapiQueryParams): string {
    const searchParams = new URLSearchParams();

    // Fields
    if (params.fields) {
      params.fields.forEach((field, index) => {
        searchParams.append(`fields[${index}]`, field);
      });
    }

    // Populate
    if (params.populate) {
      if (typeof params.populate === 'string') {
        searchParams.append('populate', params.populate);
      } else if (Array.isArray(params.populate)) {
        params.populate.forEach((field, index) => {
          searchParams.append(`populate[${index}]`, field);
        });
      } else {
        // Complex populate object
        this.buildComplexPopulate(params.populate, searchParams);
      }
    }

    // Filters
    if (params.filters) {
      this.buildFilters(params.filters, searchParams, 'filters');
    }

    // Sort
    if (params.sort) {
      if (typeof params.sort === 'string') {
        searchParams.append('sort', params.sort);
      } else {
        params.sort.forEach((field, index) => {
          searchParams.append(`sort[${index}]`, field);
        });
      }
    }

    // Pagination
    if (params.pagination) {
      Object.entries(params.pagination).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(`pagination[${key}]`, value.toString());
        }
      });
    }

    // Publication state
    if (params.publicationState) {
      searchParams.append('publicationState', params.publicationState);
    }

    // Locale
    if (params.locale) {
      searchParams.append('locale', params.locale);
    }

    return searchParams.toString();
  }

  /**
   * Build complex populate parameters
   */
  private buildComplexPopulate(
    populate: Record<string, unknown>,
    searchParams: URLSearchParams,
    prefix = 'populate'
  ): void {
    Object.entries(populate).forEach(([key, value]) => {
      const paramKey = `${prefix}[${key}]`;
      
      if (typeof value === 'string' || typeof value === 'boolean') {
        searchParams.append(paramKey, value.toString());
      } else if (typeof value === 'object' && value !== null) {
        this.buildComplexPopulate(value as Record<string, unknown>, searchParams, paramKey);
      }
    });
  }

  /**
   * Build filter parameters recursively
   */
  private buildFilters(
    filters: Record<string, unknown>,
    searchParams: URLSearchParams,
    prefix: string
  ): void {
    Object.entries(filters).forEach(([key, value]) => {
      const paramKey = `${prefix}[${key}]`;
      
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        searchParams.append(paramKey, value.toString());
      } else if (typeof value === 'object' && value !== null) {
        this.buildFilters(value as Record<string, unknown>, searchParams, paramKey);
      }
    });
  }

  /**
   * Get single entry from collection type
   */
  public async getEntry<T>(
    contentType: string,
    id: string | number,
    params?: StrapiQueryParams
  ): Promise<StrapiEntity<T>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const url = `/api/${contentType}/${id}${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.get<StrapiResponse<StrapiEntity<T>>>(url);
    return response.data;
  }

  /**
   * Get entries from collection type
   */
  public async getEntries<T>(
    contentType: string,
    params?: StrapiQueryParams
  ): Promise<{
    data: StrapiEntity<T>[];
    meta?: StrapiResponse<StrapiEntity<T>[]>['meta'];
  }> {
    const queryString = params ? this.buildQueryString(params) : '';
    const url = `/api/${contentType}${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.get<StrapiResponse<StrapiEntity<T>[]>>(url);
    return {
      data: response.data,
      meta: response.meta,
    };
  }

  /**
   * Get single type entry
   */
  public async getSingleType<T>(
    contentType: string,
    params?: StrapiQueryParams
  ): Promise<StrapiEntity<T>> {
    const queryString = params ? this.buildQueryString(params) : '';
    const url = `/api/${contentType}${queryString ? `?${queryString}` : ''}`;
    
    const response = await this.get<StrapiResponse<StrapiEntity<T>>>(url);
    return response.data;
  }

  /**
   * Create entry in collection type
   */
  public async createEntry<T>(
    contentType: string,
    data: Partial<T>
  ): Promise<StrapiEntity<T>> {
    const url = `/api/${contentType}`;
    const payload = { data };
    
    const response = await this.post<StrapiResponse<StrapiEntity<T>>>(url, payload);
    return response.data;
  }

  /**
   * Update entry in collection type
   */
  public async updateEntry<T>(
    contentType: string,
    id: string | number,
    data: Partial<T>
  ): Promise<StrapiEntity<T>> {
    const url = `/api/${contentType}/${id}`;
    const payload = { data };
    
    const response = await this.put<StrapiResponse<StrapiEntity<T>>>(url, payload);
    return response.data;
  }

  /**
   * Delete entry from collection type
   */
  public async deleteEntry<T>(
    contentType: string,
    id: string | number
  ): Promise<StrapiEntity<T>> {
    const url = `/api/${contentType}/${id}`;
    
    const response = await this.delete<StrapiResponse<StrapiEntity<T>>>(url);
    return response.data;
  }

  /**
   * Upload file to Strapi media library
   */
  public async uploadFile(file: File, options?: {
    refId?: string;
    ref?: string;
    field?: string;
  }): Promise<any> {
    const formData = new FormData();
    formData.append('files', file);
    
    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        if (value) formData.append(key, value.toString());
      });
    }

    return this.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get media files
   */
  public async getMediaFiles(params?: StrapiQueryParams): Promise<{
    data: StrapiEntity<any>[];
    meta?: StrapiResponse<StrapiEntity<any>[]>['meta'];
  }> {
    return this.getEntries('upload/files', params);
  }

  /**
   * Health check endpoint
   */
  public async healthCheck(): Promise<{ status: string; timestamp: Date }> {
    try {
      await this.get('/api/health');
      return {
        status: 'healthy',
        timestamp: new Date(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date(),
      };
    }
  }
}