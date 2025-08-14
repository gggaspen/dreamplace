/**
 * Strategy Pattern Implementation for Different Rendering Modes
 * 
 * The Strategy pattern defines a family of algorithms, encapsulates each one,
 * and makes them interchangeable. This allows the algorithm to vary independently
 * from clients that use it.
 */

export interface RenderData {
  content: unknown;
  props?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface RenderResult {
  element: React.ReactElement | null;
  metadata?: {
    renderTime?: number;
    strategy: string;
    optimized?: boolean;
    cached?: boolean;
  };
}

export interface RenderContext {
  viewport: {
    width: number;
    height: number;
    deviceType: 'mobile' | 'tablet' | 'desktop';
  };
  performance: {
    deviceClass: 'low' | 'medium' | 'high';
    connectionSpeed: 'slow' | 'medium' | 'fast';
  };
  user: {
    preferences?: Record<string, unknown>;
    accessibility?: {
      reducedMotion?: boolean;
      highContrast?: boolean;
      screenReader?: boolean;
    };
  };
  features: {
    webGL?: boolean;
    intersectionObserver?: boolean;
    performanceObserver?: boolean;
  };
}

export interface IRenderStrategy {
  name: string;
  description: string;
  canHandle(data: RenderData, context: RenderContext): boolean;
  getPriority(data: RenderData, context: RenderContext): number;
  render(data: RenderData, context: RenderContext): Promise<RenderResult>;
  shouldCache?(data: RenderData, context: RenderContext): boolean;
  getCacheKey?(data: RenderData, context: RenderContext): string;
}

export interface IRenderingEngine {
  addStrategy(strategy: IRenderStrategy): void;
  removeStrategy(strategyName: string): boolean;
  render(data: RenderData, context: RenderContext): Promise<RenderResult>;
  getAvailableStrategies(): IRenderStrategy[];
  getBestStrategy(data: RenderData, context: RenderContext): IRenderStrategy | null;
}

export enum RenderMode {
  // Performance modes
  PERFORMANCE = 'performance',
  BALANCED = 'balanced',
  QUALITY = 'quality',
  
  // Device-specific modes
  MOBILE = 'mobile',
  TABLET = 'tablet',
  DESKTOP = 'desktop',
  
  // Accessibility modes
  ACCESSIBLE = 'accessible',
  HIGH_CONTRAST = 'high_contrast',
  REDUCED_MOTION = 'reduced_motion',
  
  // Feature modes
  OFFLINE = 'offline',
  LOW_BANDWIDTH = 'low_bandwidth',
  PROGRESSIVE = 'progressive',
}

export enum ContentType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  INTERACTIVE = 'interactive',
  LIST = 'list',
  CARD = 'card',
  HERO = 'hero',
  CAROUSEL = 'carousel',
  FORM = 'form',
}