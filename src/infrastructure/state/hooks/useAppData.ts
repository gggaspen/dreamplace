import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Container } from '../../di/Container';
import { SERVICE_TOKENS } from '../../di/ServiceTokens';
import { GetAppDataUseCase } from '../../../core/application/use-cases/GetAppDataUseCase';
import { useAppStore } from '../AppStore';

// Query keys for app data
export const appDataKeys = {
  all: ['appData'] as const,
  complete: () => [...appDataKeys.all, 'complete'] as const,
  heroSections: () => [...appDataKeys.all, 'heroSections'] as const,
  contactInfo: () => [...appDataKeys.all, 'contactInfo'] as const,
};

// Hook for getting all app data (hero, events, artists, contact)
export const useAppData = () => {
  const getAppDataUseCase = Container.get<GetAppDataUseCase>(SERVICE_TOKENS.GET_APP_DATA_USE_CASE);
  const setLoading = useAppStore(state => state.setLoading);
  const setGlobalError = useAppStore(state => state.setGlobalError);

  return useQuery({
    queryKey: appDataKeys.complete(),
    queryFn: async () => {
      try {
        setLoading(true);
        setGlobalError(null);
        const data = await getAppDataUseCase.execute();
        return data;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load app data';
        setGlobalError(errorMessage);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on certain error types
      if (error instanceof Error && error.message.includes('Network')) {
        return failureCount < 2; // Only retry network errors twice
      }
      return failureCount < 3;
    },
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};

// Hook for getting hero sections specifically
export const useHeroSections = () => {
  const appData = useAppData();

  return {
    ...appData,
    data: appData.data?.heroSections || [],
  };
};

// Hook for getting contact info specifically
export const useContactInfo = () => {
  const appData = useAppData();

  return {
    ...appData,
    data: appData.data?.contactInfo,
  };
};

// Prefetch app data
export const usePrefetchAppData = () => {
  const queryClient = useQueryClient();
  const getAppDataUseCase = Container.get<GetAppDataUseCase>(SERVICE_TOKENS.GET_APP_DATA_USE_CASE);

  return () => {
    queryClient.prefetchQuery({
      queryKey: appDataKeys.complete(),
      queryFn: () => getAppDataUseCase.execute(),
      staleTime: 1000 * 60 * 5,
    });
  };
};

// Invalidate app data cache
export const useInvalidateAppData = () => {
  const queryClient = useQueryClient();
  const refreshData = useAppStore(state => state.refreshData);

  return () => {
    queryClient.invalidateQueries({ queryKey: appDataKeys.all });
    refreshData(); // Update the app store refresh timestamp
  };
};

// Optimistic update for app data
export const useOptimisticAppDataUpdate = () => {
  const queryClient = useQueryClient();

  return (updater: (oldData: any) => any) => {
    queryClient.setQueryData(appDataKeys.complete(), updater);
  };
};
