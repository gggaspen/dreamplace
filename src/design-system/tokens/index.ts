/**
 * Design System Tokens - Main Export
 *
 * Centralized export of all design tokens for the DreamPlace design system.
 * This file provides a single source of truth for all design decisions.
 */

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './shadows';

// Re-export commonly used token collections for convenience
import { colorTokens, lightThemeColors, darkThemeColors } from './colors';
import { spacingTokens, componentSpacing, breakpoints } from './spacing';
import { fontFamilyTokens, typographyScale, responsiveTypography } from './typography';
import { shadowTokens, componentShadows, glowEffects } from './shadows';

export const tokens = {
  colors: colorTokens,
  spacing: spacingTokens,
  typography: typographyScale,
  shadows: shadowTokens,
} as const;

export const themeTokens = {
  light: {
    colors: lightThemeColors,
    shadows: shadowTokens,
  },
  dark: {
    colors: darkThemeColors,
    shadows: shadowTokens, // Could use darkShadowTokens here if needed
  },
} as const;

export const componentTokens = {
  spacing: componentSpacing,
  shadows: componentShadows,
  typography: responsiveTypography,
} as const;

// Utility function to create consistent theme objects
export const createTheme = (mode: 'light' | 'dark') => ({
  colors: mode === 'light' ? lightThemeColors : darkThemeColors,
  spacing: spacingTokens,
  typography: typographyScale,
  shadows: shadowTokens,
  fonts: fontFamilyTokens,
  breakpoints,
  glowEffects,
});

// Export design system metadata
export const designSystemMeta = {
  name: 'DreamPlace Design System',
  version: '1.0.0',
  description: 'Design tokens and components for the DreamPlace electronic music platform',
  tokens: {
    colors: Object.keys(colorTokens).length,
    spacing: Object.keys(spacingTokens).length,
    typography: Object.keys(typographyScale).length,
    shadows: Object.keys(shadowTokens).length,
  },
} as const;
