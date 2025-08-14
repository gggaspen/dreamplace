/**
 * DataProvider Render Props Component
 *
 * Flexible data provider that uses render props pattern to provide
 * data fetching capabilities to any component structure.
 */

import React, { ReactNode } from 'react';
import { useAppData, useLoadingState, useGlobalError } from '@/infrastructure/state/hooks';

interface DataProviderRenderProps {
  data: any;
  isLoading: boolean;
  error: Error | null;
  hasError: boolean;
  retry: () => void;
}

interface DataProviderProps {
  children: (props: DataProviderRenderProps) => ReactNode;
  fallbackLoading?: ReactNode;
  fallbackError?: (error: Error) => ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({
  children,
  fallbackLoading,
  fallbackError,
}) => {
  const { data, isLoading, error, refetch } = useAppData();
  const isAppLoading = useLoadingState();
  const globalError = useGlobalError();

  const hasError = Boolean(error || globalError);
  const actualError = error || (globalError ? new Error(globalError) : null);
  const isActuallyLoading = isLoading || isAppLoading;

  // If fallbacks are provided and conditions are met, use them
  if (isActuallyLoading && fallbackLoading) {
    return <>{fallbackLoading}</>;
  }

  if (hasError && fallbackError && actualError) {
    return <>{fallbackError(actualError)}</>;
  }

  // Otherwise, delegate to children with render props
  return (
    <>
      {children({
        data,
        isLoading: isActuallyLoading,
        error: actualError,
        hasError,
        retry: refetch,
      })}
    </>
  );
};
