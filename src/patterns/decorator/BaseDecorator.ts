import { ComponentType } from 'react';
import {
  ComponentDecorator,
  DecoratorConfig,
  DecoratorMetadata,
  DecoratorCondition,
} from './types';

/**
 * Base implementation of the ComponentDecorator interface
 * Provides common functionality for all component decorators
 */
export abstract class BaseDecorator<P = any> implements ComponentDecorator<P> {
  public readonly name: string;
  public readonly description: string;
  public readonly order: number;
  protected metadata: DecoratorMetadata;
  protected applicationCount: number = 0;

  constructor(metadata: DecoratorMetadata, order: number = 100) {
    this.name = metadata.name;
    this.description = metadata.description;
    this.order = order;
    this.metadata = metadata;
  }

  abstract canDecorate(component: ComponentType<P>, props?: P): boolean;
  abstract decorate(component: ComponentType<P>, config?: DecoratorConfig): ComponentType<P>;

  getMetadata(): DecoratorMetadata {
    return { ...this.metadata };
  }

  protected validateConfig(config?: DecoratorConfig): boolean {
    if (!config) return true;

    // Check conditions if provided
    if (config.conditions) {
      // Conditions will be evaluated at runtime, so we just validate structure here
      return config.conditions.every(
        condition =>
          typeof condition.check === 'function' &&
          ['prop', 'context', 'environment', 'custom'].includes(condition.type)
      );
    }

    return true;
  }

  protected shouldApplyDecorator(props: P, config?: DecoratorConfig): boolean {
    if (!config?.enabled) return false;

    // Check conditions
    if (config.conditions) {
      return config.conditions.every(condition => {
        try {
          return condition.check(props);
        } catch (error) {
          this.log('warn', `Condition check failed for ${condition.type}:`, error);
          return false;
        }
      });
    }

    return true;
  }

  protected createHOC<T extends ComponentType<P>>(
    WrappedComponent: T,
    enhancer: (props: P) => P | { props: P; additionalProps?: any },
    displayName?: string
  ): ComponentType<P> {
    const HOC = (props: P) => {
      try {
        const enhanced = enhancer(props);
        const finalProps = 'props' in enhanced ? enhanced.props : enhanced;
        const additionalProps = 'props' in enhanced ? enhanced.additionalProps : {};

        return React.createElement(WrappedComponent, { ...finalProps, ...additionalProps });
      } catch (error) {
        this.log('error', `Error in decorator ${this.name}:`, error);
        // Fallback to original component
        return React.createElement(WrappedComponent, props);
      }
    };

    HOC.displayName =
      displayName ||
      `${this.name}(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    (HOC as any).WrappedComponent = WrappedComponent;
    (HOC as any).decoratorName = this.name;

    return HOC;
  }

  protected wrapWithProvider<T extends ComponentType<P>>(
    WrappedComponent: T,
    Provider: ComponentType<any>,
    providerProps: any,
    displayName?: string
  ): ComponentType<P> {
    const HOC = (props: P) => {
      return React.createElement(
        Provider,
        providerProps,
        React.createElement(WrappedComponent, props)
      );
    };

    HOC.displayName =
      displayName ||
      `${this.name}Provider(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;
    (HOC as any).WrappedComponent = WrappedComponent;
    (HOC as any).decoratorName = this.name;

    return HOC;
  }

  protected generateCacheKey(props: P, additionalKeys: string[] = []): string {
    try {
      const propsString = JSON.stringify(props);
      const additionalString = additionalKeys.join(':');
      return `${this.name}:${this.simpleHash(propsString)}:${additionalString}`;
    } catch {
      return `${this.name}:${Date.now()}:${Math.random()}`;
    }
  }

  protected simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  protected isValidComponent(component: ComponentType<P>): boolean {
    return typeof component === 'function' || (typeof component === 'object' && component !== null);
  }

  protected hasRequiredProps(props: P): boolean {
    if (!this.metadata.requiresProps || this.metadata.requiresProps.length === 0) {
      return true;
    }

    return this.metadata.requiresProps.every(
      propName => props && typeof props === 'object' && propName in props
    );
  }

  protected checkDependencies(): boolean {
    if (!this.metadata.dependencies || this.metadata.dependencies.length === 0) {
      return true;
    }

    // In a real implementation, this would check if required packages are available
    return this.metadata.dependencies.every(dep => {
      try {
        // This is a simplified check - in reality you'd check actual package availability
        return typeof dep === 'string' && dep.length > 0;
      } catch {
        return false;
      }
    });
  }

  protected log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console[level](`[${this.name}Decorator] ${message}`, data || '');
    }
  }

  // Statistics and monitoring
  protected incrementApplicationCount(): void {
    this.applicationCount++;
  }

  getApplicationCount(): number {
    return this.applicationCount;
  }

  getStatistics(): {
    name: string;
    applicationCount: number;
    order: number;
    dependencies: string[];
    conflictsWith: string[];
  } {
    return {
      name: this.name,
      applicationCount: this.applicationCount,
      order: this.order,
      dependencies: this.metadata.dependencies || [],
      conflictsWith: this.metadata.conflictsWith || [],
    };
  }
}

// Import React after the class definition to avoid circular dependency issues
import React from 'react';
