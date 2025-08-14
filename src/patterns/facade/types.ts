/**
 * Facade Pattern Implementation for Complex API Interactions
 * 
 * The Facade pattern provides a simplified interface to a complex subsystem.
 * It defines a higher-level interface that makes the subsystem easier to use
 * by hiding the complexity of the underlying API interactions.
 */

export interface APIResponse<T = unknown> {
  data?: T;
  error?: APIError;
  metadata: ResponseMetadata;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode?: number;
  timestamp: Date;
}

export interface ResponseMetadata {
  requestId: string;
  timestamp: Date;
  duration: number;
  cached?: boolean;
  retryCount?: number;
  rateLimit?: RateLimitInfo;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: Date;
}

export interface RequestConfig {
  timeout?: number;
  retries?: number;
  cache?: boolean | CacheConfig;
  rateLimit?: boolean;
  authentication?: AuthConfig;
  validation?: ValidationConfig;
  transform?: TransformConfig;
}

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  key?: string;
  strategy: 'memory' | 'localStorage' | 'sessionStorage' | 'custom';
}

export interface AuthConfig {
  type: 'bearer' | 'basic' | 'apiKey' | 'custom';
  token?: string;
  credentials?: {
    username: string;
    password: string;
  };
  apiKey?: {
    name: string;
    value: string;
    location: 'header' | 'query';
  };
  custom?: (request: any) => any;
}

export interface ValidationConfig {
  request?: (data: unknown) => boolean | Promise<boolean>;
  response?: (data: unknown) => boolean | Promise<boolean>;
  schema?: any; // JSON Schema or similar
}

export interface TransformConfig {
  request?: (data: unknown) => unknown;
  response?: (data: unknown) => unknown;
}

export interface IAPIFacade {
  name: string;
  
  // Core methods
  get<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>>;
  post<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<APIResponse<T>>;
  put<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<APIResponse<T>>;
  patch<T>(endpoint: string, data?: unknown, config?: RequestConfig): Promise<APIResponse<T>>;
  delete<T>(endpoint: string, config?: RequestConfig): Promise<APIResponse<T>>;
  
  // Batch operations
  batch<T>(requests: BatchRequest[]): Promise<APIResponse<T[]>>;
  
  // Configuration
  configure(config: FacadeConfig): void;
  getConfiguration(): FacadeConfig;
  
  // Cache management
  clearCache(pattern?: string): void;
  getCacheStats(): CacheStats;
  
  // Health and monitoring
  getHealthStatus(): Promise<HealthStatus>;
  getMetrics(): FacadeMetrics;
}

export interface BatchRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  data?: unknown;
  config?: RequestConfig;
}

export interface FacadeConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  cache: CacheConfig;
  authentication: AuthConfig;
  rateLimit: {
    enabled: boolean;
    maxRequests: number;
    windowMs: number;
  };
  logging: {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
  };
  metrics: {
    enabled: boolean;
    endpoint?: string;
  };
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  responseTime: number;
  errors: number;
  details: Record<string, unknown>;
}

export interface FacadeMetrics {
  requests: {
    total: number;
    successful: number;
    failed: number;
    averageTime: number;
  };
  cache: CacheStats;
  rateLimit: {
    throttled: number;
    rejected: number;
  };
  errors: {
    byCode: Record<string, number>;
    byEndpoint: Record<string, number>;
  };
}

// Specific facade interfaces for different domains
export interface IContentFacade extends IAPIFacade {
  // Content management
  getHeroSections(): Promise<APIResponse<any[]>>;
  getEvents(filters?: EventFilters): Promise<APIResponse<any[]>>;
  getArtists(pagination?: Pagination): Promise<APIResponse<any[]>>;
  getCarousels(type?: string): Promise<APIResponse<any[]>>;
  
  // Content operations
  createContent(type: string, data: unknown): Promise<APIResponse<any>>;
  updateContent(type: string, id: string, data: unknown): Promise<APIResponse<any>>;
  deleteContent(type: string, id: string): Promise<APIResponse<any>>;
  
