/**
 * GraphQL Infrastructure Exports
 *
 * Centralized exports for GraphQL client, hooks, components, and utilities.
 */

// Client configuration
export { apolloClient, clearCache, evictFromCache, updateCacheAfterMutation } from './client';
export { default as ApolloProvider } from './ApolloProvider';

// Schema and types
export { FRAGMENTS, QUERIES, MUTATIONS, SUBSCRIPTIONS } from './schema';
export * from './types';

// Hooks
export { useInfiniteScroll, useApolloInfiniteScroll } from './hooks/useInfiniteScroll';
export {
  useEventsInfiniteScroll,
  useFeaturedEventsInfiniteScroll,
  useUpcomingEventsInfiniteScroll,
  useArtistEventsInfiniteScroll,
  useEventSearchInfiniteScroll,
} from './hooks/useEventsInfiniteScroll';
export {
  useBaseSubscription,
  useEventUpdatesSubscription,
  useTicketAvailabilitySubscription,
  useNewEventsSubscription,
  useArtistUpdatesSubscription,
  useUserNotificationsSubscription,
  useEventSubscriptions,
  useUserSubscriptions,
  useSubscriptionManager,
} from './hooks/useSubscriptions';
export { useOfflineSync, useBackgroundRefresh } from './hooks/useOfflineSync';

// Components
export {
  InfiniteScrollList,
  EventInfiniteList,
  ArtistInfiniteList,
} from './components/InfiniteScrollList';
