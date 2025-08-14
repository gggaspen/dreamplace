import { useRef, useEffect, useCallback } from 'react';
import { ReactElement } from 'react';
import {
  ComponentFactoryRegistry,
  IComponentFactory,
  ComponentConfig,
  CreationContext,
  UIComponentFactory,
  LayoutComponentFactory,
} from '@/patterns/factory';

/**
 * React hook for component creation using the Factory pattern
 * Provides dynamic component creation with context awareness
 */
export function useComponentFactory() {
  const registryRef = useRef<ComponentFactoryRegistry>();

  // Initialize factory registry and default factories
  useEffect(() => {
    if (!registryRef.current) {
      registryRef.current = new ComponentFactoryRegistry();

      // Register default factories
      setupDefaultFactories();
    }
  }, []);

  const setupDefaultFactories = useCallback(() => {
    if (!registryRef.current) return;

    // Register UI component factory
    registryRef.current.register(new UIComponentFactory());

    // Register layout component factory
    registryRef.current.register(new LayoutComponentFactory());
  }, []);

  // Create a single component
  const createComponent = useCallback(
    async (config: ComponentConfig, context?: CreationContext): Promise<ReactElement> => {
      if (!registryRef.current) {
        throw new Error('Component factory registry not initialized');
      }

      return registryRef.current.create(config, context);
    },
    []
  );

  // Create multiple components in batch
  const createComponents = useCallback(
    async (configs: ComponentConfig[], context?: CreationContext): Promise<ReactElement[]> => {
      if (!registryRef.current) {
        throw new Error('Component factory registry not initialized');
      }

      return registryRef.current.createBatch(configs, context);
    },
    []
  );

  // Create component with fallback
  const createWithFallback = useCallback(
    async (
      config: ComponentConfig,
      fallbackConfig: ComponentConfig,
      context?: CreationContext
    ): Promise<ReactElement> => {
      if (!registryRef.current) {
        throw new Error('Component factory registry not initialized');
      }

      return registryRef.current.createWithFallback(config, fallbackConfig, context);
    },
    []
  );

  // Check if a component type can be created
  const canCreate = useCallback((type: string): boolean => {
    return registryRef.current?.canCreate(type) ?? false;
  }, []);

  // Register a custom factory
  const registerFactory = useCallback((factory: IComponentFactory) => {
    registryRef.current?.register(factory);
  }, []);

  // Unregister a factory
  const unregisterFactory = useCallback((factoryName: string): boolean => {
    return registryRef.current?.unregister(factoryName) ?? false;
  }, []);

  // Get factory for a specific type
  const getFactory = useCallback((type: string): IComponentFactory | null => {
    return registryRef.current?.getFactory(type) ?? null;
  }, []);

  // Get all available factories
  const getAllFactories = useCallback((): IComponentFactory[] => {
    return registryRef.current?.getAllFactories() ?? [];
  }, []);

  // Get supported component types
  const getSupportedTypes = useCallback((): string[] => {
    return registryRef.current?.listSupportedTypes() ?? [];
  }, []);

  // Get registry statistics
  const getStatistics = useCallback(() => {
    return registryRef.current?.getRegistryStatistics();
  }, []);

  // Create context from current environment
  const createContext = useCallback((): CreationContext => {
    if (typeof window === 'undefined') {
      return {
        environment: { mode: 'production', features: [] },
      };
    }

    const context: CreationContext = {
      device: {
        type: getDeviceType(),
        capabilities: getDeviceCapabilities(),
      },
      user: {
        accessibility: {
          level: 'basic',
          reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
          highContrast: window.matchMedia('(prefers-contrast: high)').matches,
          screenReader: detectScreenReader(),
        },
      },
      environment: {
        mode: process.env.NODE_ENV as 'development' | 'production' | 'test',
        features: getAvailableFeatures(),
      },
    };

    return context;
  }, []);

  // Convenience methods for common component creation
  const createButton = useCallback(
    async (props: Record<string, unknown>) => {
      const config: ComponentConfig = {
        type: 'button',
        props,
      };
      return createComponent(config, createContext());
    },
    [createComponent, createContext]
  );

  const createCard = useCallback(
    async (props: Record<string, unknown>) => {
      const config: ComponentConfig = {
        type: 'card',
        props,
      };
      return createComponent(config, createContext());
    },
    [createComponent, createContext]
  );

  const createGrid = useCallback(
    async (props: Record<string, unknown>) => {
      const config: ComponentConfig = {
        type: 'grid',
        props,
      };
      return createComponent(config, createContext());
    },
    [createComponent, createContext]
  );

  const createInput = useCallback(
    async (props: Record<string, unknown>) => {
      const config: ComponentConfig = {
        type: 'input',
        props,
      };
      return createComponent(config, createContext());
    },
    [createComponent, createContext]
  );

  return {
    // Core creation methods
    createComponent,
    createComponents,
    createWithFallback,

    // Factory management
    registerFactory,
    unregisterFactory,
    getFactory,
    getAllFactories,

    // Utilities
    canCreate,
    getSupportedTypes,
    getStatistics,
    createContext,

    // Convenience methods
    createButton,
    createCard,
    createGrid,
    createInput,
  };
}

// Helper functions
function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getDeviceCapabilities() {
  if (typeof window === 'undefined') {
    return {
      touch: false,
      webGL: false,
      serviceWorker: false,
      intersectionObserver: false,
      resizeObserver: false,
    };
  }

  return {
    touch: 'ontouchstart' in window,
    webGL: detectWebGL(),
    serviceWorker: 'serviceWorker' in navigator,
    intersectionObserver: 'IntersectionObserver' in window,
    resizeObserver: 'ResizeObserver' in window,
  };
}

function detectWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

function detectScreenReader(): boolean {
  if (typeof window === 'undefined') return false;

  // Simple heuristics for screen reader detection
  return (
    window.speechSynthesis !== undefined &&
    (window.navigator.userAgent.includes('NVDA') ||
      window.navigator.userAgent.includes('JAWS') ||
      window.navigator.userAgent.includes('VoiceOver'))
  );
}

function getAvailableFeatures(): string[] {
  if (typeof window === 'undefined') return [];

  const features: string[] = [];

  if ('serviceWorker' in navigator) features.push('service-worker');
  if ('IntersectionObserver' in window) features.push('intersection-observer');
  if ('ResizeObserver' in window) features.push('resize-observer');
  if ('requestIdleCallback' in window) features.push('idle-callback');
  if ('PerformanceObserver' in window) features.push('performance-observer');
  if (detectWebGL()) features.push('webgl');

  return features;
}
