/**
 * useResponsive Hook
 *
 * Custom hook for handling responsive behavior and media queries.
 * Provides reusable logic for detecting desktop/mobile states.
 */

import { useState, useEffect } from 'react';

interface UseResponsiveOptions {
  breakpoint?: string;
  defaultValue?: boolean;
}

export const useResponsive = ({
  breakpoint = '(min-width: 768px)',
  defaultValue = false,
}: UseResponsiveOptions = {}) => {
  const [isDesktop, setIsDesktop] = useState<boolean>(defaultValue);
  const [isMobile, setIsMobile] = useState<boolean>(!defaultValue);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(breakpoint);

    // Set initial value
    setIsDesktop(mediaQuery.matches);
    setIsMobile(!mediaQuery.matches);

    const handleResize = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
      setIsMobile(!event.matches);
    };

    mediaQuery.addEventListener('change', handleResize);

    return () => {
      mediaQuery.removeEventListener('change', handleResize);
    };
  }, [breakpoint]);

  return {
    isDesktop,
    isMobile,
    // Utility methods
    matches: (query: string) => {
      if (typeof window === 'undefined') return false;
      return window.matchMedia(query).matches;
    },
  };
};
