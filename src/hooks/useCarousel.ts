/**
 * useCarousel Hook
 * 
 * Custom hook that encapsulates carousel business logic.
 * Handles autoplay configuration, image management, and responsive behavior.
 */

import { useState, useEffect } from 'react';
import { useResponsive } from './useResponsive';
import { useWindowDimensions } from './useWindowDimensions';

interface CarouselItem {
  id: string | number;
  [key: string]: any;
}

interface UseCarouselOptions {
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  disableOnMobile?: boolean;
}

export const useCarousel = <T extends CarouselItem>(
  items: T[],
  options: UseCarouselOptions = {}
) => {
  const {
    autoplayDelay = 2000,
    pauseOnHover = true,
    disableOnMobile = true,
  } = options;

  const [carouselItems, setCarouselItems] = useState<T[]>([]);
  const { isDesktop } = useResponsive();
  const { windowHeightPx } = useWindowDimensions();

  // Initialize carousel items
  useEffect(() => {
    setCarouselItems(items);
  }, [items]);

  // Generate autoplay configuration based on responsive state
  const getAutoplayConfig = () => ({
    delay: autoplayDelay,
    disableOnInteraction: disableOnMobile ? !isDesktop : false,
    pauseOnMouseEnter: pauseOnHover && isDesktop,
  });

  return {
    // State
    items: carouselItems,
    isDesktop,
    windowHeight: windowHeightPx,
    
    // Configuration
    autoplayConfig: getAutoplayConfig(),
    hasMultipleItems: carouselItems.length > 1,
    itemCount: carouselItems.length,
    
    // Actions
    updateItems: setCarouselItems,
  };
};