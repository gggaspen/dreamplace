/**
 * ResponsiveProvider Render Props Component
 *
 * Provides responsive state and window dimensions to child components
 * through the render props pattern.
 */

import React, { ReactNode } from 'react';
import { useResponsive } from '@/hooks/useResponsive';
import { useWindowDimensions } from '@/hooks/useWindowDimensions';

interface ResponsiveProviderRenderProps {
  isDesktop: boolean;
  isMobile: boolean;
  windowDimensions: ReturnType<typeof useWindowDimensions>;
  breakpoint: {
    xs: boolean;
    sm: boolean;
    md: boolean;
    lg: boolean;
    xl: boolean;
  };
}

interface ResponsiveProviderProps {
  children: (props: ResponsiveProviderRenderProps) => ReactNode;
}

export const ResponsiveProvider: React.FC<ResponsiveProviderProps> = ({ children }) => {
  const { isDesktop, isMobile, matches } = useResponsive();
  const windowDimensions = useWindowDimensions();

  // Define common breakpoints
  const breakpoint = {
    xs: matches('(max-width: 479px)'),
    sm: matches('(min-width: 480px) and (max-width: 767px)'),
    md: matches('(min-width: 768px) and (max-width: 991px)'),
    lg: matches('(min-width: 992px) and (max-width: 1199px)'),
    xl: matches('(min-width: 1200px)'),
  };

  return (
    <>
      {children({
        isDesktop,
        isMobile,
        windowDimensions,
        breakpoint,
      })}
    </>
  );
};
