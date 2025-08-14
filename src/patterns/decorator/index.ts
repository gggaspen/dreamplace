// Core decorator pattern exports
export { BaseDecorator } from './BaseDecorator';
export { DecoratorRegistry } from './DecoratorRegistry';

// Types and interfaces
export type {
  ComponentDecorator,
  IDecoratorRegistry,
  DecoratorConfig,
  DecoratorMetadata,
  AnalyticsDecoratorConfig,
  PerformanceDecoratorConfig,
  ErrorBoundaryDecoratorConfig,
  AuthDecoratorConfig,
  LoadingDecoratorConfig,
  CacheDecoratorConfig,
} from './types';

export { DecoratorType } from './types';

// Concrete decorator implementations
export * from './decorators';

// Re-export everything for convenience
export * from './types';
