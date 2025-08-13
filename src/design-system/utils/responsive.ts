/**
 * Responsive Design System Utilities
 * 
 * Helper functions and utilities for creating consistent
 * responsive designs across the application.
 */

import { breakpoints } from '../tokens/spacing';

// Responsive value type
export type ResponsiveValue<T> = T | {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
};

// Create responsive array for Chakra UI
export const createResponsiveArray = <T>(value: ResponsiveValue<T>): T | T[] => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const { base, sm, md, lg, xl, '2xl': xl2 } = value as any;
    return [base, sm, md, lg, xl, xl2].filter(v => v !== undefined);
  }
  return value as T;
};

// Media query helpers
export const createMediaQuery = (breakpoint: keyof typeof breakpoints): string => {
  return `@media (min-width: ${breakpoints[breakpoint]})`;
};

// Responsive text scaling utilities
export const createResponsiveScale = (
  baseSize: string,
  scaleFactor: number = 1.2
): ResponsiveValue<string> => ({
  base: baseSize,
  sm: `calc(${baseSize} * ${scaleFactor * 0.9})`,
  md: `calc(${baseSize} * ${scaleFactor})`,
  lg: `calc(${baseSize} * ${scaleFactor * 1.1})`,
  xl: `calc(${baseSize} * ${scaleFactor * 1.2})`
});

// Common responsive patterns
export const responsivePatterns = {
  // Stack to row layout
  stackToRow: {
    base: 'column',
    md: 'row'
  },
  
  // Container padding
  containerPadding: {
    base: '4',
    md: '6',
    lg: '8'
  },
  
  // Section spacing
  sectionSpacing: {
    base: '8',
    md: '12',
    lg: '16'
  },
  
  // Grid columns
  gridColumns: {
    events: {
      base: 1,
      sm: 1,
      md: 2,
      lg: 3,
      xl: 4
    },
    artists: {
      base: 1,
      sm: 2,
      md: 3,
      lg: 4
    },
    features: {
      base: 1,
      md: 2,
      lg: 3
    }
  },
  
  // Typography scales
  heroText: {
    base: '4xl',
    md: '6xl',
    lg: '7xl',
    xl: '8xl'
  },
  
  sectionHeading: {
    base: '2xl',
    md: '3xl',
    lg: '4xl'
  },
  
  cardTitle: {
    base: 'lg',
    md: 'xl'
  }
} as const;

// Responsive utilities
export const responsive = {
  // Check if value is responsive
  isResponsive: <T>(value: ResponsiveValue<T>): value is Record<string, T> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  },
  
  // Get value for specific breakpoint
  getValue: <T>(value: ResponsiveValue<T>, breakpoint: keyof typeof breakpoints = 'base'): T => {
    if (responsive.isResponsive(value)) {
      return value[breakpoint] || value.base || (Object.values(value)[0] as T);
    }
    return value as T;
  },
  
  // Create responsive object from array
  fromArray: <T>(values: T[]): ResponsiveValue<T> => {
    const breakpointKeys = ['base', 'sm', 'md', 'lg', 'xl', '2xl'] as const;
    const result: any = {};
    
    values.forEach((value, index) => {
      if (index < breakpointKeys.length && value !== undefined) {
        result[breakpointKeys[index]] = value;
      }
    });
    
    return result;
  }
};

// Container query utilities (for future use)
export const containerQueries = {
  sm: '@container (min-width: 320px)',
  md: '@container (min-width: 768px)',
  lg: '@container (min-width: 1024px)',
  xl: '@container (min-width: 1280px)'
};

// Responsive spacing helpers
export const responsiveSpacing = {
  // Progressive spacing that increases with screen size
  progressive: (base: number = 4): ResponsiveValue<string> => ({
    base: `${base}`,
    sm: `${base * 1.2}`,
    md: `${base * 1.5}`,
    lg: `${base * 2}`,
    xl: `${base * 2.5}`
  }),
  
  // Consistent spacing across all breakpoints
  consistent: (value: number): ResponsiveValue<string> => `${value}`,
  
  // Mobile-first spacing (smaller on mobile, larger on desktop)
  mobileFirst: (mobile: number, desktop: number): ResponsiveValue<string> => ({
    base: `${mobile}`,
    md: `${desktop}`
  })
};

// Layout utilities
export const layoutUtils = {
  // Common flex patterns
  centerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  spaceBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  
  stackVertical: {
    display: 'flex',
    flexDirection: 'column' as const
  },
  
  // Responsive container
  responsiveContainer: {
    width: '100%',
    maxWidth: {
      base: '100%',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    mx: 'auto',
    px: responsivePatterns.containerPadding
  }
};