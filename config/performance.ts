export interface PerformanceBudget {
  // Bundle size limits (in KB)
  maxBundleSize: number;
  maxChunkSize: number;
  maxAssetSize: number;

  // Runtime performance limits
  maxLcp: number; // Largest Contentful Paint (ms)
  maxFid: number; // First Input Delay (ms)
  maxCls: number; // Cumulative Layout Shift (score)
  maxFcp: number; // First Contentful Paint (ms)
  maxTtfb: number; // Time to First Byte (ms)
}

export const performanceBudgets = {
  development: {
    maxBundleSize: 5000, // 5MB for dev builds
    maxChunkSize: 1000, // 1MB per chunk
    maxAssetSize: 500, // 500KB per asset
    maxLcp: 4000, // 4 seconds
    maxFid: 300, // 300ms
    maxCls: 0.25, // 0.25 score
    maxFcp: 3000, // 3 seconds
    maxTtfb: 1500, // 1.5 seconds
  },
  production: {
    maxBundleSize: 2000, // 2MB for production
    maxChunkSize: 500, // 500KB per chunk
    maxAssetSize: 250, // 250KB per asset
    maxLcp: 2500, // 2.5 seconds
    maxFid: 100, // 100ms
    maxCls: 0.1, // 0.1 score
    maxFcp: 1800, // 1.8 seconds
    maxTtfb: 800, // 800ms
  },
  test: {
    maxBundleSize: 3000, // 3MB for test builds
    maxChunkSize: 750, // 750KB per chunk
    maxAssetSize: 375, // 375KB per asset
    maxLcp: 3000, // 3 seconds
    maxFid: 200, // 200ms
    maxCls: 0.15, // 0.15 score
    maxFcp: 2000, // 2 seconds
    maxTtfb: 1000, // 1 second
  },
};

export const getPerformanceBudget = (environment = 'development'): PerformanceBudget => {
  switch (environment) {
    case 'production':
      return performanceBudgets.production;
    case 'test':
      return performanceBudgets.test;
    case 'development':
    default:
      return performanceBudgets.development;
  }
};

export interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  entries: PerformanceEntry[];
}

export const reportWebVitals = (metric: WebVitalsMetric) => {
  const budget = getPerformanceBudget(process.env.NODE_ENV);

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.group(`🚀 Web Vitals: ${metric.name}`);
    console.log('Value:', metric.value);
    console.log('Rating:', metric.rating);
    console.log('Delta:', metric.delta);
    console.groupEnd();
  }

  // Send to analytics endpoint if configured
  if (process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_WEB_VITALS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metric,
        timestamp: Date.now(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(error => {
      console.error('Failed to send web vitals:', error);
    });
  }

  // Check against performance budgets
  const isWithinBudget = checkPerformanceBudget(metric, budget);
  if (!isWithinBudget) {
    console.warn(`⚠️ Performance budget exceeded for ${metric.name}:`, {
      actual: metric.value,
      budget: getBudgetValue(metric.name, budget),
    });
  }
};

const checkPerformanceBudget = (metric: WebVitalsMetric, budget: PerformanceBudget): boolean => {
  switch (metric.name) {
    case 'LCP':
      return metric.value <= budget.maxLcp;
    case 'FID':
      return metric.value <= budget.maxFid;
    case 'CLS':
      return metric.value <= budget.maxCls;
    case 'FCP':
      return metric.value <= budget.maxFcp;
    case 'TTFB':
      return metric.value <= budget.maxTtfb;
    default:
      return true;
  }
};

const getBudgetValue = (metricName: string, budget: PerformanceBudget): number => {
  switch (metricName) {
    case 'LCP':
      return budget.maxLcp;
    case 'FID':
      return budget.maxFid;
    case 'CLS':
      return budget.maxCls;
    case 'FCP':
      return budget.maxFcp;
    case 'TTFB':
      return budget.maxTtfb;
    default:
      return 0;
  }
};
