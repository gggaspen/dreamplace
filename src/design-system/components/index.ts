/**
 * DreamPlace Design System Components
 *
 * Comprehensive component library following atomic design principles.
 * Organized from simple atoms to complex organisms and templates.
 */

// Re-export all atoms
export * from './atoms';

// Re-export all molecules
export * from './molecules';

// Component organization metadata
export const componentLibrary = {
  atoms: ['Button', 'Typography', 'Card'],
  molecules: ['EventCard', 'ArtistCard'],
  organisms: [], // To be implemented
  templates: [], // To be implemented
} as const;
