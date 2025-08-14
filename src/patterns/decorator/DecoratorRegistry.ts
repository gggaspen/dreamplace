import { ComponentType } from 'react';
import { IDecoratorRegistry, ComponentDecorator, DecoratorConfig } from './types';

/**
 * Decorator Registry - manages and applies component decorators
 */
export class DecoratorRegistry implements IDecoratorRegistry {
  private decorators: Map<string, ComponentDecorator> = new Map();
  private applicationHistory: Array<{
    decoratorName: string;
    componentName: string;
    timestamp: Date;
    success: boolean;
  }> = [];

  register(decorator: ComponentDecorator): void {
    this.decorators.set(decorator.name, decorator);
    this.log(`Decorator '${decorator.name}' registered with order ${decorator.order}`);
  }

  unregister(decoratorName: string): boolean {
    const removed = this.decorators.delete(decoratorName);
    if (removed) {
      this.log(`Decorator '${decoratorName}' unregistered`);
    }
    return removed;
  }

  getDecorator(name: string): ComponentDecorator | null {
    return this.decorators.get(name) || null;
  }

  getAllDecorators(): ComponentDecorator[] {
    return Array.from(this.decorators.values()).sort((a, b) => a.order - b.order);
  }

  canDecorate<P>(component: ComponentType<P>, decoratorName: string): boolean {
    const decorator = this.decorators.get(decoratorName);
    if (!decorator) {
      return false;
    }

    return decorator.canDecorate(component);
  }

  decorateComponent<P>(
    component: ComponentType<P>,
    decoratorNames?: string[],
    config?: Record<string, DecoratorConfig>
  ): ComponentType<P> {
    if (!component) {
      throw new Error('Component is required for decoration');
    }

    // Get decorators to apply
    const decoratorsToApply = this.getDecoratorsToApply(decoratorNames);

    // Validate decorators can be applied
    this.validateDecorators(component, decoratorsToApply);

    // Apply decorators in order
    let decoratedComponent = component;
    const appliedDecorators: string[] = [];

    for (const decorator of decoratorsToApply) {
      try {
        const decoratorConfig = config?.[decorator.name];

        if (decorator.canDecorate(decoratedComponent)) {
          decoratedComponent = decorator.decorate(decoratedComponent, decoratorConfig);
          appliedDecorators.push(decorator.name);

          this.recordApplication(decorator.name, component.name || 'Anonymous', true);
          this.log(
            `Applied decorator '${decorator.name}' to component '${component.name || 'Anonymous'}'`
          );
        } else {
          this.log(`Skipped decorator '${decorator.name}' - cannot decorate component`);
        }
      } catch (error) {
        this.recordApplication(decorator.name, component.name || 'Anonymous', false);
        this.log(`Failed to apply decorator '${decorator.name}':`, error);

        // Continue with other decorators unless it's a critical failure
        if (this.isCriticalError(error)) {
          throw error;
        }
      }
    }

    // Add metadata to the decorated component
    this.addDecoratorMetadata(decoratedComponent, appliedDecorators);

    return decoratedComponent;
  }

  // Convenience method for applying a single decorator
  applySingleDecorator<P>(
    component: ComponentType<P>,
    decoratorName: string,
    config?: DecoratorConfig
  ): ComponentType<P> {
    return this.decorateComponent(component, [decoratorName], {
      [decoratorName]: config || { enabled: true },
    });
  }

  // Method to compose multiple decorators into a single HOC
  composeDecorators<P>(
    decoratorNames: string[],
    config?: Record<string, DecoratorConfig>
  ): (component: ComponentType<P>) => ComponentType<P> {
    return (component: ComponentType<P>) => {
      return this.decorateComponent(component, decoratorNames, config);
    };
  }

  // Batch decoration of multiple components
  decorateComponents<P>(
    components: Array<{
      component: ComponentType<P>;
      decorators?: string[];
      config?: Record<string, DecoratorConfig>;
    }>,
    globalConfig?: Record<string, DecoratorConfig>
  ): Array<ComponentType<P>> {
    return components.map(({ component, decorators, config }) => {
      const mergedConfig = { ...globalConfig, ...config };
      return this.decorateComponent(component, decorators, mergedConfig);
    });
  }

  private getDecoratorsToApply(decoratorNames?: string[]): ComponentDecorator[] {
    if (decoratorNames) {
      // Apply specific decorators in the order they were requested
      return decoratorNames
        .map(name => this.decorators.get(name))
        .filter((decorator): decorator is ComponentDecorator => decorator !== undefined);
    } else {
      // Apply all decorators in their natural order
      return this.getAllDecorators();
    }
  }

