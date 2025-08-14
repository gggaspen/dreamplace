// Core factory pattern exports
export { BaseComponentFactory } from './BaseComponentFactory';
export { ComponentFactoryRegistry } from './ComponentFactoryRegistry';

// Types and interfaces
export type {
  IComponentFactory,
  IComponentFactoryRegistry,
  ComponentConfig,
  CreationContext,
  ComponentMetadata,
  FactoryMetadata,
} from './types';

export { ComponentType, FactoryType } from './types';

// Concrete factory implementations
export * from './factories';

// Re-export everything for convenience
export * from './types';
