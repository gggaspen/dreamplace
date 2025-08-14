import { IRenderStrategy, RenderData, RenderContext, RenderResult } from './types';

/**
 * Base implementation of the RenderStrategy interface
 * Provides common functionality for all rendering strategies
 */
export abstract class BaseRenderStrategy implements IRenderStrategy {
  public readonly name: string;
  public readonly description: string;
  protected renderCount: number = 0;
  protected lastRenderTime: number = 0;

  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
  }

  abstract canHandle(data: RenderData, context: RenderContext): boolean;
  abstract getPriority(data: RenderData, context: RenderContext): number;
  abstract render(data: RenderData, context: RenderContext): Promise<RenderResult>;

  shouldCache(data: RenderData, context: RenderContext): boolean {
    // Default caching strategy - cache if content is static
    return !this.hasInteractiveElements(data) && this.getContentSize(data) > 1000;
  }

  getCacheKey(data: RenderData, context: RenderContext): string {
    // Create a cache key based on content and relevant context
    const contentHash = this.hashContent(data.content);
    const contextHash = this.hashContext(context);
    return `${this.name}_${contentHash}_${contextHash}`;
  }

  protected startPerformanceTracking(): number {
    return performance.now();
  }

  protected endPerformanceTracking(startTime: number): number {
    const renderTime = performance.now() - startTime;
    this.lastRenderTime = renderTime;
    this.renderCount++;
    return renderTime;
  }

  protected createRenderResult(
    element: React.ReactElement | null,
    renderTime: number,
    additionalMetadata?: Record<string, unknown>
  ): RenderResult {
    return {
      element,
      metadata: {
        renderTime,
        strategy: this.name,
        optimized: renderTime < 16, // 60fps threshold
        cached: false,
        ...additionalMetadata,
      },
    };
  }

  protected hasInteractiveElements(data: RenderData): boolean {
    // Simple heuristic to detect interactive content
    if (typeof data.content === 'object' && data.content !== null) {
      const contentStr = JSON.stringify(data.content);
      return /button|input|select|textarea|onclick|onchange/i.test(contentStr);
    }
    return false;
  }

  protected getContentSize(data: RenderData): number {
    try {
      return JSON.stringify(data.content).length;
    } catch {
      return 0;
    }
  }

  protected hashContent(content: unknown): string {
    try {
      const str = JSON.stringify(content);
      return this.simpleHash(str);
    } catch {
      return 'invalid_content';
    }
  }

  protected hashContext(context: RenderContext): string {
    // Hash only relevant context properties for caching
    const relevantContext = {
      deviceType: context.viewport.deviceType,
      deviceClass: context.performance.deviceClass,
      reducedMotion: context.user.accessibility?.reducedMotion,
      highContrast: context.user.accessibility?.highContrast,
    };
    
    const str = JSON.stringify(relevantContext);
    return this.simpleHash(str);
  }

  protected simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  protected isMobile(context: RenderContext): boolean {
    return context.viewport.deviceType === 'mobile';
  }

  protected isLowEndDevice(context: RenderContext): boolean {
    return context.performance.deviceClass === 'low';
  }

  protected hasReducedMotion(context: RenderContext): boolean {
    return context.user.accessibility?.reducedMotion === true;
  }

  protected isSlowConnection(context: RenderContext): boolean {
    return context.performance.connectionSpeed === 'slow';
  }

  protected supportsWebGL(context: RenderContext): boolean {
    return context.features.webGL === true;
  }

  protected log(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${this.name}Strategy] ${message}`, data || '');
    }
  }

  // Performance statistics
  getStatistics(): {
    renderCount: number;
    lastRenderTime: number;
    averageRenderTime: number;
  } {
    return {
      renderCount: this.renderCount,
      lastRenderTime: this.lastRenderTime,
      averageRenderTime: this.renderCount > 0 ? this.lastRenderTime / this.renderCount : 0,
    };
  }
}