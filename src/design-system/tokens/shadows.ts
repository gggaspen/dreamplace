/**
 * Shadow Design Tokens for DreamPlace
 *
 * Elevation system with consistent shadows for depth and hierarchy.
 * Optimized for both light and dark themes.
 */

// Base shadow definitions
export const shadowTokens = {
  // Subtle shadows for light depth
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',

  // Standard shadows for cards and components
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',

  // Prominent shadows for modals and floating elements
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // Special shadows
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
} as const;

// Dark theme shadows (more pronounced for better contrast)
export const darkShadowTokens = {
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.4), 0 1px 2px -1px rgb(0 0 0 / 0.4)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.4), 0 4px 6px -4px rgb(0 0 0 / 0.4)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.4), 0 8px 10px -6px rgb(0 0 0 / 0.4)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.6)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.2)',
  none: '0 0 #0000',
} as const;

// Colored shadows for brand elements
export const coloredShadows = {
  brand: {
    sm: '0 1px 3px 0 rgb(132 61 255 / 0.2), 0 1px 2px -1px rgb(132 61 255 / 0.2)',
    md: '0 4px 6px -1px rgb(132 61 255 / 0.25), 0 2px 4px -2px rgb(132 61 255 / 0.25)',
    lg: '0 10px 15px -3px rgb(132 61 255 / 0.3), 0 4px 6px -4px rgb(132 61 255 / 0.3)',
    xl: '0 20px 25px -5px rgb(132 61 255 / 0.4), 0 8px 10px -6px rgb(132 61 255 / 0.4)',
  },
  secondary: {
    sm: '0 1px 3px 0 rgb(0 169 221 / 0.2), 0 1px 2px -1px rgb(0 169 221 / 0.2)',
    md: '0 4px 6px -1px rgb(0 169 221 / 0.25), 0 2px 4px -2px rgb(0 169 221 / 0.25)',
    lg: '0 10px 15px -3px rgb(0 169 221 / 0.3), 0 4px 6px -4px rgb(0 169 221 / 0.3)',
    xl: '0 20px 25px -5px rgb(0 169 221 / 0.4), 0 8px 10px -6px rgb(0 169 221 / 0.4)',
  },
} as const;

// Semantic shadows for different component types
export const componentShadows = {
  // Cards and content blocks
  card: {
    resting: shadowTokens.sm,
    hover: shadowTokens.md,
    pressed: shadowTokens.xs,
  },

  // Navigation and header elements
  navigation: {
    header: shadowTokens.sm,
    dropdown: shadowTokens.lg,
  },

  // Interactive elements
  button: {
    resting: shadowTokens.xs,
    hover: shadowTokens.sm,
    pressed: shadowTokens.inner,
    focus: coloredShadows.brand.sm,
  },

  // Form elements
  form: {
    field: shadowTokens.xs,
    fieldFocus: coloredShadows.brand.sm,
    fieldError: '0 1px 3px 0 rgb(239 68 68 / 0.2), 0 1px 2px -1px rgb(239 68 68 / 0.2)',
  },

  // Modal and overlay elements
  overlay: {
    modal: shadowTokens['2xl'],
    popover: shadowTokens.lg,
    tooltip: shadowTokens.md,
  },

  // Images and media
  image: {
    default: shadowTokens.sm,
    hover: shadowTokens.md,
    featured: shadowTokens.lg,
  },
} as const;

// Glow effects for special elements (like event cards, artist features)
export const glowEffects = {
  brand: {
    subtle: '0 0 20px rgb(132 61 255 / 0.1)',
    medium: '0 0 40px rgb(132 61 255 / 0.2)',
    strong: '0 0 60px rgb(132 61 255 / 0.3)',
  },
  secondary: {
    subtle: '0 0 20px rgb(0 169 221 / 0.1)',
    medium: '0 0 40px rgb(0 169 221 / 0.2)',
    strong: '0 0 60px rgb(0 169 221 / 0.3)',
  },
  music: {
    techno: '0 0 30px rgb(255 0 128 / 0.3)',
    house: '0 0 30px rgb(0 255 128 / 0.3)',
    trance: '0 0 30px rgb(128 0 255 / 0.3)',
  },
} as const;

// Animation-ready shadow transitions
export const shadowTransitions = {
  fast: 'box-shadow 150ms ease',
  medium: 'box-shadow 250ms ease',
  slow: 'box-shadow 350ms ease',
} as const;

// Export types
export type ShadowToken = keyof typeof shadowTokens;
export type ColoredShadowVariant = keyof typeof coloredShadows.brand;
export type ComponentShadowType = keyof typeof componentShadows;
