/**
 * useWindowDimensions Hook
 *
 * Custom hook for tracking window dimensions and viewport size.
 * Handles client-side rendering and provides safe defaults.
 */

import { useState, useEffect } from 'react';

interface WindowDimensions {
  width: number;
  height: number;
  innerWidth: number;
  innerHeight: number;
}

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowDimensions({
        width: window.outerWidth,
        height: window.outerHeight,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
      });
    };

    // Set initial dimensions
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    ...windowDimensions,
    // Helper methods
    windowHeightPx: windowDimensions.innerHeight + 'px',
    windowWidthPx: windowDimensions.innerWidth + 'px',
    isLandscape: windowDimensions.innerWidth > windowDimensions.innerHeight,
    isPortrait: windowDimensions.innerWidth <= windowDimensions.innerHeight,
  };
};