  // Content search and filtering
  searchContent(query: string, filters?: SearchFilters): Promise<APIResponse<any[]>>;
  getContentByTag(tag: string): Promise<APIResponse<any[]>>;
}

export interface IMediaFacade extends IAPIFacade {
  // Media operations
  uploadMedia(file: File, metadata?: MediaMetadata): Promise<APIResponse<MediaUploadResult>>;
  getMediaInfo(id: string): Promise<APIResponse<MediaInfo>>;
  deleteMedia(id: string): Promise<APIResponse<void>>;
  
  // Media processing
  processMedia(id: string, options: ProcessingOptions): Promise<APIResponse<ProcessingResult>>;
  getProcessingStatus(jobId: string): Promise<APIResponse<ProcessingStatus>>;
  
  // Media optimization
  optimizeImage(id: string, options: ImageOptimizationOptions): Promise<APIResponse<any>>;
  generateThumbnails(id: string, sizes: ThumbnailSize[]): Promise<APIResponse<any[]>>;
}

export interface IAnalyticsFacade extends IAPIFacade {
  // Analytics tracking
  trackEvent(event: AnalyticsEvent): Promise<APIResponse<void>>;
  trackPageView(page: string, metadata?: Record<string, unknown>): Promise<APIResponse<void>>;
  trackUser(userId: string, properties: UserProperties): Promise<APIResponse<void>>;
  
  // Analytics retrieval
  getPageViews(dateRange: DateRange): Promise<APIResponse<PageViewStats>>;
  getEventStats(eventType: string, dateRange: DateRange): Promise<APIResponse<EventStats>>;
  getUserStats(dateRange: DateRange): Promise<APIResponse<UserStats>>;
  
  // Real-time analytics
  getRealtimeStats(): Promise<APIResponse<RealtimeStats>>;
}

// Supporting types
export interface EventFilters {
  active?: boolean;
  category?: string;
  dateRange?: DateRange;
  location?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchFilters {
  type?: string;
  tags?: string[];
  dateRange?: DateRange;
  author?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface MediaMetadata {
  title?: string;
  description?: string;
  tags?: string[];
  category?: string;
}

export interface MediaUploadResult {
  id: string;
  url: string;
  metadata: MediaMetadata;
  size: number;
  format: string;
}

export interface MediaInfo {
  id: string;
  url: string;
  metadata: MediaMetadata;
  size: number;
  format: string;
  uploadDate: Date;
  processedVersions?: ProcessedVersion[];
}

export interface ProcessedVersion {
  id: string;
  url: string;
  format: string;
  size: number;
  parameters: Record<string, unknown>;
}

export interface ProcessingOptions {
  format?: string;
  quality?: number;
  dimensions?: { width: number; height: number };
  filters?: string[];
}

export interface ProcessingResult {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  resultUrl?: string;
  error?: string;
}

export interface ProcessingStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  estimatedCompletion?: Date;
  resultUrl?: string;
  error?: string;
}

export interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  progressive?: boolean;
  lossless?: boolean;
}

export interface ThumbnailSize {
  width: number;
  height: number;
  crop?: boolean;
}

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
  timestamp?: Date;
}

export interface UserProperties {
  name?: string;
  email?: string;
  properties?: Record<string, unknown>;
}

export interface PageViewStats {
  totalViews: number;
  uniqueViews: number;
  averageTime: number;
  bounceRate: number;
  topPages: PageStat[];
}

export interface PageStat {
  page: string;
  views: number;
  uniqueViews: number;
  averageTime: number;
}

export interface EventStats {
  totalEvents: number;
  uniqueUsers: number;
  eventBreakdown: EventBreakdown[];
}

export interface EventBreakdown {
  value: string;
  count: number;
  percentage: number;
}

export interface UserStats {
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  averageSessionTime: number;
}

export interface RealtimeStats {
  activeUsers: number;
  currentPageViews: PageStat[];
  recentEvents: AnalyticsEvent[];
  topReferrers: ReferrerStat[];
}

export interface ReferrerStat {
  referrer: string;
  visits: number;
  percentage: number;
}