// Configuration
export {
  configService,
  type AppConfig,
  type ApiConfig,
  type LoggingConfig,
  type CacheConfig,
} from './config/AppConfig';

// Logging
export {
  createLogger,
  getLogger,
  type ILogger,
  type LogLevel,
  type LogEntry,
} from './logging/Logger';

// Cache
export {
  createCacheService,
  MemoryCacheService,
  type ICacheService,
  type CacheEntry,
} from './cache/CacheService';

// External Services
export {
  StrapiApiClient,
  type StrapiConfig,
  type StrapiResponse,
  type StrapiCollectionResponse,
} from './external/StrapiApiClient';

// Repositories
export { StrapiEventRepository } from './repositories/StrapiEventRepository';
export { StrapiArtistRepository } from './repositories/StrapiArtistRepository';
export { StrapiHeroSectionRepository } from './repositories/StrapiHeroSectionRepository';
export { StrapiContactInfoRepository } from './repositories/StrapiContactInfoRepository';

// Dependency Injection
export {
  Container,
  DIContainer,
  createContainer,
  getContainer,
  setContainer,
  type ServiceIdentifier,
  type Factory,
  type AsyncFactory,
} from './di/Container';
export { SERVICE_TOKENS, type ServiceToken } from './di/ServiceTokens';
export { setupContainer } from './di/ContainerSetup';

// Initialize the container with all services
const initializeInfrastructure = () => {
  const container = getContainer();
  setupContainer(container);
  return container;
};

// Auto-initialize the container only in browser environment
if (typeof window !== 'undefined') {
  initializeInfrastructure();
}

export { initializeInfrastructure };
