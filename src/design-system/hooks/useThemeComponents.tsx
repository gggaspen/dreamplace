/**
 * Theme-aware React components and HOCs
 */

import React from 'react';
import { useTheme } from './useTheme';
import type { ThemeState } from './useTheme';

// Higher-order component for theme-aware components
export const withTheme = <P extends object>(
  Component: React.ComponentType<P & { theme: ThemeState }>
) => {
  return function ThemedComponent(props: P) {
    const theme = useTheme();
    return <Component {...props} theme={theme} />;
  };
};