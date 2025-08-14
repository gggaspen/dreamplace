export const SERVICE_TOKENS = {
  // Configuration
  CONFIG_SERVICE: Symbol('ConfigService'),

  // Logging
  LOGGER: Symbol('Logger'),

  // Cache
  CACHE_SERVICE: Symbol('CacheService'),

  // External Services
  STRAPI_API_CLIENT: Symbol('StrapiApiClient'),
  FIREBASE_AUTH: Symbol('FirebaseAuth'),

  // Repositories
  EVENT_REPOSITORY: Symbol('EventRepository'),
  ARTIST_REPOSITORY: Symbol('ArtistRepository'),
  HERO_SECTION_REPOSITORY: Symbol('HeroSectionRepository'),
  CONTACT_INFO_REPOSITORY: Symbol('ContactInfoRepository'),
  AUTH_REPOSITORY: Symbol('AuthRepository'),

  // Use Cases
  GET_ALL_EVENTS_USE_CASE: Symbol('GetAllEventsUseCase'),
  GET_ACTIVE_EVENT_USE_CASE: Symbol('GetActiveEventUseCase'),
  GET_ALL_ARTISTS_USE_CASE: Symbol('GetAllArtistsUseCase'),
  GET_APP_DATA_USE_CASE: Symbol('GetAppDataUseCase'),
  LOGIN_USE_CASE: Symbol('LoginUseCase'),

  // Services
  APP_SERVICE: Symbol('AppService')
} as const;

export type ServiceToken = typeof SERVICE_TOKENS[keyof typeof SERVICE_TOKENS];

// Legacy export for backward compatibility
export const ServiceTokens = SERVICE_TOKENS;