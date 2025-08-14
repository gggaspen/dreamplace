import { BaseObserver } from '../BaseObserver';
import { IObservable } from '../types';

export interface PerformanceEvent {
  metric: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'ratio' | 'score';
  component?: string;
  operation?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Performance Observer - monitors application performance metrics
 */
export class PerformanceObserver extends BaseObserver<PerformanceEvent> {
  private performanceHistory: Array<PerformanceEvent & { timestamp: Date }> = [];
  private maxHistorySize: number = 1000;
  private thresholds: Map<string, number> = new Map();
  private performanceService?: any;

  constructor(performanceService?: any, maxHistorySize: number = 1000) {
    super('performance_observer');
    this.performanceService = performanceService;
    this.maxHistorySize = maxHistorySize;
    
    // Set default performance thresholds
    this.setDefaultThresholds();
  }

  async update(
    data: PerformanceEvent, 
    eventType: string, 
    source: IObservable<PerformanceEvent>
  ): Promise<void> {
    if (!this.isActive()) return;

    const timestampedEvent = {
      ...data,
      timestamp: new Date(),
    };

    // Add to history
    this.performanceHistory.push(timestampedEvent);
    
    // Maintain history size
    if (this.performanceHistory.length > this.maxHistorySize) {
      this.performanceHistory.shift();
    }

    // Log performance metric in development
    if (process.env.NODE_ENV === 'development') {
      this.logPerformanceMetric(timestampedEvent);
    }

    // Check against thresholds
    this.checkThresholds(timestampedEvent);

    // Report to external service
    await this.reportMetric(timestampedEvent);
  }

  onError(error: Error, eventType: string): void {
    this.log(`Performance monitoring error for event ${eventType}`, error);
  }

  private setDefaultThresholds(): void {
    // Core Web Vitals and other important metrics
    this.thresholds.set('LCP', 2500); // Largest Contentful Paint (ms)
    this.thresholds.set('FID', 100);  // First Input Delay (ms)
    this.thresholds.set('CLS', 0.1);  // Cumulative Layout Shift (score)
    this.thresholds.set('FCP', 1800); // First Contentful Paint (ms)
    this.thresholds.set('TTFB', 600); // Time to First Byte (ms)
    
    // Application-specific metrics
    this.thresholds.set('componentRender', 16); // Component render time (ms)
    this.thresholds.set('apiResponse', 1000);   // API response time (ms)
    this.thresholds.set('bundleSize', 250000);  // Bundle size (bytes)
    this.thresholds.set('memoryUsage', 50000000); // Memory usage (bytes)
  }

  private logPerformanceMetric(
    event: PerformanceEvent & { timestamp: Date }
  ): void {
    const { metric, value, unit, component, operation, timestamp } = event;
    const threshold = this.thresholds.get(metric);
    const isAboveThreshold = threshold && value > threshold;
    
    const emoji = isAboveThreshold ? '🐌' : '⚡';
    const status = isAboveThreshold ? 'SLOW' : 'GOOD';
    
    console.log(
      `${emoji} [${status}] ${metric}: ${value}${unit}`,
      component ? `(${component})` : '',
      operation ? `- ${operation}` : '',
      threshold ? `(threshold: ${threshold}${unit})` : ''
    );
  }

  private checkThresholds(event: PerformanceEvent & { timestamp: Date }): void {
    const threshold = this.thresholds.get(event.metric);
    
    if (threshold && event.value > threshold) {
      console.warn(
        `⚠️ Performance threshold exceeded for ${event.metric}:`,
        `${event.value}${event.unit} > ${threshold}${event.unit}`,
        event.component ? `in component: ${event.component}` : ''
      );
      
      // Create performance alert
      this.createPerformanceAlert(event, threshold);
    }
  }

