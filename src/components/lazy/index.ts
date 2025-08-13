/**
 * Lazy Loaded Components
 * 
 * Code-split components using dynamic imports for better performance.
 * These components will be loaded only when needed.
 */

import { lazyLoad, lazyLoadWithRetry } from '@/utils/dynamic-imports';

// Lazy load heavy components that aren't immediately visible
export const LazyCarousel = lazyLoad(
  () => import('@/app/pages/carousel/Carousel')
);

export const LazyPressCarousel = lazyLoad(
  () => import('@/app/pages/press/carousel/PressCarousel')
);

export const LazyContact = lazyLoad(
  () => import('@/app/pages/contact/Contact')
);

export const LazyFooter = lazyLoad(
  () => import('@/app/pages/footer/Footer')
);

export const LazyResident = lazyLoad(
  () => import('@/app/pages/resident/Resident').then(m => ({ default: m.Resident }))
);

// Lazy load design system components with retry
export const LazyDataTable = lazyLoadWithRetry(
  () => import('@/components/generic/DataTable').then(m => ({ default: m.DataTable }))
);

export const LazyForm = lazyLoadWithRetry(
  () => import('@/components/generic/Form').then(m => ({ default: m.Form }))
);

// Lazy load utility components
export const LazyErrorBoundary = lazyLoad(
  () => import('@/infrastructure/error-handling/ErrorBoundary').then(m => ({ default: m.ErrorBoundary }))
);