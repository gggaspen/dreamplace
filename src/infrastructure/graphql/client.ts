/**
 * Apollo GraphQL Client Configuration
 *
 * Centralized Apollo Client setup with caching, error handling,
 * authentication, and performance optimizations.
 */

import { ApolloClient, InMemoryCache, createHttpLink, from, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { sha256 } from 'crypto-hash';
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';

// Environment configuration
const GRAPHQL_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql';
const GRAPHQL_WS_ENDPOINT =
  process.env.NEXT_PUBLIC_GRAPHQL_WS_ENDPOINT || 'ws://localhost:4000/graphql';

// HTTP Link
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  credentials: 'include', // Include cookies for authentication
});

// WebSocket Link for subscriptions
const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: GRAPHQL_WS_ENDPOINT,
          connectionParams: () => {
            // Get auth token from localStorage or context
            const token = localStorage.getItem('auth_token');
            return {
              authorization: token ? `Bearer ${token}` : '',
            };
          },
        })
      )
    : null;

// Auth Link
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  };
});

// Error Link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);

      // Handle specific error types
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Clear auth token and redirect to login
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }

      if (extensions?.code === 'FORBIDDEN') {
        console.error('Access denied for operation:', operation.operationName);
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);

    // Handle offline scenarios
    if (!navigator.onLine) {
      console.warn('Application is offline. Some features may not work.');
    }
  }
});

// Custom retry logic (simplified)
const retryLink = from([]);

// Split link for handling subscriptions vs queries/mutations
const splitLink =
  typeof window !== 'undefined' && wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return (
            definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
          );
        },
        wsLink,
        from([errorLink, authLink, httpLink])
      )
    : from([errorLink, authLink, httpLink]);

// Cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        // Pagination handling for events
        events: {
          keyArgs: ['where', 'orderBy'],
          merge(existing = [], incoming, { args }) {
            const { offset = 0 } = args || {};
            const merged = existing ? [...existing] : [];

            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }

            return merged;
          },
        },

        // Pagination handling for artists
        artists: {
          keyArgs: ['where', 'orderBy'],
          merge(existing = [], incoming, { args }) {
            const { offset = 0 } = args || {};
            const merged = existing ? [...existing] : [];

            for (let i = 0; i < incoming.length; ++i) {
              merged[offset + i] = incoming[i];
            }

            return merged;
          },
        },
      },
    },

    // Type policies for specific entities
    Event: {
      fields: {
        attendees: {
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },

    Artist: {
      fields: {
        followers: {
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },

    User: {
      fields: {
        bookmarks: {
          merge(existing = [], incoming) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: splitLink,
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: process.env.NODE_ENV === 'development',
});

// Helper functions for cache management
export const clearCache = () => {
  apolloClient.cache.reset();
};

export const evictFromCache = (typename: string, id: string) => {
  apolloClient.cache.evict({
    id: apolloClient.cache.identify({ __typename: typename, id }),
  });
  apolloClient.cache.gc();
};

export const updateCacheAfterMutation = (
  typename: string,
  id: string,
  data: Record<string, any>
) => {
  apolloClient.cache.modify({
    id: apolloClient.cache.identify({ __typename: typename, id }),
    fields: data,
  });
};

// Network status helpers
export const isNetworkError = (error: any): boolean => {
  return error?.networkError !== undefined;
};

export const isAuthError = (error: any): boolean => {
  return error?.graphQLErrors?.some((err: any) => err.extensions?.code === 'UNAUTHENTICATED');
};

export const isForbiddenError = (error: any): boolean => {
  return error?.graphQLErrors?.some((err: any) => err.extensions?.code === 'FORBIDDEN');
};
