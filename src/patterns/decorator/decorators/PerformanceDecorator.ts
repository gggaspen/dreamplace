import React, { ComponentType, useEffect, useRef, useState } from 'react';
import { BaseDecorator } from '../BaseDecorator';
import { DecoratorConfig, PerformanceDecoratorConfig } from '../types';

/**
 * Performance Decorator - adds performance monitoring to components
 */
export class PerformanceDecorator extends BaseDecorator {
  private performanceEntries: Map<string, PerformanceEntry[]> = new Map();

  constructor() {
    super({
      name: 'performance',
      description: 'Adds performance monitoring for render times and interactions',
      version: '1.0.0',
      dependencies: [],
      requiresProps: [],
    }, 90); // High order = applied late to measure other decorators
  }

  canDecorate(component: ComponentType, props?: any): boolean {
    return this.isValidComponent(component) && 
           typeof window !== 'undefined' && 
           'performance' in window;
  }

  decorate(component: ComponentType, config?: DecoratorConfig): ComponentType {
    if (!this.validateConfig(config)) {
      throw new Error('Invalid performance decorator configuration');
    }

    const perfConfig = config as PerformanceDecoratorConfig;
    
    return this.createHOC(
      component,
      (props) => this.enhanceWithPerformanceMonitoring(props, perfConfig),
      `Performance(${component.displayName || component.name || 'Component'})`
    );
  }

