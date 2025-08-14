import { QueryClient } from '@tanstack/react-query';

const createQueryClient = (): QueryClient => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered stale after 5 minutes
        staleTime: 1000 * 60 * 5,
        // Cache data for 10 minutes
        cacheTime: 1000 * 60 * 10,
        // Retry failed requests up to 3 times
        retry: 3,
        // Retry with exponential backoff
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Don't refetch on window focus in development
        refetchOnWindowFocus: process.env.NODE_ENV === 'production',
        // Don't refetch on reconnect unless data is stale
        refetchOnReconnect: 'always',
        // Only refetch on mount if data is stale
        refetchOnMount: true,
      },
      mutations: {
        // Retry failed mutations once
        retry: 1,
      },
    },
  });
};

// Singleton instance
let queryClient: QueryClient | undefined;

export const getQueryClient = (): QueryClient => {
  if (!queryClient) {
    queryClient = createQueryClient();
  }
  return queryClient;
};

export const resetQueryClient = (): void => {
  queryClient = undefined;
};
