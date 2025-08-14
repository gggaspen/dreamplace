import { 
  IRenderingEngine, 
  IRenderStrategy, 
  RenderData, 
  RenderContext, 
  RenderResult 
} from './types';

/**
 * Rendering Engine - manages and orchestrates different rendering strategies
 */
export class RenderingEngine implements IRenderingEngine {
  private strategies: Map<string, IRenderStrategy> = new Map();
  private cache: Map<string, RenderResult> = new Map();
  private maxCacheSize: number = 100;
  private cacheHits: number = 0;
  private cacheMisses: number = 0;

  constructor(maxCacheSize: number = 100) {
    this.maxCacheSize = maxCacheSize;
  }

  addStrategy(strategy: IRenderStrategy): void {
    this.strategies.set(strategy.name, strategy);
    this.log(`Strategy '${strategy.name}' added`);
  }

  removeStrategy(strategyName: string): boolean {
    const removed = this.strategies.delete(strategyName);
    if (removed) {
      this.log(`Strategy '${strategyName}' removed`);
    }
    return removed;
  }

  async render(data: RenderData, context: RenderContext): Promise<RenderResult> {
    const startTime = performance.now();

    // Find the best strategy
    const strategy = this.getBestStrategy(data, context);
    if (!strategy) {
      throw new Error('No suitable rendering strategy found');
    }

    // Check cache if strategy supports caching
    let cacheKey = '';
    if (strategy.shouldCache?.(data, context)) {
      cacheKey = strategy.getCacheKey?.(data, context) || '';
      const cachedResult = this.getFromCache(cacheKey);
      if (cachedResult) {
        this.cacheHits++;
        this.log(`Cache hit for strategy '${strategy.name}'`);
        return {
          ...cachedResult,
          metadata: {
            ...cachedResult.metadata,
            cached: true,
          },
        };
      }
      this.cacheMisses++;
    }

    // Render using the selected strategy
    try {
      const result = await strategy.render(data, context);
      
      // Cache the result if applicable
      if (cacheKey && result.element) {
        this.addToCache(cacheKey, result);
      }

      const totalTime = performance.now() - startTime;
      this.log(`Rendered with strategy '${strategy.name}' in ${totalTime.toFixed(2)}ms`);

      return result;
    } catch (error) {
      this.log(`Error rendering with strategy '${strategy.name}':`, error);
      throw error;
    }
  }

  getBestStrategy(data: RenderData, context: RenderContext): IRenderStrategy | null {
    const candidates: Array<{ strategy: IRenderStrategy; priority: number }> = [];

    // Evaluate all strategies
    for (const strategy of this.strategies.values()) {
      if (strategy.canHandle(data, context)) {
        const priority = strategy.getPriority(data, context);
        candidates.push({ strategy, priority });
      }
    }

    if (candidates.length === 0) {
      return null;
    }

    // Sort by priority (higher is better)
    candidates.sort((a, b) => b.priority - a.priority);
    
    return candidates[0].strategy;
  }

  getAvailableStrategies(): IRenderStrategy[] {
    return Array.from(this.strategies.values());
  }

  // Cache management
  private getFromCache(key: string): RenderResult | null {
    return this.cache.get(key) || null;
  }

  private addToCache(key: string, result: RenderResult): void {
    // Manage cache size
    if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, result);
  }

  clearCache(): void {
    this.cache.clear();
    this.log('Cache cleared');
  }

  getCacheStatistics(): {
    size: number;
    maxSize: number;
    hits: number;
    misses: number;
    hitRate: number;
  } {
    const total = this.cacheHits + this.cacheMisses;
    return {
      size: this.cache.size,
      maxSize: this.maxCacheSize,
      hits: this.cacheHits,
      misses: this.cacheMisses,
      hitRate: total > 0 ? this.cacheHits / total : 0,
    };
  }

  // Strategy evaluation helper
  evaluateAllStrategies(data: RenderData, context: RenderContext): Array<{
    strategy: string;
    canHandle: boolean;
    priority: number;
  }> {
    return Array.from(this.strategies.values()).map(strategy => ({
      strategy: strategy.name,
      canHandle: strategy.canHandle(data, context),
      priority: strategy.canHandle(data, context) 
        ? strategy.getPriority(data, context) 
        : 0,
    }));
  }

  // Performance monitoring
  getEngineStatistics(): {
    strategiesCount: number;
    cache: ReturnType<typeof this.getCacheStatistics>;
    strategies: Array<{
      name: string;
      description: string;
    }>;
  } {
    return {
      strategiesCount: this.strategies.size,
      cache: this.getCacheStatistics(),
      strategies: Array.from(this.strategies.values()).map(s => ({
        name: s.name,
        description: s.description,
      })),
    };
  }

  private log(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[RenderingEngine] ${message}`, data || '');
    }
  }
}