import { RenderingEngine } from '@/patterns/strategy/RenderingEngine';
import { BaseRenderStrategy } from '@/patterns/strategy/BaseRenderStrategy';
import { RenderData, RenderContext, RenderResult } from '@/patterns/strategy/types';

// Mock strategy for testing
class MockRenderStrategy extends BaseRenderStrategy {
  private priority: number;
  private canHandleResult: boolean;
  private renderResult: React.ReactElement | null;

  constructor(
    name: string,
    priority = 5,
    canHandleResult = true,
    renderResult: React.ReactElement | null = null
  ) {
    super(name, `Mock strategy: ${name}`);
    this.priority = priority;
    this.canHandleResult = canHandleResult;
    this.renderResult = renderResult;
  }

  canHandle(): boolean {
    return this.canHandleResult;
  }

  getPriority(): number {
    return this.priority;
  }

  async render(): Promise<RenderResult> {
    const startTime = this.startPerformanceTracking();

    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 10));

    const renderTime = this.endPerformanceTracking(startTime);

    return this.createRenderResult(
      this.renderResult || { type: 'div', props: { children: 'Mock render' } },
      renderTime
    );
  }

  setPriority(priority: number): void {
    this.priority = priority;
  }

  setCanHandle(canHandle: boolean): void {
    this.canHandleResult = canHandle;
  }
}

