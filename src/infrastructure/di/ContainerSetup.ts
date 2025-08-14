import { Container, DIContainer } from './Container';
import { SERVICE_TOKENS } from './ServiceTokens';

// Configuration
import { configService } from '../config/AppConfig';
import { createLogger } from '../logging/Logger';
import { createCacheService } from '../cache/CacheService';

// External Services
import { StrapiApiClient } from '../api/client/StrapiApiClient';
import { firebaseAuth } from '../auth/firebase';

// Repositories
import { StrapiEventRepository } from '../repositories/StrapiEventRepository';
import { StrapiArtistRepository } from '../repositories/StrapiArtistRepository';
import { StrapiHeroSectionRepository } from '../repositories/StrapiHeroSectionRepository';
import { StrapiContactInfoRepository } from '../repositories/StrapiContactInfoRepository';
import { FirebaseAuthRepository } from '../auth/FirebaseAuthRepository';

// Authentication
import { LoginUseCase } from '../../domain/auth/usecases/LoginUseCase';
import { ConsoleLogger } from '../logging/ConsoleLogger';

// Use Cases
import { GetAllEventsUseCase } from '../../core/application/use-cases/GetAllEventsUseCase';
import { GetActiveEventUseCase } from '../../core/application/use-cases/GetActiveEventUseCase';
import { GetAllArtistsUseCase } from '../../core/application/use-cases/GetAllArtistsUseCase';
import { GetAppDataUseCase } from '../../core/application/use-cases/GetAppDataUseCase';

export const setupContainer = (container: DIContainer): void => {
  // Configuration
  container.registerSingleton(SERVICE_TOKENS.CONFIG_SERVICE, () => configService);

  // Logging
  container.registerSingleton(SERVICE_TOKENS.LOGGER, () => {
    const config = configService.getLogging();
    return createLogger(config);
  });

  // Cache
  container.registerSingleton(SERVICE_TOKENS.CACHE_SERVICE, () => {
    const cacheConfig = configService.getCache();
    return createCacheService(
      cacheConfig.provider,
      cacheConfig.ttl,
      cacheConfig.maxSize,
      cacheConfig.redisUrl
    );
  });

  // External Services
  container.registerSingleton(SERVICE_TOKENS.STRAPI_API_CLIENT, () => {
    return StrapiApiClient.getInstance();
  });

  container.registerSingleton(SERVICE_TOKENS.FIREBASE_AUTH, () => {
    return firebaseAuth;
  });

  // Repositories - Register as sync factories since StrapiApiClient is sync
  container.registerSingleton(SERVICE_TOKENS.EVENT_REPOSITORY, () => {
    const apiClient = container.resolveSync<StrapiApiClient>(SERVICE_TOKENS.STRAPI_API_CLIENT);
    return new StrapiEventRepository(apiClient);
  });

  container.registerSingleton(SERVICE_TOKENS.ARTIST_REPOSITORY, () => {
    const apiClient = container.resolveSync<StrapiApiClient>(SERVICE_TOKENS.STRAPI_API_CLIENT);
    return new StrapiArtistRepository(apiClient);
  });

  container.registerSingleton(SERVICE_TOKENS.HERO_SECTION_REPOSITORY, () => {
    const apiClient = container.resolveSync<StrapiApiClient>(SERVICE_TOKENS.STRAPI_API_CLIENT);
    return new StrapiHeroSectionRepository(apiClient);
  });

  container.registerSingleton(SERVICE_TOKENS.CONTACT_INFO_REPOSITORY, () => {
    const apiClient = container.resolveSync<StrapiApiClient>(SERVICE_TOKENS.STRAPI_API_CLIENT);
    return new StrapiContactInfoRepository(apiClient);
  });

  container.registerSingleton(SERVICE_TOKENS.AUTH_REPOSITORY, () => {
    const auth = container.resolveSync(SERVICE_TOKENS.FIREBASE_AUTH);
    const logger = new ConsoleLogger('Auth');
    return new FirebaseAuthRepository(auth, logger);
  });

  // Use Cases - Use sync resolution for React compatibility
  container.registerTransient(SERVICE_TOKENS.GET_ALL_EVENTS_USE_CASE, () => {
    const eventRepository = container.resolveSync(SERVICE_TOKENS.EVENT_REPOSITORY);
    return new GetAllEventsUseCase(eventRepository);
  });

  container.registerTransient(SERVICE_TOKENS.GET_ACTIVE_EVENT_USE_CASE, () => {
    const eventRepository = container.resolveSync(SERVICE_TOKENS.EVENT_REPOSITORY);
    return new GetActiveEventUseCase(eventRepository);
  });

  container.registerTransient(SERVICE_TOKENS.GET_ALL_ARTISTS_USE_CASE, () => {
    const artistRepository = container.resolveSync(SERVICE_TOKENS.ARTIST_REPOSITORY);
    return new GetAllArtistsUseCase(artistRepository);
  });

  container.registerTransient(SERVICE_TOKENS.GET_APP_DATA_USE_CASE, () => {
    // For React hooks, we need synchronous resolution
    // Repositories are registered as singletons, so they should be available synchronously once initialized
    const eventRepository = container.resolveSync(SERVICE_TOKENS.EVENT_REPOSITORY);
    const artistRepository = container.resolveSync(SERVICE_TOKENS.ARTIST_REPOSITORY);
    const heroSectionRepository = container.resolveSync(SERVICE_TOKENS.HERO_SECTION_REPOSITORY);
    const contactInfoRepository = container.resolveSync(SERVICE_TOKENS.CONTACT_INFO_REPOSITORY);

    return new GetAppDataUseCase(
      eventRepository,
      artistRepository,
      heroSectionRepository,
      contactInfoRepository
    );
  });

  container.registerTransient(SERVICE_TOKENS.LOGIN_USE_CASE, () => {
    const authRepository = container.resolveSync(SERVICE_TOKENS.AUTH_REPOSITORY);
    const logger = new ConsoleLogger('LoginUseCase');
    return new LoginUseCase(authRepository, logger);
  });
};
