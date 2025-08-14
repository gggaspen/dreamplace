/**
 * Spacing Design Tokens for DreamPlace
 *
 * Consistent spacing scale using a geometric progression
 * based on 8px base unit for optimal visual rhythm.
 */

export const spacingTokens = {
  // Base spacing scale (8px base unit)
  none: '0',
  px: '1px',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
} as const;

// Component-specific spacing patterns
export const componentSpacing = {
  // Container spacing
  container: {
    padding: {
      mobile: spacingTokens[4], // 16px
      tablet: spacingTokens[6], // 24px
      desktop: spacingTokens[8], // 32px
    },
    maxWidth: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },

  // Layout sections
  section: {
    padding: {
      mobile: spacingTokens[8], // 32px
      desktop: spacingTokens[16], // 64px
    },
    gap: spacingTokens[12], // 48px
  },

  // Card components
  card: {
    padding: {
      small: spacingTokens[4], // 16px
      medium: spacingTokens[6], // 24px
      large: spacingTokens[8], // 32px
    },
    gap: spacingTokens[4], // 16px
  },

  // Form elements
  form: {
    fieldSpacing: spacingTokens[4], // 16px
    groupSpacing: spacingTokens[6], // 24px
    sectionSpacing: spacingTokens[8], // 32px
  },

  // Navigation
  navigation: {
    itemSpacing: spacingTokens[6], // 24px
    sectionSpacing: spacingTokens[8], // 32px
    padding: spacingTokens[4], // 16px
  },
} as const;

// Responsive breakpoints (matching Tailwind defaults)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Grid system
export const gridTokens = {
  columns: 12,
  gutter: {
    mobile: spacingTokens[4], // 16px
    desktop: spacingTokens[6], // 24px
  },
  margin: {
    mobile: spacingTokens[4], // 16px
    desktop: spacingTokens[8], // 32px
  },
} as const;

// Export types
export type SpacingToken = keyof typeof spacingTokens;
export type Breakpoint = keyof typeof breakpoints;
