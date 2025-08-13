/**
 * LazyImage Component
 * 
 * Optimized image component with lazy loading, blur placeholder,
 * and progressive enhancement for better performance.
 */

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Box, Skeleton } from '@chakra-ui/react';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  blur?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  fill?: boolean;
  sizes?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = React.memo(({
  src,
  alt,
  width = 800,
  height = 600,
  priority = false,
  blur = true,
  placeholder = 'blur',
  blurDataURL,
  quality = 75,
  fill = false,
  sizes,
  className,
  style,
  onLoad,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imageRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    const currentRef = imageRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [priority, isInView]);

  // Generate blur placeholder
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, w, h);
    }
    
    return canvas.toDataURL();
  };

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  // Default blur data URL
  const defaultBlurDataURL = blurDataURL || generateBlurDataURL(10, 10);

  const imageProps = {
    src,
    alt,
    quality,
    onLoad: handleLoad,
    onError: handleError,
    className,
    style,
    ...(fill ? { fill: true } : { width, height }),
    ...(sizes && { sizes }),
    ...(blur && placeholder === 'blur' && { 
      placeholder: 'blur' as const,
      blurDataURL: defaultBlurDataURL 
    }),
  };

  return (
    <Box 
      ref={imageRef} 
      position="relative"
      width={fill ? '100%' : width}
      height={fill ? '100%' : height}
    >
      {/* Loading skeleton */}
      {isLoading && !hasError && (
        <Skeleton 
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={1}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="gray.100"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="gray.500"
          fontSize="sm"
        >
          Failed to load image
        </Box>
      )}

      {/* Actual image - only render when in view or priority */}
      {(isInView || priority) && !hasError && (
        <Image
          {...imageProps}
          priority={priority}
        />
      )}
    </Box>
  );
});