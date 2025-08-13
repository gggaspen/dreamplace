import { StrapiApiClient, StrapiQueryParams, StrapiEntity } from './StrapiApiClient';
import { 
  Event, 
  Artist, 
  HeroSection, 
  ContactInfo 
} from '../../../core/domain/entities';

/**
 * API endpoint definitions with strict typing
 */
export interface ApiEndpoints {
  'events': Event;
  'artists': Artist;
  'hero-sections': HeroSection;
  'contact-infos': ContactInfo;
  'carousel-sections': any; // TODO: Add typed interface when available
  'spotify-sections': any; // TODO: Add typed interface when available
  'footer-sections': any; // TODO: Add typed interface when available
}

/**
 * Type-safe query parameters for each endpoint
 */
export type TypedStrapiQueryParams<T extends keyof ApiEndpoints> = StrapiQueryParams & {
  fields?: (keyof ApiEndpoints[T])[];
  populate?: string | string[] | Record<string, unknown>;
  filters?: Partial<Record<keyof ApiEndpoints[T], unknown>>;
};

/**
 * Type-safe API response wrapper
 */
export interface TypedApiResponse<T> {
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
 * Type-safe API client that enforces strict typing on all operations
 */
export class TypedApiClient {
  private strapiClient: StrapiApiClient;

  constructor() {
    this.strapiClient = StrapiApiClient.getInstance();
  }

  /**
   * Type-safe single entry retrieval
   */
  public async getEntry<T extends keyof ApiEndpoints>(
    contentType: T,
    id: string | number,
    params?: TypedStrapiQueryParams<T>
  ): Promise<StrapiEntity<ApiEndpoints[T]>> {
    return this.strapiClient.getEntry<ApiEndpoints[T]>(contentType, id, params);
  }

  /**
   * Type-safe multiple entries retrieval
   */
  public async getEntries<T extends keyof ApiEndpoints>(
    contentType: T,
    params?: TypedStrapiQueryParams<T>
  ): Promise<TypedApiResponse<StrapiEntity<ApiEndpoints[T]>[]>> {
    const response = await this.strapiClient.getEntries<ApiEndpoints[T]>(contentType, params);
    return {
      data: response.data,
      meta: response.meta,
    };
  }

  /**
   * Type-safe single type retrieval
   */
  public async getSingleType<T extends keyof ApiEndpoints>(
    contentType: T,
    params?: TypedStrapiQueryParams<T>
  ): Promise<StrapiEntity<ApiEndpoints[T]>> {
    return this.strapiClient.getSingleType<ApiEndpoints[T]>(contentType, params);
  }

  /**
   * Type-safe entry creation
   */
  public async createEntry<T extends keyof ApiEndpoints>(
    contentType: T,
    data: Partial<ApiEndpoints[T]>
  ): Promise<StrapiEntity<ApiEndpoints[T]>> {
    return this.strapiClient.createEntry<ApiEndpoints[T]>(contentType, data);
  }

  /**
   * Type-safe entry update
   */
  public async updateEntry<T extends keyof ApiEndpoints>(
    contentType: T,
    id: string | number,
    data: Partial<ApiEndpoints[T]>
  ): Promise<StrapiEntity<ApiEndpoints[T]>> {
    return this.strapiClient.updateEntry<ApiEndpoints[T]>(contentType, id, data);
  }

  /**
   * Type-safe entry deletion
   */
  public async deleteEntry<T extends keyof ApiEndpoints>(
    contentType: T,
    id: string | number
  ): Promise<StrapiEntity<ApiEndpoints[T]>> {
    return this.strapiClient.deleteEntry<ApiEndpoints[T]>(contentType, id);
  }

  /**
   * Health check with typed response
   */
  public async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy'; timestamp: Date }> {
    return this.strapiClient.healthCheck();
  }

  /**
   * Typed media upload
   */
  public async uploadFile(file: File, options?: {
    refId?: string;
    ref?: keyof ApiEndpoints;
    field?: string;
  }): Promise<StrapiEntity<{ 
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: Record<string, any>;
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string | null;
    provider: string;
    provider_metadata: any;
  }>> {
    return this.strapiClient.uploadFile(file, options);
  }

  /**
   * Get typed media files
   */
  public async getMediaFiles(params?: StrapiQueryParams): Promise<TypedApiResponse<StrapiEntity<any>[]>> {
    const response = await this.strapiClient.getMediaFiles(params);
    return {
      data: response.data,
      meta: response.meta,
    };
  }
}

/**
 * Singleton instance of the typed API client
 */
export const typedApiClient = new TypedApiClient();