describe('RenderingEngine', () => {
  let engine: RenderingEngine;
  let mockContext: RenderContext;
  let mockData: RenderData;

  beforeEach(() => {
    engine = new RenderingEngine();

    mockContext = {
      viewport: {
        width: 1024,
        height: 768,
        deviceType: 'desktop',
      },
      performance: {
        deviceClass: 'medium',
        connectionSpeed: 'fast',
      },
      user: {
        accessibility: {
          reducedMotion: false,
          highContrast: false,
          screenReader: false,
        },
      },
      features: {
        webGL: true,
        intersectionObserver: true,
        performanceObserver: true,
      },
    };

    mockData = {
      content: { type: 'text', text: 'Hello World' },
      props: {},
    };
  });

  describe('strategy management', () => {
    it('should add and retrieve strategies', () => {
      const strategy1 = new MockRenderStrategy('strategy1');
      const strategy2 = new MockRenderStrategy('strategy2');

      engine.addStrategy(strategy1);
      engine.addStrategy(strategy2);

      const strategies = engine.getAvailableStrategies();
      expect(strategies).toHaveLength(2);
      expect(strategies.map(s => s.name)).toEqual(['strategy1', 'strategy2']);
    });

    it('should remove strategies', () => {
      const strategy = new MockRenderStrategy('test-strategy');
      engine.addStrategy(strategy);

      expect(engine.getAvailableStrategies()).toHaveLength(1);

      const removed = engine.removeStrategy('test-strategy');
      expect(removed).toBe(true);
      expect(engine.getAvailableStrategies()).toHaveLength(0);
    });

    it('should return false when removing non-existent strategy', () => {
      const removed = engine.removeStrategy('non-existent');
      expect(removed).toBe(false);
    });
  });

  describe('strategy selection', () => {
    it('should select strategy with highest priority', () => {
      const lowPriorityStrategy = new MockRenderStrategy('low', 2);
      const highPriorityStrategy = new MockRenderStrategy('high', 8);
      const mediumPriorityStrategy = new MockRenderStrategy('medium', 5);

      engine.addStrategy(lowPriorityStrategy);
      engine.addStrategy(highPriorityStrategy);
      engine.addStrategy(mediumPriorityStrategy);

      const bestStrategy = engine.getBestStrategy(mockData, mockContext);
      expect(bestStrategy?.name).toBe('high');
    });

    it('should only consider strategies that can handle the data', () => {
      const canHandleStrategy = new MockRenderStrategy('can-handle', 3, true);
      const cannotHandleStrategy = new MockRenderStrategy('cannot-handle', 10, false);

      engine.addStrategy(canHandleStrategy);
      engine.addStrategy(cannotHandleStrategy);

      const bestStrategy = engine.getBestStrategy(mockData, mockContext);
      expect(bestStrategy?.name).toBe('can-handle');
    });

    it('should return null when no strategy can handle the data', () => {
      const strategy = new MockRenderStrategy('test', 5, false);
      engine.addStrategy(strategy);

      const bestStrategy = engine.getBestStrategy(mockData, mockContext);
      expect(bestStrategy).toBeNull();
    });
  });

  describe('rendering', () => {
    it('should render using the best strategy', async () => {
      const strategy = new MockRenderStrategy('test-strategy');
      engine.addStrategy(strategy);

      const result = await engine.render(mockData, mockContext);

      expect(result.metadata?.strategy).toBe('test-strategy');
      expect(result.element).toBeDefined();
    });

    it('should throw error when no strategy can handle the data', async () => {
      const strategy = new MockRenderStrategy('test', 5, false);
      engine.addStrategy(strategy);

      await expect(engine.render(mockData, mockContext)).rejects.toThrow(
        'No suitable rendering strategy found'
      );
    });

    it('should cache results when strategy supports caching', async () => {
      const strategy = new MockRenderStrategy('cacheable');

      // Override shouldCache to return true
      strategy.shouldCache = () => true;
      strategy.getCacheKey = () => 'test-cache-key';

      engine.addStrategy(strategy);

      // First render
      const result1 = await engine.render(mockData, mockContext);
      expect(result1.metadata?.cached).toBe(false);

      // Second render should use cache
      const result2 = await engine.render(mockData, mockContext);
      expect(result2.metadata?.cached).toBe(true);
    });
  });

  describe('cache management', () => {
    it('should manage cache size limit', async () => {
      const smallEngine = new RenderingEngine(2); // Max 2 cached items
      const strategy = new MockRenderStrategy('test');

      strategy.shouldCache = () => true;
      strategy.getCacheKey = data => `key-${JSON.stringify(data.content)}`;

      smallEngine.addStrategy(strategy);

      // Render 3 different items
      await smallEngine.render({ content: { id: 1 } }, mockContext);
      await smallEngine.render({ content: { id: 2 } }, mockContext);
      await smallEngine.render({ content: { id: 3 } }, mockContext);

      const stats = smallEngine.getCacheStatistics();
      expect(stats.size).toBe(2); // Should not exceed max size
    });

    it('should clear cache when requested', async () => {
      const strategy = new MockRenderStrategy('test');
      strategy.shouldCache = () => true;
      strategy.getCacheKey = () => 'test-key';

      engine.addStrategy(strategy);

      await engine.render(mockData, mockContext);

      let stats = engine.getCacheStatistics();
      expect(stats.size).toBe(1);

      engine.clearCache();

      stats = engine.getCacheStatistics();
      expect(stats.size).toBe(0);
    });
  });

  describe('statistics', () => {
    it('should provide engine statistics', () => {
      const strategy1 = new MockRenderStrategy('strategy1');
      const strategy2 = new MockRenderStrategy('strategy2');

      engine.addStrategy(strategy1);
      engine.addStrategy(strategy2);

      const stats = engine.getEngineStatistics();

      expect(stats.strategiesCount).toBe(2);
      expect(stats.strategies).toHaveLength(2);
      expect(stats.strategies[0].name).toBe('strategy1');
      expect(stats.strategies[1].name).toBe('strategy2');
    });

    it('should track cache statistics', async () => {
      const strategy = new MockRenderStrategy('test');
      strategy.shouldCache = () => true;
      strategy.getCacheKey = () => 'test-key';

      engine.addStrategy(strategy);

      // First render (cache miss)
      await engine.render(mockData, mockContext);

      // Second render (cache hit)
      await engine.render(mockData, mockContext);

      const stats = engine.getCacheStatistics();
      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.hitRate).toBe(0.5);
    });
  });

  describe('strategy evaluation', () => {
    it('should evaluate all strategies for debugging', () => {
      const strategy1 = new MockRenderStrategy('strategy1', 5, true);
      const strategy2 = new MockRenderStrategy('strategy2', 3, false);
      const strategy3 = new MockRenderStrategy('strategy3', 7, true);

      engine.addStrategy(strategy1);
      engine.addStrategy(strategy2);
      engine.addStrategy(strategy3);

      const evaluation = engine.evaluateAllStrategies(mockData, mockContext);

      expect(evaluation).toHaveLength(3);
      expect(evaluation[0]).toEqual({
        strategy: 'strategy1',
        canHandle: true,
        priority: 5,
      });
      expect(evaluation[1]).toEqual({
        strategy: 'strategy2',
        canHandle: false,
        priority: 0,
      });
      expect(evaluation[2]).toEqual({
        strategy: 'strategy3',
        canHandle: true,
        priority: 7,
      });
    });
  });
});
