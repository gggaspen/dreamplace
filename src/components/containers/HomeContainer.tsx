'use client';

/**
 * Home Container Component
 *
 * Handles all business logic, data fetching, and state management for the home page.
 * This container follows the container/presentational pattern where containers
 * handle logic and presentational components handle rendering.
 */

import React from 'react';
import { useAppData, useLoadingState, useGlobalError } from '@/infrastructure/state/hooks';
import { HomePresentation } from '@/components/presentations/HomePresentation';
import LoadingScreen from '@/components/loading-screen/LoadingScreen';
import { ErrorDisplay } from '@/components/presentations/ErrorDisplay';

export interface HomeData {
  heroSections: any;
  activeEvent: any;
  artists: any[];
  contactInfo: any;
  carousel?: {
    fotos: any[];
    banner_text: string;
  };
  spotifySection: any;
}

export const HomeContainer: React.FC = () => {
  // Business logic: Data fetching and state management
  const { data, isLoading, error, isError } = useAppData();
  const isAppLoading = useLoadingState();
  const globalError = useGlobalError();

  // Business logic: Loading state determination (memoized for performance)
  const shouldShowLoading = React.useMemo(
    () => isLoading || isAppLoading || !data,
    [isLoading, isAppLoading, data]
  );

  // Business logic: Error state determination (memoized for performance)
  const shouldShowError = React.useMemo(() => isError || globalError, [isError, globalError]);

  const errorMessage = React.useMemo(
    () => globalError || error?.message || 'An unexpected error occurred. Please try again later.',
    [globalError, error?.message]
  );

  // Business logic: Data transformation (memoized for performance)
  const transformedData: HomeData | null = React.useMemo(() => {
    if (!data) return null;

    return {
      heroSections: data.heroSections,
      activeEvent: data.activeEvent,
      artists: data.artists,
      contactInfo: data.contactInfo,
      carousel: data.carousel,
      spotifySection: data.spotifySection,
    };
  }, [data]);

  // Conditional rendering based on application state
  if (shouldShowLoading) {
    return <LoadingScreen />;
  }

  if (shouldShowError) {
    return <ErrorDisplay message={errorMessage} />;
  }

  if (!transformedData) {
    return <ErrorDisplay message='No data available' />;
  }

  // Delegate rendering to presentational component
  return <HomePresentation data={transformedData} />;
};
