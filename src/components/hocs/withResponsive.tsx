/**
 * withResponsive HOC
 *
 * Higher-Order Component that injects responsive state into components.
 * Provides mobile/desktop detection and window dimensions.
 */

import React, { ComponentType } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';

interface ResponsiveProps {
  isDesktop: boolean;
  isMobile: boolean;
  windowDimensions: ReturnType<typeof useWindowDimensions>;
}

export function withResponsive<P extends object>(Component: ComponentType<P & ResponsiveProps>) {
  const WithResponsiveComponent = (props: P) => {
    const responsive = useResponsive();
    const windowDimensions = useWindowDimensions();

    const enhancedProps = {
      ...props,
      isDesktop: responsive.isDesktop,
      isMobile: responsive.isMobile,
      windowDimensions,
    };

    return <Component {...enhancedProps} />;
  };

  WithResponsiveComponent.displayName = `withResponsive(${Component.displayName || Component.name})`;

  return WithResponsiveComponent;
}
