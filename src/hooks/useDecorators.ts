import { useRef, useEffect, useCallback } from 'react';
import { ComponentType } from 'react';
import { 
  DecoratorRegistry,
  ComponentDecorator,
  DecoratorConfig,
  AnalyticsDecorator,
  ErrorBoundaryDecorator,
  PerformanceDecorator
} from '@/patterns/decorator';

/**
 * React hook for component decoration using the Decorator pattern
 * Provides easy access to component enhancement functionality
 */
export function useDecorators() {
  const registryRef = useRef<DecoratorRegistry>();

  // Initialize decorator registry and default decorators
  useEffect(() => {
    if (!registryRef.current) {
      registryRef.current = new DecoratorRegistry();
      
      // Register default decorators
      setupDefaultDecorators();
    }
  }, []);

  const setupDefaultDecorators = useCallback(() => {
    if (!registryRef.current) return;

    // Register analytics decorator
    registryRef.current.register(new AnalyticsDecorator());
    
    // Register error boundary decorator
    registryRef.current.register(new ErrorBoundaryDecorator());
    
    // Register performance decorator
    registryRef.current.register(new PerformanceDecorator());
  }, []);

  // Decorate a single component
  const decorateComponent = useCallback(<P>(
    component: ComponentType<P>,
    decoratorNames?: string[],
    config?: Record<string, DecoratorConfig>
  ): ComponentType<P> => {
    if (!registryRef.current) {
      throw new Error('Decorator registry not initialized');
    }

    return registryRef.current.decorateComponent(component, decoratorNames, config);
  }, []);

  // Apply a single decorator
  const applySingleDecorator = useCallback(<P>(
    component: ComponentType<P>,
    decoratorName: string,
    config?: DecoratorConfig
  ): ComponentType<P> => {
    if (!registryRef.current) {
      throw new Error('Decorator registry not initialized');
    }

    return registryRef.current.applySingleDecorator(component, decoratorName, config);
  }, []);

  // Compose multiple decorators into a single HOC
  const composeDecorators = useCallback(<P>(
    decoratorNames: string[],
    config?: Record<string, DecoratorConfig>
  ) => {
    if (!registryRef.current) {
      throw new Error('Decorator registry not initialized');
    }

    return registryRef.current.composeDecorators<P>(decoratorNames, config);
  }, []);

  // Batch decorate multiple components
  const decorateComponents = useCallback(<P>(
    components: Array<{
      component: ComponentType<P>;
      decorators?: string[];
      config?: Record<string, DecoratorConfig>;
    }>,
    globalConfig?: Record<string, DecoratorConfig>
  ): Array<ComponentType<P>> => {
    if (!registryRef.current) {
      throw new Error('Decorator registry not initialized');
    }

    return registryRef.current.decorateComponents(components, globalConfig);
  }, []);

  // Register a custom decorator
  const registerDecorator = useCallback((decorator: ComponentDecorator) => {
    registryRef.current?.register(decorator);
  }, []);

  // Unregister a decorator
  const unregisterDecorator = useCallback((decoratorName: string): boolean => {
    return registryRef.current?.unregister(decoratorName) ?? false;
  }, []);

  // Get a specific decorator
  const getDecorator = useCallback((name: string): ComponentDecorator | null => {
    return registryRef.current?.getDecorator(name) ?? null;
  }, []);

  // Get all available decorators
  const getAllDecorators = useCallback((): ComponentDecorator[] => {
    return registryRef.current?.getAllDecorators() ?? [];
  }, []);

  // Check if a decorator can be applied to a component
  const canDecorate = useCallback(<P>(
    component: ComponentType<P>,
    decoratorName: string
  ): boolean => {
    return registryRef.current?.canDecorate(component, decoratorName) ?? false;
  }, []);

  // Get registry statistics
  const getStatistics = useCallback(() => {
    return registryRef.current?.getRegistryStatistics();
  }, []);

  // List available decorators
  const listDecorators = useCallback(() => {
    return registryRef.current?.listDecorators() ?? [];
  }, []);

  // Convenience methods for common decorators
  const withAnalytics = useCallback(<P>(
    component: ComponentType<P>,
    config?: {
      trackClicks?: boolean;
      trackViews?: boolean;
      trackScroll?: boolean;
      userId?: string;
      sessionId?: string;
    }
  ) => {
    return applySingleDecorator(component, 'analytics', {
      enabled: true,
      options: config,
    });
  }, [applySingleDecorator]);

  const withErrorBoundary = useCallback(<P>(
    component: ComponentType<P>,
    config?: {
      fallbackComponent?: ComponentType<any>;
      onError?: (error: Error, errorInfo: any) => void;
      resetOnPropsChange?: boolean;
      resetKeys?: string[];
    }
  ) => {
    return applySingleDecorator(component, 'errorBoundary', {
      enabled: true,
      options: config,
    });
  }, [applySingleDecorator]);

  const withPerformanceMonitoring = useCallback(<P>(
    component: ComponentType<P>,
    config?: {
      measureRender?: boolean;
      measureInteraction?: boolean;
      threshold?: number;
      reportToService?: boolean;
    }
  ) => {
    return applySingleDecorator(component, 'performance', {
      enabled: true,
      options: config,
    });
  }, [applySingleDecorator]);

  // Create a decorator chain builder
  const createChain = useCallback(() => {
    const chain: {
      decorators: Array<{ name: string; config?: DecoratorConfig }>;
      add: (name: string, config?: DecoratorConfig) => typeof chain;
      remove: (name: string) => typeof chain;
      apply: <P>(component: ComponentType<P>) => ComponentType<P>;
    } = {
      decorators: [],
      
      add(name: string, config?: DecoratorConfig) {
        this.decorators.push({ name, config });
        return this;
      },
      
      remove(name: string) {
        this.decorators = this.decorators.filter(d => d.name !== name);
        return this;
      },
      
      apply<P>(component: ComponentType<P>): ComponentType<P> {
        const decoratorNames = this.decorators.map(d => d.name);
        const config = this.decorators.reduce((acc, d) => {
          if (d.config) {
            acc[d.name] = d.config;
          }
          return acc;
        }, {} as Record<string, DecoratorConfig>);
        
        return decorateComponent(component, decoratorNames, config);
      },
    };

    return chain;
  }, [decorateComponent]);

  // Preset decorator combinations
  const presets = {
    // Full monitoring preset
    monitoring: useCallback(<P>(component: ComponentType<P>) => {
      return decorateComponent(component, ['errorBoundary', 'performance', 'analytics'], {
        errorBoundary: { enabled: true },
        performance: { enabled: true, options: { measureRender: true, measureInteraction: true } },
        analytics: { enabled: true, options: { trackClicks: true, trackViews: true } },
      });
    }, [decorateComponent]),

    // Safe preset (error handling only)
    safe: useCallback(<P>(component: ComponentType<P>) => {
      return decorateComponent(component, ['errorBoundary'], {
        errorBoundary: { enabled: true },
      });
    }, [decorateComponent]),

    // Analytics only preset
    analytics: useCallback(<P>(component: ComponentType<P>) => {
      return decorateComponent(component, ['analytics'], {
        analytics: { 
          enabled: true, 
          options: { trackClicks: true, trackViews: true, trackScroll: true } 
        },
      });
    }, [decorateComponent]),
  };

  return {
    // Core decoration methods
    decorateComponent,
    applySingleDecorator,
    composeDecorators,
    decorateComponents,
    
    // Registry management
    registerDecorator,
    unregisterDecorator,
    getDecorator,
    getAllDecorators,
    canDecorate,
    
    // Utilities
    getStatistics,
    listDecorators,
    createChain,
    
    // Convenience methods
    withAnalytics,
    withErrorBoundary,
    withPerformanceMonitoring,
    
    // Presets
    presets,
  };
}