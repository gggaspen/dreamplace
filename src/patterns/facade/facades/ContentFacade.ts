import { BaseAPIFacade } from '../BaseAPIFacade';
import { 
  IContentFacade, 
  APIResponse, 
  RequestConfig,
  EventFilters,
  Pagination,
  SearchFilters 
} from '../types';

/**
 * Content Facade - simplified interface for content management operations
 * Handles all content-related API interactions for the DreamPlace application
 */
export class ContentFacade extends BaseAPIFacade implements IContentFacade {
  constructor(baseURL: string) {
    super('Content', {
      baseURL,
      timeout: 15000,
      cache: {
        ttl: 300000, // 5 minutes for content
        strategy: 'memory',
      },
      rateLimit: {
        enabled: true,
        maxRequests: 50,
        windowMs: 60000,
      },
    });
  }

  protected async executeRequest<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<APIResponse<T>> {
    const url = `${this.config.baseURL}${endpoint}`;
    const requestConfig = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(config?.timeout || this.config.timeout),
    };

    const response = await fetch(url, requestConfig);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();

    return {
      data: responseData as T,
      metadata: {
        requestId: this.generateRequestId(),
        timestamp: new Date(),
        duration: 0, // Will be set by parent
      },
    };
  }

  // Hero Sections
  async getHeroSections(): Promise<APIResponse<any[]>> {
    return this.get<any[]>('/api/hero-sections', {
      cache: { ttl: 600000, strategy: 'memory' }, // 10 minutes cache
      transform: {
        response: (data) => this.transformHeroSections(data),
      },
    });
  }

  // Events
  async getEvents(filters: EventFilters = {}): Promise<APIResponse<any[]>> {
    const queryParams = this.buildEventQuery(filters);
    const endpoint = `/api/events${queryParams ? `?${queryParams}` : ''}`;
    
    return this.get<any[]>(endpoint, {
      cache: { ttl: 180000, strategy: 'memory' }, // 3 minutes cache
      transform: {
        response: (data) => this.transformEvents(data),
      },
    });
  }

  async getActiveEvents(): Promise<APIResponse<any[]>> {
    return this.getEvents({ active: true });
  }

  async getEventsByCategory(category: string): Promise<APIResponse<any[]>> {
    return this.getEvents({ category });
  }

  // Artists
  async getArtists(pagination: Pagination = { page: 1, limit: 20 }): Promise<APIResponse<any[]>> {
    const queryParams = this.buildPaginationQuery(pagination);
    const endpoint = `/api/artists?${queryParams}`;
    
    return this.get<any[]>(endpoint, {
      cache: { ttl: 300000, strategy: 'memory' }, // 5 minutes cache
      transform: {
        response: (data) => this.transformArtists(data),
      },
    });
  }

  async getFeaturedArtists(): Promise<APIResponse<any[]>> {
    return this.get<any[]>('/api/artists?featured=true', {
      cache: { ttl: 600000, strategy: 'memory' }, // 10 minutes cache
    });
  }

  // Carousels
  async getCarousels(type?: string): Promise<APIResponse<any[]>> {
    const endpoint = type ? `/api/carousels?type=${type}` : '/api/carousels';
    
    return this.get<any[]>(endpoint, {
      cache: { ttl: 300000, strategy: 'memory' },
      transform: {
        response: (data) => this.transformCarousels(data),
      },
    });
  }

  // Content Operations
  async createContent(type: string, data: unknown): Promise<APIResponse<any>> {
    return this.post<any>(`/api/${type}`, data, {
      validation: {
        request: (data) => this.validateContentData(type, data),
      },
      transform: {
        request: (data) => this.transformContentForCreation(type, data),
        response: (data) => this.transformContentResponse(data),
      },
    });
  }

  async updateContent(type: string, id: string, data: unknown): Promise<APIResponse<any>> {
    return this.put<any>(`/api/${type}/${id}`, data, {
      validation: {
        request: (data) => this.validateContentData(type, data),
      },
      transform: {
        request: (data) => this.transformContentForUpdate(type, data),
        response: (data) => this.transformContentResponse(data),
      },
    });
  }

  async deleteContent(type: string, id: string): Promise<APIResponse<any>> {
    return this.delete<any>(`/api/${type}/${id}`);
  }

  // Search and Filtering
  async searchContent(query: string, filters: SearchFilters = {}): Promise<APIResponse<any[]>> {
    const queryParams = this.buildSearchQuery(query, filters);
    const endpoint = `/api/search?${queryParams}`;
    
    return this.get<any[]>(endpoint, {
      cache: { ttl: 60000, strategy: 'memory' }, // 1 minute cache for search
      transform: {
        response: (data) => this.transformSearchResults(data),
      },
    });
  }

  async getContentByTag(tag: string): Promise<APIResponse<any[]>> {
    return this.get<any[]>(`/api/content/by-tag/${encodeURIComponent(tag)}`, {
      cache: { ttl: 300000, strategy: 'memory' },
    });
  }

  // Batch operations for efficient data loading
  async getAllPageData(): Promise<APIResponse<{
    heroSections: any[];
    events: any[];
    artists: any[];
    carousels: any[];
  }>> {
    const requests = [
      { method: 'GET' as const, endpoint: '/api/hero-sections' },
      { method: 'GET' as const, endpoint: '/api/events?active=true' },
      { method: 'GET' as const, endpoint: '/api/artists?featured=true' },
      { method: 'GET' as const, endpoint: '/api/carousels' },
    ];

    const response = await this.batch(requests);
    
    if (response.data && response.data.length === 4) {
      return {
        data: {
          heroSections: response.data[0] || [],
          events: response.data[1] || [],
          artists: response.data[2] || [],
          carousels: response.data[3] || [],
        },
        metadata: response.metadata,
      };
    }

    return {
      error: response.error || {
        code: 'BATCH_DATA_ERROR',
        message: 'Failed to load all page data',
        timestamp: new Date(),
      },
      metadata: response.metadata,
    };
  }

  // Helper methods for query building
  private buildEventQuery(filters: EventFilters): string {
    const params = new URLSearchParams();
    
    if (filters.active !== undefined) {
      params.append('active', String(filters.active));
    }
    
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    if (filters.location) {
      params.append('location', filters.location);
    }
    
    if (filters.dateRange) {
      params.append('startDate', filters.dateRange.start.toISOString());
      params.append('endDate', filters.dateRange.end.toISOString());
    }

    return params.toString();
  }

  private buildPaginationQuery(pagination: Pagination): string {
    const params = new URLSearchParams();
    
    params.append('page', String(pagination.page));
    params.append('limit', String(pagination.limit));
    
    if (pagination.sortBy) {
      params.append('sortBy', pagination.sortBy);
    }
    
    if (pagination.sortOrder) {
      params.append('sortOrder', pagination.sortOrder);
    }

    return params.toString();
  }

  private buildSearchQuery(query: string, filters: SearchFilters): string {
    const params = new URLSearchParams();
    
    params.append('q', query);
    
    if (filters.type) {
      params.append('type', filters.type);
    }
    
    if (filters.tags && filters.tags.length > 0) {
      params.append('tags', filters.tags.join(','));
    }
    
    if (filters.author) {
      params.append('author', filters.author);
    }
    
    if (filters.dateRange) {
      params.append('startDate', filters.dateRange.start.toISOString());
      params.append('endDate', filters.dateRange.end.toISOString());
    }

    return params.toString();
  }

  // Data transformation methods
  private transformHeroSections(data: any): any {
    if (!Array.isArray(data?.data)) return data;
    
    return data.data.map((section: any) => ({
      id: section.id,
      title: section.attributes?.title || '',
      subtitle: section.attributes?.subtitle || '',
      backgroundImage: section.attributes?.cover_mobile?.data?.attributes?.url || 
                      section.attributes?.cover_desktop?.data?.attributes?.url || '',
      cta: section.attributes?.cta || null,
      metadata: {
        updatedAt: section.attributes?.updatedAt,
        publishedAt: section.attributes?.publishedAt,
      },
    }));
  }

  private transformEvents(data: any): any {
    if (!Array.isArray(data?.data)) return data;
    
    return data.data.map((event: any) => ({
      id: event.id,
      title: event.attributes?.title || '',
      description: event.attributes?.description || '',
      date: event.attributes?.date ? new Date(event.attributes.date) : null,
      location: event.attributes?.location || '',
      category: event.attributes?.category || '',
      active: event.attributes?.active || false,
      image: event.attributes?.image?.data?.attributes?.url || '',
      tickets: event.attributes?.tickets || [],
      metadata: {
        updatedAt: event.attributes?.updatedAt,
        publishedAt: event.attributes?.publishedAt,
      },
    }));
  }

  private transformArtists(data: any): any {
    if (!Array.isArray(data?.data)) return data;
    
    return data.data.map((artist: any) => ({
      id: artist.id,
      name: artist.attributes?.name || '',
      bio: artist.attributes?.bio || '',
      featured: artist.attributes?.featured || false,
      genre: artist.attributes?.genre || '',
      photos: artist.attributes?.photos?.data?.map((photo: any) => ({
        url: photo.attributes?.url || '',
        alt: photo.attributes?.alternativeText || artist.attributes?.name,
      })) || [],
      socialLinks: artist.attributes?.social_links || [],
      metadata: {
        updatedAt: artist.attributes?.updatedAt,
        publishedAt: artist.attributes?.publishedAt,
      },
    }));
  }

  private transformCarousels(data: any): any {
    if (!Array.isArray(data?.data)) return data;
    
    return data.data.map((carousel: any) => ({
      id: carousel.id,
      title: carousel.attributes?.title || '',
      type: carousel.attributes?.type || '',
      items: carousel.attributes?.items || [],
      autoplay: carousel.attributes?.autoplay || false,
      interval: carousel.attributes?.interval || 5000,
      metadata: {
        updatedAt: carousel.attributes?.updatedAt,
        publishedAt: carousel.attributes?.publishedAt,
      },
    }));
  }

  private transformSearchResults(data: any): any {
    // Transform search results to normalize different content types
    if (!Array.isArray(data?.results)) return data;
    
    return data.results.map((result: any) => ({
      id: result.id,
      type: result.type,
      title: result.title,
      description: result.description,
      url: result.url,
      image: result.image,
      score: result.score,
      highlights: result.highlights || [],
    }));
  }

  private transformContentForCreation(type: string, data: any): any {
    // Apply content-type specific transformations for creation
    return {
      data: {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };
  }

  private transformContentForUpdate(type: string, data: any): any {
    // Apply content-type specific transformations for updates
    return {
      data: {
        ...data,
        updatedAt: new Date().toISOString(),
      },
    };
  }

  private transformContentResponse(data: any): any {
    // Standardize response format
    return {
      id: data.data?.id,
      attributes: data.data?.attributes,
      metadata: {
        createdAt: data.data?.attributes?.createdAt,
        updatedAt: data.data?.attributes?.updatedAt,
        publishedAt: data.data?.attributes?.publishedAt,
      },
    };
  }

  // Validation methods
  private validateContentData(type: string, data: any): boolean {
    if (!data || typeof data !== 'object') return false;
    
    // Basic validation - in a real app, this would be more comprehensive
    switch (type) {
      case 'events':
        return !!(data.title && data.date);
      case 'artists':
        return !!(data.name);
      case 'hero-sections':
        return !!(data.title);
      default:
        return true;
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    
    if (this.config.authentication.token) {
      headers.Authorization = `Bearer ${this.config.authentication.token}`;
    }
    
    return headers;
  }

  private generateRequestId(): string {
    return `content_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}