  private validateDecorators<P>(
    component: ComponentType<P>,
    decorators: ComponentDecorator[]
  ): void {
    // Check for conflicts
    const conflicts = this.findConflicts(decorators);
    if (conflicts.length > 0) {
      throw new Error(`Decorator conflicts detected: ${conflicts.join(', ')}`);
    }

    // Check dependencies
    const missingDependencies = this.findMissingDependencies(decorators);
    if (missingDependencies.length > 0) {
      throw new Error(`Missing decorator dependencies: ${missingDependencies.join(', ')}`);
    }
  }

  private findConflicts(decorators: ComponentDecorator[]): string[] {
    const conflicts: string[] = [];
    const decoratorNames = decorators.map(d => d.name);

    for (const decorator of decorators) {
      const metadata = decorator.getMetadata();
      if (metadata.conflictsWith) {
        const foundConflicts = metadata.conflictsWith.filter(conflict =>
          decoratorNames.includes(conflict)
        );
        conflicts.push(
          ...foundConflicts.map(conflict => `${decorator.name} conflicts with ${conflict}`)
        );
      }
    }

    return conflicts;
  }

  private findMissingDependencies(decorators: ComponentDecorator[]): string[] {
    const missing: string[] = [];
    const decoratorNames = decorators.map(d => d.name);

    for (const decorator of decorators) {
      const metadata = decorator.getMetadata();
      if (metadata.dependencies) {
        const missingDeps = metadata.dependencies.filter(dep => !decoratorNames.includes(dep));
        missing.push(...missingDeps.map(dep => `${decorator.name} requires ${dep}`));
      }
    }

    return missing;
  }

  private isCriticalError(error: unknown): boolean {
    if (error instanceof Error) {
      // Define critical error patterns
      const criticalPatterns = [/circular dependency/i, /maximum call stack/i, /out of memory/i];

      return criticalPatterns.some(pattern => pattern.test(error.message));
    }

    return false;
  }

  private addDecoratorMetadata<P>(component: ComponentType<P>, appliedDecorators: string[]): void {
    // Add metadata to help with debugging and tooling
    (component as any).__decorators = appliedDecorators;
    (component as any).__decoratorRegistry = this;
  }

  private recordApplication(decoratorName: string, componentName: string, success: boolean): void {
    this.applicationHistory.push({
      decoratorName,
      componentName,
      timestamp: new Date(),
      success,
    });

    // Keep history manageable
    if (this.applicationHistory.length > 1000) {
      this.applicationHistory = this.applicationHistory.slice(-500);
    }
  }

  // Registry statistics and monitoring
  getRegistryStatistics(): {
    decoratorCount: number;
    totalApplications: number;
    successRate: number;
    decorators: Array<{
      name: string;
      order: number;
      applicationCount: number;
    }>;
    applicationsByDecorator: Record<string, number>;
    recentFailures: Array<{
      decoratorName: string;
      componentName: string;
      timestamp: Date;
    }>;
  } {
    const totalApplications = this.applicationHistory.length;
    const successfulApplications = this.applicationHistory.filter(h => h.success).length;
    const successRate = totalApplications > 0 ? successfulApplications / totalApplications : 0;

    const applicationsByDecorator = this.applicationHistory.reduce(
      (acc, history) => {
        if (history.success) {
          acc[history.decoratorName] = (acc[history.decoratorName] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    const recentFailures = this.applicationHistory
      .filter(h => !h.success)
      .slice(-10)
      .map(({ decoratorName, componentName, timestamp }) => ({
        decoratorName,
        componentName,
        timestamp,
      }));

    return {
      decoratorCount: this.decorators.size,
      totalApplications,
      successRate,
      decorators: Array.from(this.decorators.values()).map(decorator => ({
        name: decorator.name,
        order: decorator.order,
        applicationCount: applicationsByDecorator[decorator.name] || 0,
      })),
      applicationsByDecorator,
      recentFailures,
    };
  }

  // Debug utilities
  listDecorators(): Array<{ name: string; description: string; order: number }> {
    return Array.from(this.decorators.values())
      .sort((a, b) => a.order - b.order)
      .map(decorator => ({
        name: decorator.name,
        description: decorator.description,
        order: decorator.order,
      }));
  }

  getDecoratorDependencies(decoratorName: string): string[] {
    const decorator = this.decorators.get(decoratorName);
    return decorator?.getMetadata().dependencies || [];
  }

  getDecoratorConflicts(decoratorName: string): string[] {
    const decorator = this.decorators.get(decoratorName);
    return decorator?.getMetadata().conflictsWith || [];
  }

  // Clear application history
  clearHistory(): void {
    this.applicationHistory = [];
  }

  private log(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[DecoratorRegistry] ${message}`, data || '');
    }
  }
}
