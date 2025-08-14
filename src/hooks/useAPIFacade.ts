import { useRef, useEffect, useCallback } from 'react';
import { 
  ContentFacade,
  IContentFacade,
  APIResponse,
  EventFilters,
  Pagination,
  SearchFilters 
} from '@/patterns/facade';

/**
 * React hook for API facade pattern integration
 * Provides simplified access to complex API operations
 */
export function useAPIFacade() {
  const contentFacadeRef = useRef<IContentFacade>();

  // Initialize facades
  useEffect(() => {
    if (!contentFacadeRef.current) {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';
      contentFacadeRef.current = new ContentFacade(baseURL);

      // Configure authentication if available
      const token = process.env.NEXT_PUBLIC_API_TOKEN;
      if (token) {
        contentFacadeRef.current.configure({
          authentication: {
            type: 'bearer',
            token,
          },
        });
      }
    }
  }, []);

  // Content operations
  const getHeroSections = useCallback(async () => {
    if (!contentFacadeRef.current) {
      throw new Error('Content facade not initialized');
    }
    return contentFacadeRef.current.getHeroSections();
  }, []);

  const getEvents = useCallback(async (filters?: EventFilters) => {
    if (!contentFacadeRef.current) {
      throw new Error('Content facade not initialized');
    }
    return contentFacadeRef.current.getEvents(filters);
  }, []);

  const getActiveEvents = useCallback(async () => {
    if (!contentFacadeRef.current) {
      throw new Error('Content facade not initialized');
    }
    return contentFacadeRef.current.getEvents({ active: true });
  }, []);

  const getArtists = useCallback(async (pagination?: Pagination) => {
    if (!contentFacadeRef.current) {
      throw new Error('Content facade not initialized');
    }
    return contentFacadeRef.current.getArtists(pagination);
  }, []);

  const getFeaturedArtists = useCallback(async () => {
    if (!contentFacadeRef.current) {
      throw new Error('Content facade not initialized');
    }
    return contentFacadeRef.current.getFeaturedArtists();
  }, []);

  const getCarousels = useCallback(async (type?: string) => {
    if (!contentFacadeRef.current) {
      throw new Error('Content facade not initialized');
    }
    return contentFacadeRef.current.getCarousels(type);
  }, []);

  const searchContent = useCallback(async (query: string, filters?: SearchFilters) => {
    if (!contentFacadeRef.current) {
      throw new Error('Content facade not initialized');
    }
    return contentFacadeRef.current.searchContent(query, filters);
  }, []);

  const getContentByTag = useCallback(async (tag: string) => {
    if (!contentFacadeRef.current) {
      throw new Error('Content facade not initialized');
    }
    return contentFacadeRef.current.getContentByTag(tag);
  }, []);

  // Batch operations
  const getAllPageData = useCallback(async () => {
    if (!contentFacadeRef.current) {
      throw new Error('Content facade not initialized');
    }
    return contentFacadeRef.current.getAllPageData();
  }, []);

  // Content management operations
  const createContent = useCallback(async (type: string, data: unknown) => {
    if (!contentFacadeRef.current) {
      throw new Error('Content facade not initialized');
    }
    return contentFacadeRef.current.createContent(type, data);
  }, []);

  const updateContent = useCallback(async (type: string, id: string, data: unknown) => {
    if (!contentFacadeRef.current) {
      throw new Error('Content facade not initialized');
    }
    return contentFacadeRef.current.updateContent(type, id, data);
  }, []);

  const deleteContent = useCallback(async (type: string, id: string) => {
    if (!contentFacadeRef.current) {
      throw new Error('Content facade not initialized');
    }
    return contentFacadeRef.current.deleteContent(type, id);
  }, []);

  // Facade management
  const configureFacade = useCallback((config: any) => {
    contentFacadeRef.current?.configure(config);
  }, []);

  const getFacadeConfiguration = useCallback(() => {
    return contentFacadeRef.current?.getConfiguration();
  }, []);

  const clearCache = useCallback((pattern?: string) => {
    contentFacadeRef.current?.clearCache(pattern);
  }, []);

  const getCacheStats = useCallback(() => {
    return contentFacadeRef.current?.getCacheStats();
  }, []);

  const getHealthStatus = useCallback(async () => {
    if (!contentFacadeRef.current) {
      throw new Error('Content facade not initialized');
    }
    return contentFacadeRef.current.getHealthStatus();
  }, []);

  const getMetrics = useCallback(() => {
    return contentFacadeRef.current?.getMetrics();
  }, []);

  // Error handling utility
  const handleAPIResponse = useCallback(<T>(
    response: APIResponse<T>,
    onSuccess?: (data: T) => void,
    onError?: (error: any) => void
  ) => {
    if (response.error) {
      console.error('API Error:', response.error);
      onError?.(response.error);
      return null;
    }

    if (response.data) {
      onSuccess?.(response.data);
      return response.data;
    }

    return null;
  }, []);

  return {
    // Content operations
    getHeroSections,
    getEvents,
    getActiveEvents,
    getArtists,
    getFeaturedArtists,
    getCarousels,
    searchContent,
    getContentByTag,
    
    // Batch operations
    getAllPageData,
    
    // Content management
    createContent,
    updateContent,
    deleteContent,
    
    // Facade management
    configureFacade,
    getFacadeConfiguration,
    clearCache,
    getCacheStats,
    getHealthStatus,
    getMetrics,
    
    // Utilities
    handleAPIResponse,
  };
}