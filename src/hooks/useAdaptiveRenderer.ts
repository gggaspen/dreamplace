import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  RenderingEngine, 
  IRenderStrategy,
  RenderData, 
  RenderContext, 
  RenderResult,
  PerformanceRenderStrategy,
  AccessibleRenderStrategy,
  QualityRenderStrategy
} from '@/patterns/strategy';

/**
 * React hook for adaptive rendering using the Strategy pattern
 * Automatically selects the best rendering strategy based on context
 */
export function useAdaptiveRenderer() {
  const engineRef = useRef<RenderingEngine>();
  const [context, setContext] = useState<RenderContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize rendering engine and strategies
  useEffect(() => {
    if (!engineRef.current) {
      engineRef.current = new RenderingEngine();
      
      // Register default strategies
      setupDefaultStrategies();
      
      // Initialize context
      updateContext();
      
      setIsInitialized(true);
    }

    // Update context on viewport changes
    const handleResize = () => updateContext();
    const handleVisibilityChange = () => updateContext();
    
    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const setupDefaultStrategies = useCallback(() => {
    if (!engineRef.current) return;

    // Add performance strategy
    engineRef.current.addStrategy(new PerformanceRenderStrategy());
    
    // Add accessibility strategy
    engineRef.current.addStrategy(new AccessibleRenderStrategy());
    
    // Add quality strategy
    engineRef.current.addStrategy(new QualityRenderStrategy());
  }, []);

  const updateContext = useCallback(() => {
    if (typeof window === 'undefined') return;

    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      deviceType: getDeviceType(window.innerWidth),
    };

    const performance = {
      deviceClass: getDeviceClass(),
      connectionSpeed: getConnectionSpeed(),
    };

    const user = {
      accessibility: {
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highContrast: window.matchMedia('(prefers-contrast: high)').matches,
        screenReader: detectScreenReader(),
      },
    };

    const features = {
      webGL: detectWebGL(),
      intersectionObserver: 'IntersectionObserver' in window,
      performanceObserver: 'PerformanceObserver' in window,
    };

    setContext({
      viewport,
      performance,
      user,
      features,
    });
  }, []);

  // Render content using the best strategy
  const render = useCallback(async (data: RenderData): Promise<RenderResult> => {
    if (!engineRef.current || !context) {
      throw new Error('Renderer not initialized');
    }

    return engineRef.current.render(data, context);
  }, [context]);

  // Get the best strategy for given data
  const getBestStrategy = useCallback((data: RenderData): IRenderStrategy | null => {
    if (!engineRef.current || !context) {
      return null;
    }

    return engineRef.current.getBestStrategy(data, context);
  }, [context]);

  // Add a custom strategy
  const addStrategy = useCallback((strategy: IRenderStrategy) => {
    engineRef.current?.addStrategy(strategy);
  }, []);

  // Remove a strategy
  const removeStrategy = useCallback((strategyName: string): boolean => {
    return engineRef.current?.removeStrategy(strategyName) ?? false;
  }, []);

  // Get available strategies
  const getAvailableStrategies = useCallback((): IRenderStrategy[] => {
    return engineRef.current?.getAvailableStrategies() ?? [];
  }, []);

  // Get engine statistics
  const getStatistics = useCallback(() => {
    return engineRef.current?.getEngineStatistics();
  }, []);

  // Clear cache
  const clearCache = useCallback(() => {
    engineRef.current?.clearCache();
  }, []);

  // Force context update
  const refreshContext = useCallback(() => {
    updateContext();
  }, [updateContext]);

  // Get current context
  const getCurrentContext = useCallback((): RenderContext | null => {
    return context;
  }, [context]);

  // Evaluate all strategies for debugging
  const evaluateStrategies = useCallback((data: RenderData) => {
    if (!engineRef.current || !context) {
      return [];
    }

    return engineRef.current.evaluateAllStrategies(data, context);
  }, [context]);

  return {
    // Core rendering
    render,
    getBestStrategy,
    
    // Strategy management
    addStrategy,
    removeStrategy,
    getAvailableStrategies,
    
    // Context management
    context,
    refreshContext,
    getCurrentContext,
    
    // Utilities
    getStatistics,
    clearCache,
    evaluateStrategies,
    
    // State
    isInitialized,
  };
}

// Helper functions
function getDeviceType(width: number): 'mobile' | 'tablet' | 'desktop' {
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function getDeviceClass(): 'low' | 'medium' | 'high' {
  if (typeof window === 'undefined') return 'medium';

  // Use performance hints if available
  if ('deviceMemory' in navigator) {
    const memory = (navigator as any).deviceMemory;
    if (memory <= 2) return 'low';
    if (memory <= 4) return 'medium';
    return 'high';
  }

  // Fallback to CPU detection
  const cores = navigator.hardwareConcurrency || 2;
  if (cores <= 2) return 'low';
  if (cores <= 4) return 'medium';
  return 'high';
}

function getConnectionSpeed(): 'slow' | 'medium' | 'fast' {
  if (typeof window === 'undefined') return 'medium';

  // Use Network Information API if available
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    const effectiveType = connection.effectiveType;
    
    if (effectiveType === 'slow-2g' || effectiveType === '2g') return 'slow';
    if (effectiveType === '3g') return 'medium';
    return 'fast';
  }

  // Fallback
  return 'medium';
}

function detectScreenReader(): boolean {
  if (typeof window === 'undefined') return false;

  // Simple heuristics for screen reader detection
  return window.speechSynthesis !== undefined && 
         window.navigator.userAgent.includes('NVDA') ||
         window.navigator.userAgent.includes('JAWS') ||
         window.navigator.userAgent.includes('VoiceOver');
}

function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch {
    return false;
  }
}