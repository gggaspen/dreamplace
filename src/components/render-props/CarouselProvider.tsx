/**
 * CarouselProvider Render Props Component
 *
 * Provides carousel functionality and state management through render props.
 * Allows complete customization of carousel UI while managing logic.
 */

import React, { ReactNode } from 'react';
import { useCarousel } from '@/hooks/useCarousel';

interface CarouselItem {
  id: string | number;
  [key: string]: any;
}

interface CarouselProviderRenderProps<T extends CarouselItem> {
  items: T[];
  currentIndex: number;
  isDesktop: boolean;
  windowHeight: string;
  autoplayConfig: {
    delay: number;
    disableOnInteraction: boolean;
    pauseOnMouseEnter: boolean;
  };
  hasMultipleItems: boolean;
  itemCount: number;
  // Control functions
  goToNext: () => void;
  goToPrevious: () => void;
  goToSlide: (index: number) => void;
  play: () => void;
  pause: () => void;
}

interface CarouselProviderProps<T extends CarouselItem> {
  items: T[];
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  disableOnMobile?: boolean;
  children: (props: CarouselProviderRenderProps<T>) => ReactNode;
}

export function CarouselProvider<T extends CarouselItem>({
  items,
  autoplayDelay = 2000,
  pauseOnHover = true,
  disableOnMobile = true,
  children,
}: CarouselProviderProps<T>) {
  const carousel = useCarousel(items, {
    autoplayDelay,
    pauseOnHover,
    disableOnMobile,
  });

  // Mock control functions (would be implemented with actual carousel logic)
  const carouselControls = {
    currentIndex: 0, // This would come from carousel state
    goToNext: () => console.log('Next slide'),
    goToPrevious: () => console.log('Previous slide'),
    goToSlide: (index: number) => console.log(`Go to slide ${index}`),
    play: () => console.log('Play carousel'),
    pause: () => console.log('Pause carousel'),
  };

  return (
    <>
      {children({
        ...carousel,
        ...carouselControls,
      })}
    </>
  );
}
