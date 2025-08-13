'use client';

/**
 * Carousel Container Component
 * 
 * Modernized with custom hooks for better separation of concerns.
 * Uses useCarousel hook to encapsulate carousel business logic.
 */

import React from 'react';
import { ICover } from '@/interfaces/event.interface';
import { CarouselPresentation } from '@/components/presentations/CarouselPresentation';
import { useCarousel } from '@/hooks';

interface CarouselContainerProps {
  fotos: ICover[];
  banner_text: string;
}

export const CarouselContainer: React.FC<CarouselContainerProps> = ({ fotos, banner_text }) => {
  // Business logic: Memoize carousel configuration for performance
  const carouselConfig = React.useMemo(() => ({
    autoplayDelay: 2000,
    pauseOnHover: true,
    disableOnMobile: true,
  }), []);

  // Business logic: Use custom carousel hook with memoized config
  const {
    items: images,
    windowHeight,
    autoplayConfig,
    hasMultipleItems,
  } = useCarousel(fotos, carouselConfig);

  return (
    <CarouselPresentation
      images={images}
      banner_text={banner_text}
      windowHeight={windowHeight}
      autoplayConfig={autoplayConfig}
      hasMultipleImages={hasMultipleItems}
    />
  );
};