  private createPerformanceAlert(
    event: PerformanceEvent & { timestamp: Date },
    threshold: number
  ): void {
    const alert = {
      type: 'performance_threshold_exceeded',
      metric: event.metric,
      value: event.value,
      threshold,
      unit: event.unit,
      component: event.component,
      operation: event.operation,
      timestamp: event.timestamp,
      severity: this.calculateSeverity(event.value, threshold),
    };

    // In a real application, this might trigger:
    // - Alerts to monitoring systems
    // - Performance degradation notifications
    // - Automatic performance optimizations
    
    this.log('Performance alert created', alert);
  }

  private calculateSeverity(value: number, threshold: number): 'low' | 'medium' | 'high' {
    const ratio = value / threshold;
    if (ratio > 3) return 'high';
    if (ratio > 1.5) return 'medium';
    return 'low';
  }

  private async reportMetric(
    event: PerformanceEvent & { timestamp: Date }
  ): Promise<void> {
    try {
      if (this.performanceService?.recordMetric) {
        await this.performanceService.recordMetric(event);
      } else if (typeof window !== 'undefined' && 'performance' in window) {
        // Use Performance API if available
        window.performance.mark(`${event.metric}-${event.timestamp.getTime()}`);
      }
    } catch (error) {
      this.log('Failed to report performance metric', { event, error });
    }
  }

  // Set custom threshold for a metric
  setThreshold(metric: string, threshold: number): void {
    this.thresholds.set(metric, threshold);
  }

  // Get performance statistics
  getPerformanceStatistics(): {
    totalMetrics: number;
    averages: Record<string, number>;
    p95Values: Record<string, number>;
    thresholdViolations: Record<string, number>;
    recentTrends: Record<string, 'improving' | 'stable' | 'degrading'>;
  } {
    const totalMetrics = this.performanceHistory.length;
    
    // Group metrics by type
    const metricGroups = this.performanceHistory.reduce((acc, event) => {
      if (!acc[event.metric]) {
        acc[event.metric] = [];
      }
      acc[event.metric].push(event.value);
      return acc;
    }, {} as Record<string, number[]>);

    // Calculate averages
    const averages = Object.entries(metricGroups).reduce((acc, [metric, values]) => {
      acc[metric] = values.reduce((sum, val) => sum + val, 0) / values.length;
      return acc;
    }, {} as Record<string, number>);

    // Calculate 95th percentiles
    const p95Values = Object.entries(metricGroups).reduce((acc, [metric, values]) => {
      const sorted = [...values].sort((a, b) => a - b);
      const p95Index = Math.floor(sorted.length * 0.95);
      acc[metric] = sorted[p95Index] || 0;
      return acc;
    }, {} as Record<string, number>);

    // Count threshold violations
    const thresholdViolations = this.performanceHistory.reduce((acc, event) => {
      const threshold = this.thresholds.get(event.metric);
      if (threshold && event.value > threshold) {
        acc[event.metric] = (acc[event.metric] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Calculate recent trends (last 10 vs previous 10 measurements for each metric)
    const recentTrends = Object.entries(metricGroups).reduce((acc, [metric, values]) => {
      if (values.length < 20) {
        acc[metric] = 'stable';
        return acc;
      }
      
      const recent = values.slice(-10);
      const previous = values.slice(-20, -10);
      
      const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
      const previousAvg = previous.reduce((sum, val) => sum + val, 0) / previous.length;
      
      const changeRatio = recentAvg / previousAvg;
      
      if (changeRatio < 0.9) acc[metric] = 'improving';
      else if (changeRatio > 1.1) acc[metric] = 'degrading';
      else acc[metric] = 'stable';
      
      return acc;
    }, {} as Record<string, 'improving' | 'stable' | 'degrading'>);

    return {
      totalMetrics,
      averages,
      p95Values,
      thresholdViolations,
      recentTrends,
    };
  }

  // Get performance history for a specific metric
  getMetricHistory(metric: string): Array<PerformanceEvent & { timestamp: Date }> {
    return this.performanceHistory.filter(event => event.metric === metric);
  }

  // Clear performance history
  clearHistory(): void {
    this.performanceHistory = [];
  }

  // Get current thresholds
  getThresholds(): Record<string, number> {
    return Object.fromEntries(this.thresholds);
  }
}