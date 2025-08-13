/**
 * Typography Design Tokens for DreamPlace
 * 
 * Comprehensive typography scale with font families, weights, sizes,
 * and line heights optimized for electronic music event platform.
 */

// Font families (matching the ones loaded in layout.tsx)
export const fontFamilyTokens = {
  sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
  mono: ['var(--font-geist-mono)', 'Consolas', 'monospace'],
  display: ['Poppins', 'system-ui', 'sans-serif'], // For headings and display text
  body: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'] // For body text
} as const;

// Font weights
export const fontWeightTokens = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900'
} as const;

// Font sizes with fluid typography approach
export const fontSizeTokens = {
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px
  base: '1rem',       // 16px
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
  '6xl': '3.75rem',   // 60px
  '7xl': '4.5rem',    // 72px
  '8xl': '6rem',      // 96px
  '9xl': '8rem'       // 128px
} as const;

// Line heights
export const lineHeightTokens = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2'
} as const;

// Letter spacing
export const letterSpacingTokens = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em'
} as const;

// Typography scale definitions for semantic usage
export const typographyScale = {
  // Display text (hero sections, main headings)
  display: {
    '2xl': {
      fontSize: fontSizeTokens['8xl'],
      lineHeight: lineHeightTokens.none,
      fontWeight: fontWeightTokens.bold,
      letterSpacing: letterSpacingTokens.tighter,
      fontFamily: fontFamilyTokens.display
    },
    xl: {
      fontSize: fontSizeTokens['7xl'],
      lineHeight: lineHeightTokens.none,
      fontWeight: fontWeightTokens.bold,
      letterSpacing: letterSpacingTokens.tighter,
      fontFamily: fontFamilyTokens.display
    },
    lg: {
      fontSize: fontSizeTokens['6xl'],
      lineHeight: lineHeightTokens.tight,
      fontWeight: fontWeightTokens.bold,
      letterSpacing: letterSpacingTokens.tight,
      fontFamily: fontFamilyTokens.display
    },
    md: {
      fontSize: fontSizeTokens['5xl'],
      lineHeight: lineHeightTokens.tight,
      fontWeight: fontWeightTokens.bold,
      letterSpacing: letterSpacingTokens.tight,
      fontFamily: fontFamilyTokens.display
    },
    sm: {
      fontSize: fontSizeTokens['4xl'],
      lineHeight: lineHeightTokens.snug,
      fontWeight: fontWeightTokens.bold,
      letterSpacing: letterSpacingTokens.normal,
      fontFamily: fontFamilyTokens.display
    }
  },

  // Headings
  heading: {
    '2xl': {
      fontSize: fontSizeTokens['4xl'],
      lineHeight: lineHeightTokens.tight,
      fontWeight: fontWeightTokens.bold,
      letterSpacing: letterSpacingTokens.tight,
      fontFamily: fontFamilyTokens.sans
    },
    xl: {
      fontSize: fontSizeTokens['3xl'],
      lineHeight: lineHeightTokens.tight,
      fontWeight: fontWeightTokens.bold,
      letterSpacing: letterSpacingTokens.tight,
      fontFamily: fontFamilyTokens.sans
    },
    lg: {
      fontSize: fontSizeTokens['2xl'],
      lineHeight: lineHeightTokens.snug,
      fontWeight: fontWeightTokens.semibold,
      letterSpacing: letterSpacingTokens.normal,
      fontFamily: fontFamilyTokens.sans
    },
    md: {
      fontSize: fontSizeTokens.xl,
      lineHeight: lineHeightTokens.snug,
      fontWeight: fontWeightTokens.semibold,
      letterSpacing: letterSpacingTokens.normal,
      fontFamily: fontFamilyTokens.sans
    },
    sm: {
      fontSize: fontSizeTokens.lg,
      lineHeight: lineHeightTokens.normal,
      fontWeight: fontWeightTokens.medium,
      letterSpacing: letterSpacingTokens.normal,
      fontFamily: fontFamilyTokens.sans
    }
  },

  // Body text
  body: {
    xl: {
      fontSize: fontSizeTokens.xl,
      lineHeight: lineHeightTokens.relaxed,
      fontWeight: fontWeightTokens.normal,
      letterSpacing: letterSpacingTokens.normal,
      fontFamily: fontFamilyTokens.body
    },
    lg: {
      fontSize: fontSizeTokens.lg,
      lineHeight: lineHeightTokens.relaxed,
      fontWeight: fontWeightTokens.normal,
      letterSpacing: letterSpacingTokens.normal,
      fontFamily: fontFamilyTokens.body
    },
    md: {
      fontSize: fontSizeTokens.base,
      lineHeight: lineHeightTokens.normal,
      fontWeight: fontWeightTokens.normal,
      letterSpacing: letterSpacingTokens.normal,
      fontFamily: fontFamilyTokens.body
    },
    sm: {
      fontSize: fontSizeTokens.sm,
      lineHeight: lineHeightTokens.normal,
      fontWeight: fontWeightTokens.normal,
      letterSpacing: letterSpacingTokens.normal,
      fontFamily: fontFamilyTokens.body
    },
    xs: {
      fontSize: fontSizeTokens.xs,
      lineHeight: lineHeightTokens.normal,
      fontWeight: fontWeightTokens.normal,
      letterSpacing: letterSpacingTokens.wide,
      fontFamily: fontFamilyTokens.body
    }
  },

  // Labels and UI text
  label: {
    lg: {
      fontSize: fontSizeTokens.sm,
      lineHeight: lineHeightTokens.normal,
      fontWeight: fontWeightTokens.medium,
      letterSpacing: letterSpacingTokens.wide,
      fontFamily: fontFamilyTokens.sans
    },
    md: {
      fontSize: fontSizeTokens.sm,
      lineHeight: lineHeightTokens.normal,
      fontWeight: fontWeightTokens.medium,
      letterSpacing: letterSpacingTokens.normal,
      fontFamily: fontFamilyTokens.sans
    },
    sm: {
      fontSize: fontSizeTokens.xs,
      lineHeight: lineHeightTokens.normal,
      fontWeight: fontWeightTokens.medium,
      letterSpacing: letterSpacingTokens.wide,
      fontFamily: fontFamilyTokens.sans
    }
  },

  // Code and monospace
  code: {
    lg: {
      fontSize: fontSizeTokens.base,
      lineHeight: lineHeightTokens.normal,
      fontWeight: fontWeightTokens.normal,
      letterSpacing: letterSpacingTokens.normal,
      fontFamily: fontFamilyTokens.mono
    },
    md: {
      fontSize: fontSizeTokens.sm,
      lineHeight: lineHeightTokens.normal,
      fontWeight: fontWeightTokens.normal,
      letterSpacing: letterSpacingTokens.normal,
      fontFamily: fontFamilyTokens.mono
    },
    sm: {
      fontSize: fontSizeTokens.xs,
      lineHeight: lineHeightTokens.normal,
      fontWeight: fontWeightTokens.normal,
      letterSpacing: letterSpacingTokens.normal,
      fontFamily: fontFamilyTokens.mono
    }
  }
} as const;

// Responsive typography utilities
export const responsiveTypography = {
  // Hero section responsive text
  hero: {
    mobile: typographyScale.display.md,
    tablet: typographyScale.display.lg,
    desktop: typographyScale.display.xl
  },
  
  // Section headings
  sectionHeading: {
    mobile: typographyScale.heading.lg,
    tablet: typographyScale.heading.xl,
    desktop: typographyScale.heading['2xl']
  },
  
  // Card titles
  cardTitle: {
    mobile: typographyScale.heading.sm,
    tablet: typographyScale.heading.md,
    desktop: typographyScale.heading.lg
  }
} as const;

// Export types
export type FontFamily = keyof typeof fontFamilyTokens;
export type FontWeight = keyof typeof fontWeightTokens;
export type FontSize = keyof typeof fontSizeTokens;
export type LineHeight = keyof typeof lineHeightTokens;
export type LetterSpacing = keyof typeof letterSpacingTokens;