/**
 * Events Infinite Scroll Hook
 * 
 * Specialized hook for infinite scrolling through events with
 * filtering, sorting, and search capabilities.
 */

import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { QUERIES } from '../schema';
import {
  Event,
  EventConnection,
  GetEventsVariables,
  EventWhereInput,
  EventOrderByInput,
} from '../types';
import { useApolloInfiniteScroll } from './useInfiniteScroll';

// Hook options
interface UseEventsInfiniteScrollOptions {
  pageSize?: number;
  where?: EventWhereInput;
  orderBy?: EventOrderByInput;
  enabled?: boolean;
  threshold?: number;
  rootMargin?: string;
}

// Hook result
interface UseEventsInfiniteScrollResult {
  events: Event[];
  loading: boolean;
  error: any;
  hasNextPage: boolean;
  loadMore: () => Promise<void>;
  loadMoreRef: (node: HTMLElement | null) => void;
  refetch: () => void;
  totalCount: number;
}

export function useEventsInfiniteScroll(
  options: UseEventsInfiniteScrollOptions = {}
): UseEventsInfiniteScrollResult {
  const {
    pageSize = 20,
    where,
    orderBy = { field: 'startDate', direction: 'ASC' },
    enabled = true,
    threshold = 0.1,
    rootMargin = '100px',
  } = options;

  // Apollo query
  const queryResult = useQuery(QUERIES.GET_EVENTS, {
    variables: {
      first: pageSize,
      where,
      orderBy,
    } as GetEventsVariables,
    skip: !enabled,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  });

  // Extract events from connection
  const getConnection = (data: any): EventConnection => data?.events;

  // Infinite scroll hook
  const infiniteScrollResult = useApolloInfiniteScroll({
    queryResult,
    getConnection,
    threshold,
    rootMargin,
  });

  // Memoized events array
  const events = useMemo(() => {
    const connection = queryResult.data ? getConnection(queryResult.data) : null;
    return connection?.edges?.map(edge => edge.node) || [];
  }, [queryResult.data]);

  // Total count
  const totalCount = useMemo(() => {
    const connection = queryResult.data ? getConnection(queryResult.data) : null;
    return connection?.pageInfo?.totalCount || 0;
  }, [queryResult.data]);

  return {
    events,
    loading: queryResult.loading,
    error: queryResult.error,
    hasNextPage: infiniteScrollResult.hasNextPage,
    loadMore: infiniteScrollResult.loadMore,
    loadMoreRef: infiniteScrollResult.loadMoreRef,
    refetch: queryResult.refetch,
    totalCount,
  };
}

// Specialized hook for featured events
export function useFeaturedEventsInfiniteScroll() {
  return useEventsInfiniteScroll({
    where: {
      status: 'PUBLISHED',
    },
    orderBy: { field: 'popularity', direction: 'DESC' },
    pageSize: 12,
  });
}

// Specialized hook for upcoming events
export function useUpcomingEventsInfiniteScroll() {
  const now = new Date().toISOString();
  
  return useEventsInfiniteScroll({
    where: {
      status: 'PUBLISHED',
      startDate: {
        gte: now,
      },
    },
    orderBy: { field: 'startDate', direction: 'ASC' },
    pageSize: 15,
  });
}

// Specialized hook for events by artist
export function useArtistEventsInfiniteScroll(artistId: string) {
  return useEventsInfiniteScroll({
    where: {
      status: 'PUBLISHED',
      artistIds: [artistId],
    },
    orderBy: { field: 'startDate', direction: 'DESC' },
    pageSize: 10,
    enabled: !!artistId,
  });
}

// Specialized hook for event search
export function useEventSearchInfiniteScroll(searchQuery: string, filters?: EventWhereInput) {
  return useEventsInfiniteScroll({
    where: {
      ...filters,
      search: searchQuery,
      status: 'PUBLISHED',
    },
    orderBy: { field: 'startDate', direction: 'ASC' },
    pageSize: 20,
    enabled: !!searchQuery.trim(),
  });
}