/**
 * DreamPlace Custom Chakra UI Theme
 * 
 * Custom theme configuration that integrates our design tokens
 * with Chakra UI's theming system for consistent brand experience.
 */

import { createSystem, defaultConfig } from '@chakra-ui/react';
import { colorTokens, lightThemeColors, darkThemeColors } from '../tokens/colors';
import { spacingTokens, breakpoints } from '../tokens/spacing';
import { fontFamilyTokens, typographyScale } from '../tokens/typography';
import { shadowTokens, componentShadows } from '../tokens/shadows';

// Define the custom theme configuration
export const dreamPlaceTheme = createSystem(defaultConfig, {
  theme: {
    // Color palette
    colors: {
      // Brand colors
      brand: {
        50: colorTokens.brand[50],
        100: colorTokens.brand[100],
        200: colorTokens.brand[200],
        300: colorTokens.brand[300],
        400: colorTokens.brand[400],
        500: colorTokens.brand[500], // Primary brand color
        600: colorTokens.brand[600],
        700: colorTokens.brand[700],
        800: colorTokens.brand[800],
        900: colorTokens.brand[900],
        950: colorTokens.brand[950]
      },
      
      // Secondary colors  
      secondary: colorTokens.secondary,
      
      // Neutral grays
      gray: colorTokens.neutral,
      
      // Semantic colors
      green: colorTokens.semantic.success,
      yellow: colorTokens.semantic.warning,
      red: colorTokens.semantic.error,
      blue: colorTokens.semantic.info,
      
      // Music genre colors
      music: colorTokens.music
    },

    // Typography
    fonts: {
      heading: fontFamilyTokens.display.join(', '),
      body: fontFamilyTokens.body.join(', '),
      mono: fontFamilyTokens.mono.join(', ')
    },

    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
      '8xl': '6rem',
      '9xl': '8rem'
    },

    fontWeights: {
      hairline: 100,
      thin: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    },

    lineHeights: {
      normal: 'normal',
      none: 1,
      shorter: 1.25,
      short: 1.375,
      base: 1.5,
      tall: 1.625,
      taller: 2
    },

    letterSpacings: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    },

    // Spacing
    space: spacingTokens,

    // Sizes (based on spacing)
    sizes: {
      ...spacingTokens,
      max: 'max-content',
      min: 'min-content',
      full: '100%',
      '3xs': '14rem',
      '2xs': '16rem',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      '8xl': '90rem',
      container: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px'
      }
    },

    // Breakpoints
    breakpoints: {
      base: '0em',
      sm: '30em', // 480px
      md: '48em', // 768px
      lg: '62em', // 992px
      xl: '80em', // 1280px
      '2xl': '96em' // 1536px
    },

    // Shadows
    shadows: {
      ...shadowTokens,
      // Component-specific shadows
      card: componentShadows.card.resting,
      cardHover: componentShadows.card.hover,
      button: componentShadows.button.resting,
      buttonHover: componentShadows.button.hover
    },

    // Border radius
    radii: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px'
    },

    // Z-index scale
    zIndex: {
      hide: -1,
      auto: 'auto',
      base: 0,
      docked: 10,
      dropdown: 1000,
      sticky: 1100,
      banner: 1200,
      overlay: 1300,
      modal: 1400,
      popover: 1500,
      skipLink: 1600,
      toast: 1700,
      tooltip: 1800
    }
  },

  // Semantic tokens for light/dark mode
  semanticTokens: {
    colors: {
      // Background colors
      'bg.canvas': {
        base: lightThemeColors.background.primary,
        _dark: darkThemeColors.background.primary
      },
      'bg.default': {
        base: lightThemeColors.surface.primary,
        _dark: darkThemeColors.surface.primary
      },
      'bg.subtle': {
        base: lightThemeColors.background.secondary,
        _dark: darkThemeColors.background.secondary
      },
      'bg.muted': {
        base: lightThemeColors.background.tertiary,
        _dark: darkThemeColors.background.tertiary
      },

      // Text colors
      'fg.default': {
        base: lightThemeColors.text.primary,
        _dark: darkThemeColors.text.primary
      },
      'fg.muted': {
        base: lightThemeColors.text.secondary,
        _dark: darkThemeColors.text.secondary
      },
      'fg.subtle': {
        base: lightThemeColors.text.tertiary,
        _dark: darkThemeColors.text.tertiary
      },

      // Border colors
      'border.default': {
        base: lightThemeColors.border.primary,
        _dark: darkThemeColors.border.primary
      },
      'border.muted': {
        base: lightThemeColors.border.secondary,
        _dark: darkThemeColors.border.secondary
      },

      // Brand colors (consistent across themes)
      'brand.default': colorTokens.brand[500],
      'brand.emphasis': colorTokens.brand[600],
      'brand.subtle': {
        base: colorTokens.brand[100],
        _dark: colorTokens.brand[900]
      }
    },

    shadows: {
      'shadow.default': {
        base: shadowTokens.sm,
        _dark: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)'
      },
      'shadow.medium': {
        base: shadowTokens.md,
        _dark: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)'
      }
    }
  }
});

// Export type for theme
export type DreamPlaceTheme = typeof dreamPlaceTheme;

// Export theme configuration for external use
export const themeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
  cssVarPrefix: 'dreamplace'
} as const;