/**
 * Color Design Tokens for DreamPlace
 * 
 * This file contains the foundational color palette used throughout
 * the DreamPlace application. Colors are organized by semantic meaning
 * and support both light and dark themes.
 */

export const colorTokens = {
  // Brand colors - Primary purple/violet theme for electronic music
  brand: {
    50: '#f3f1ff',
    100: '#ebe5ff', 
    200: '#d9ceff',
    300: '#bea6ff',
    400: '#9f75ff',
    500: '#843dff', // Primary brand color
    600: '#7916ff',
    700: '#6b04fd',
    800: '#5a03d4',
    900: '#4b05ad',
    950: '#2c0076'
  },

  // Secondary colors - Complementary teal/cyan for accents
  secondary: {
    50: '#f0fdff',
    100: '#ccf7fe', 
    200: '#9aedfe',
    300: '#58defc',
    400: '#06c6f7',
    500: '#00a9dd', // Secondary brand color
    600: '#0284bb',
    700: '#096997',
    800: '#10567c',
    900: '#144868',
    950: '#082e46'
  },

  // Grayscale for text and backgrounds
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a'
  },

  // Semantic colors
  semantic: {
    success: {
      50: '#ecfdf5',
      500: '#10b981',
      600: '#059669',
      700: '#047857'
    },
    warning: {
      50: '#fffbeb',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309'
    },
    error: {
      50: '#fef2f2',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c'
    },
    info: {
      50: '#eff6ff',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8'
    }
  },

  // Music-specific colors for events and genres
  music: {
    techno: '#ff0080',
    house: '#00ff80',
    trance: '#8000ff',
    ambient: '#80ff00',
    breakbeat: '#ff8000'
  }
} as const;

// Theme-aware color mappings
export const lightThemeColors = {
  background: {
    primary: colorTokens.neutral[50],
    secondary: colorTokens.neutral[100],
    tertiary: colorTokens.neutral[200]
  },
  surface: {
    primary: '#ffffff',
    secondary: colorTokens.neutral[50],
    accent: colorTokens.brand[50]
  },
  text: {
    primary: colorTokens.neutral[900],
    secondary: colorTokens.neutral[600],
    tertiary: colorTokens.neutral[400],
    inverse: colorTokens.neutral[50]
  },
  border: {
    primary: colorTokens.neutral[200],
    secondary: colorTokens.neutral[300],
    accent: colorTokens.brand[200]
  }
} as const;

export const darkThemeColors = {
  background: {
    primary: colorTokens.neutral[950],
    secondary: colorTokens.neutral[900],
    tertiary: colorTokens.neutral[800]
  },
  surface: {
    primary: colorTokens.neutral[900],
    secondary: colorTokens.neutral[800],
    accent: colorTokens.brand[900]
  },
  text: {
    primary: colorTokens.neutral[50],
    secondary: colorTokens.neutral[400],
    tertiary: colorTokens.neutral[500],
    inverse: colorTokens.neutral[900]
  },
  border: {
    primary: colorTokens.neutral[800],
    secondary: colorTokens.neutral[700],
    accent: colorTokens.brand[800]
  }
} as const;

// Export color utilities
export type ColorToken = keyof typeof colorTokens;
export type BrandColorShade = keyof typeof colorTokens.brand;
export type SemanticColor = keyof typeof colorTokens.semantic;