  private enhanceWithPerformanceMonitoring(props: any, config?: PerformanceDecoratorConfig): any {
    if (!this.shouldApplyDecorator(props, config)) {
      return props;
    }

    const PerformanceWrapper: React.FC = ({ children, ...restProps }) => {
      const mountTimeRef = useRef<number>();
      const renderCountRef = useRef<number>(0);
      const lastRenderTimeRef = useRef<number>();
      const [renderMetrics, setRenderMetrics] = useState<any>(null);

      const componentName = this.getComponentName(restProps);

      // Measure component mount time
      useEffect(() => {
        const mountTime = performance.now();
        mountTimeRef.current = mountTime;

        if (config?.options?.measureRender) {
          this.recordPerformanceMetric('component_mount', {
            component: componentName,
            mountTime: mountTime,
            timestamp: new Date().toISOString(),
          });
        }

        return () => {
          // Measure unmount time
          const unmountTime = performance.now();
          const totalMountedTime = mountTime ? unmountTime - mountTime : 0;
          
          this.recordPerformanceMetric('component_unmount', {
            component: componentName,
            totalMountedTime,
            renderCount: renderCountRef.current,
            timestamp: new Date().toISOString(),
          });
        };
      }, [componentName]);

      // Measure render performance
      useEffect(() => {
        const renderStartTime = performance.now();
        renderCountRef.current++;

        // Use requestIdleCallback to measure after render
        const callback = (deadline: IdleDeadline) => {
          const renderEndTime = performance.now();
          const renderTime = renderEndTime - renderStartTime;
          lastRenderTimeRef.current = renderTime;

          if (config?.options?.measureRender) {
            this.recordRenderMetric(componentName, renderTime, renderCountRef.current);
            
            // Check performance threshold
            const threshold = config.options.threshold || 16; // 16ms for 60fps
            if (renderTime > threshold) {
              this.reportSlowRender(componentName, renderTime, threshold, restProps);
            }
          }

          // Update metrics state for development
          if (process.env.NODE_ENV === 'development') {
            setRenderMetrics({
              renderTime,
              renderCount: renderCountRef.current,
              averageRenderTime: this.getAverageRenderTime(componentName),
            });
          }
        };

        if ('requestIdleCallback' in window) {
          requestIdleCallback(callback);
        } else {
          setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 0 }), 0);
        }
      });

      // Measure interaction performance
      const enhancedProps = this.enhanceWithInteractionTracking(
        restProps,
        componentName,
        config
      );

      // Add performance overlay in development
      if (process.env.NODE_ENV === 'development' && renderMetrics) {
        enhancedProps.style = {
          ...enhancedProps.style,
          position: 'relative',
        };
      }

      const wrappedComponent = React.createElement(component, enhancedProps, children);

      // Add performance overlay in development
      if (process.env.NODE_ENV === 'development' && renderMetrics && config?.options?.measureRender) {
        return React.createElement(
          'div',
          { style: { position: 'relative' } },
          wrappedComponent,
          this.renderPerformanceOverlay(renderMetrics, componentName)
        );
      }

      return wrappedComponent;
    };

    return { props: { ...props }, additionalProps: { children: props.children } };
  }

  private enhanceWithInteractionTracking(
    props: any,
    componentName: string,
    config?: PerformanceDecoratorConfig
  ): any {
    if (!config?.options?.measureInteraction) {
      return props;
    }

    const enhancedProps = { ...props };

    // Enhance click handler
    if (props.onClick) {
      enhancedProps.onClick = (event: any) => {
        const startTime = performance.now();
        
        const result = props.onClick(event);
        
        // Measure synchronous execution time
        const syncTime = performance.now() - startTime;
        
        // If it returns a promise, measure async time too
        if (result && typeof result.then === 'function') {
          result.then(() => {
            const totalTime = performance.now() - startTime;
            this.recordInteractionMetric('click', componentName, totalTime, { syncTime });
          }).catch((error: Error) => {
            const totalTime = performance.now() - startTime;
            this.recordInteractionMetric('click_error', componentName, totalTime, { 
              syncTime, 
              error: error.message 
            });
          });
        } else {
          this.recordInteractionMetric('click', componentName, syncTime);
        }

        return result;
      };
    }

    // Enhance other interaction handlers
    ['onFocus', 'onBlur', 'onKeyDown', 'onSubmit'].forEach(eventType => {
      if (props[eventType]) {
        const originalHandler = props[eventType];
        enhancedProps[eventType] = (event: any) => {
          const startTime = performance.now();
          const result = originalHandler(event);
          const endTime = performance.now();
          
          this.recordInteractionMetric(
            eventType.toLowerCase().replace('on', ''),
            componentName,
            endTime - startTime
          );
          
          return result;
        };
      }
    });

    return enhancedProps;
  }

  private recordPerformanceMetric(type: string, data: Record<string, unknown>): void {
    const entry = {
      name: `${type}_${data.component}`,
      entryType: 'measure',
      startTime: performance.now(),
      duration: 0,
      detail: data,
    } as PerformanceEntry;

    const componentEntries = this.performanceEntries.get(data.component as string) || [];
    componentEntries.push(entry);
    this.performanceEntries.set(data.component as string, componentEntries);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${type}:`, data);
    }

    // Send to monitoring service
    this.sendToPerformanceService(type, data);
  }

  private recordRenderMetric(
    componentName: string,
    renderTime: number,
    renderCount: number
  ): void {
    this.recordPerformanceMetric('component_render', {
      component: componentName,
      renderTime,
      renderCount,
      timestamp: new Date().toISOString(),
    });

    // Create performance mark
    if ('performance' in window && performance.mark) {
      performance.mark(`${componentName}_render_${renderCount}`);
    }
  }

  private recordInteractionMetric(
    interactionType: string,
    componentName: string,
    duration: number,
    metadata?: Record<string, unknown>
  ): void {
    this.recordPerformanceMetric('component_interaction', {
      component: componentName,
      interactionType,
      duration,
      timestamp: new Date().toISOString(),
      ...metadata,
    });
  }

  private reportSlowRender(
    componentName: string,
    renderTime: number,
    threshold: number,
    props: any
  ): void {
    const report = {
      type: 'slow_render',
      component: componentName,
      renderTime,
      threshold,
      timestamp: new Date().toISOString(),
      props: this.sanitizeProps(props),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
    };

    console.warn(`[Performance] Slow render detected:`, report);
    this.sendToPerformanceService('slow_render', report);
  }

  private getAverageRenderTime(componentName: string): number {
    const entries = this.performanceEntries.get(componentName) || [];
    const renderEntries = entries.filter(entry => 
      entry.name.includes('component_render')
    );

    if (renderEntries.length === 0) return 0;

    const totalTime = renderEntries.reduce((sum, entry) => 
      sum + ((entry as any).detail?.renderTime || 0), 0
    );

    return totalTime / renderEntries.length;
  }

  private getComponentName(props: any): string {
    return props?.performanceName || 
           props?.id || 
           props?.className?.split(' ')[0] || 
           'unknown_component';
  }

  private sanitizeProps(props: any): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    
    Object.keys(props).forEach(key => {
      const value = props[key];
      
      // Only include serializable values
      if (typeof value === 'string' || 
          typeof value === 'number' || 
          typeof value === 'boolean' ||
          value === null) {
        sanitized[key] = value;
      } else if (Array.isArray(value)) {
        sanitized[key] = `Array(${value.length})`;
      } else if (typeof value === 'object') {
        sanitized[key] = `Object(${Object.keys(value).length} keys)`;
      } else if (typeof value === 'function') {
        sanitized[key] = `Function(${value.name || 'anonymous'})`;
      }
    });

    return sanitized;
  }

  private async sendToPerformanceService(
    type: string,
    data: Record<string, unknown>
  ): Promise<void> {
    try {
      const endpoint = process.env.NEXT_PUBLIC_PERFORMANCE_ENDPOINT;
      if (!endpoint) return;

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          data,
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : 'unknown',
        }),
      });
    } catch (error) {
      console.error('[Performance] Failed to send performance data:', error);
    }
  }

  private renderPerformanceOverlay(
    metrics: any,
    componentName: string
  ): React.ReactElement {
    const isSlowRender = metrics.renderTime > 16;
    
    return React.createElement(
      'div',
      {
        style: {
          position: 'absolute',
          top: '0',
          right: '0',
          backgroundColor: isSlowRender ? '#ff6b6b' : '#51cf66',
          color: 'white',
          padding: '2px 6px',
          fontSize: '10px',
          fontFamily: 'monospace',
          borderRadius: '0 0 0 4px',
          zIndex: 9999,
          pointerEvents: 'none',
          opacity: 0.8,
        },
      },
      `${componentName}: ${metrics.renderTime.toFixed(1)}ms (${metrics.renderCount})`
    );
  }

  // Public API for getting performance data
  getPerformanceData(componentName?: string): Record<string, any> {
    if (componentName) {
      const entries = this.performanceEntries.get(componentName) || [];
      return {
        component: componentName,
        entries: entries.map(entry => ({
          name: entry.name,
          duration: entry.duration,
          detail: (entry as any).detail,
        })),
        averageRenderTime: this.getAverageRenderTime(componentName),
      };
    }

    const allData: Record<string, any> = {};
    this.performanceEntries.forEach((entries, name) => {
      allData[name] = {
        entries: entries.length,
        averageRenderTime: this.getAverageRenderTime(name),
      };
    });

    return allData;
  }

  clearPerformanceData(componentName?: string): void {
    if (componentName) {
      this.performanceEntries.delete(componentName);
    } else {
      this.performanceEntries.clear();
    }
  }
}