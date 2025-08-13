/**
 * withLoadingState HOC
 * 
 * Higher-Order Component that adds loading state management to components.
 * Automatically shows loading UI while data is being fetched.
 */

import React, { ComponentType } from 'react';
import LoadingScreen from '@/components/loading-screen/LoadingScreen';

interface LoadingStateProps {
  isLoading?: boolean;
  loadingComponent?: ComponentType<any>;
  loadingProps?: object;
}

export function withLoadingState<P extends object>(
  Component: ComponentType<P>,
  defaultLoadingComponent: ComponentType<any> = LoadingScreen
) {
  const WithLoadingStateComponent = (props: P & LoadingStateProps) => {
    const { 
      isLoading, 
      loadingComponent: LoadingComponent = defaultLoadingComponent,
      loadingProps,
      ...componentProps 
    } = props;

    if (isLoading) {
      return <LoadingComponent {...loadingProps} />;
    }

    return <Component {...(componentProps as P)} />;
  };

  WithLoadingStateComponent.displayName = `withLoadingState(${Component.displayName || Component.name})`;

  return WithLoadingStateComponent;
}