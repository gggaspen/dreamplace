// Core facade pattern exports
export { BaseAPIFacade } from './BaseAPIFacade';

// Types and interfaces
export type {
  IAPIFacade,
  IContentFacade,
  IMediaFacade,
  IAnalyticsFacade,
  APIResponse,
  RequestConfig,
  FacadeConfig,
  BatchRequest,
  CacheStats,
  HealthStatus,
  FacadeMetrics,
} from './types';

// Concrete facade implementations
export * from './facades';

// Re-export everything for convenience
export * from './types';
