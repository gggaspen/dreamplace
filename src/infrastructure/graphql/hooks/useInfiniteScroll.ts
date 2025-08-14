/**
 * Infinite Scroll Hook
 * 
 * Custom hook that provides infinite scrolling functionality with
 * cursor-based pagination for GraphQL queries.
 */

import { useEffect, useCallback, useRef } from 'react';
import { QueryResult, OperationVariables } from '@apollo/client';

// Intersection Observer options
interface IntersectionOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

// Infinite scroll options
interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
  disabled?: boolean;
  hasNextPage?: boolean;
  loading?: boolean;
}

// Hook return type
interface UseInfiniteScrollResult {
  loadMoreRef: (node: HTMLElement | null) => void;
  isIntersecting: boolean;
}

export function useInfiniteScroll(
  fetchMore: () => void,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollResult {
  const {
    threshold = 0.1,
    rootMargin = '100px',
    disabled = false,
    hasNextPage = false,
    loading = false,
  } = options;

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLElement | null>(null);
  const isIntersectingRef = useRef(false);

  // Intersection Observer callback
  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      isIntersectingRef.current = entry.isIntersecting;

      if (
        entry.isIntersecting &&
        hasNextPage &&
        !loading &&
        !disabled
      ) {
        fetchMore();
      }
    },
    [fetchMore, hasNextPage, loading, disabled]
  );

  // Set ref callback
  const setLoadMoreRef = useCallback(
    (node: HTMLElement | null) => {
      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      loadMoreRef.current = node;

      // Create new observer if node exists
      if (node && !disabled) {
        observerRef.current = new IntersectionObserver(handleIntersection, {
          threshold,
          rootMargin,
        });
        observerRef.current.observe(node);
      }
    },
    [handleIntersection, threshold, rootMargin, disabled]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    loadMoreRef: setLoadMoreRef,
    isIntersecting: isIntersectingRef.current,
  };
}

// Apollo-specific infinite scroll hook
interface UseApolloInfiniteScrollOptions<TData, TVariables extends OperationVariables>
  extends Omit<UseInfiniteScrollOptions, 'hasNextPage' | 'loading'> {
  queryResult: QueryResult<TData, TVariables>;
  getConnection: (data: TData) => any;
  updateQuery?: (previousResult: TData, fetchMoreResult: TData) => TData;
}

export function useApolloInfiniteScroll<TData, TVariables extends OperationVariables>(
  options: UseApolloInfiniteScrollOptions<TData, TVariables>
): UseInfiniteScrollResult & {
  loadMore: () => Promise<void>;
  hasNextPage: boolean;
  loading: boolean;
  error: any;
} {
  const { queryResult, getConnection, updateQuery, ...scrollOptions } = options;
  const { data, loading, error, fetchMore } = queryResult;

  // Extract pagination info from connection
  const connection = data ? getConnection(data) : null;
  const hasNextPage = connection?.pageInfo?.hasNextPage || false;
  const endCursor = connection?.pageInfo?.endCursor;

  // Load more function
  const loadMore = useCallback(async () => {
    if (!hasNextPage || loading) return;

    try {
      await fetchMore({
        variables: {
          after: endCursor,
        } as Partial<TVariables>,
        updateQuery: updateQuery || ((previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previousResult;
          
          const previousConnection = getConnection(previousResult);
          const newConnection = getConnection(fetchMoreResult);
          
          return {
            ...previousResult,
            [Object.keys(fetchMoreResult)[0]]: {
              ...newConnection,
              edges: [
                ...previousConnection.edges,
                ...newConnection.edges,
              ],
              pageInfo: newConnection.pageInfo,
            },
          } as TData;
        }),
      });
    } catch (err) {
      console.error('Error loading more data:', err);
    }
  }, [hasNextPage, loading, fetchMore, endCursor, updateQuery, getConnection]);

  // Use infinite scroll hook
  const scrollResult = useInfiniteScroll(loadMore, {
    ...scrollOptions,
    hasNextPage,
    loading,
  });

  return {
    ...scrollResult,
    loadMore,
    hasNextPage,
    loading,
    error,
  };
}