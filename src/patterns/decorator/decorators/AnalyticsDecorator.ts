import React, { ComponentType, useEffect, useRef } from 'react';
import { BaseDecorator } from '../BaseDecorator';
import { DecoratorConfig, AnalyticsDecoratorConfig } from '../types';

/**
 * Analytics Decorator - adds analytics tracking to components
 */
export class AnalyticsDecorator extends BaseDecorator {
  constructor() {
    super(
      {
        name: 'analytics',
        description: 'Adds analytics tracking for views, clicks, and interactions',
        version: '1.0.0',
        dependencies: [],
        requiresProps: [],
      },
      20
    ); // Lower order = applied earlier
  }

  canDecorate(component: ComponentType, props?: any): boolean {
    return this.isValidComponent(component);
  }

  decorate(component: ComponentType, config?: DecoratorConfig): ComponentType {
    if (!this.validateConfig(config)) {
      throw new Error('Invalid analytics decorator configuration');
    }

    const analyticsConfig = config as AnalyticsDecoratorConfig;

    return this.createHOC(
      component,
      props => this.enhanceWithAnalytics(props, analyticsConfig),
      `Analytics(${component.displayName || component.name || 'Component'})`
    );
  }

  private enhanceWithAnalytics(props: any, config?: AnalyticsDecoratorConfig): any {
    if (!this.shouldApplyDecorator(props, config)) {
      return props;
    }

    // Create analytics-enhanced component
    const AnalyticsWrapper: React.FC = ({ children, ...restProps }) => {
      const elementRef = useRef<HTMLElement>(null);
      const viewTracked = useRef(false);

      // Track component view
      useEffect(() => {
        if (config?.options?.trackViews && !viewTracked.current) {
          this.trackView(restProps, config);
          viewTracked.current = true;
        }
      }, [restProps]);

      // Track intersection (scroll into view)
      useEffect(() => {
        if (!config?.options?.trackScroll || !elementRef.current) return;

        const observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                this.trackScrollIntoView(restProps, config);
              }
            });
          },
          { threshold: 0.5 }
        );

        observer.observe(elementRef.current);

        return () => observer.disconnect();
      }, [restProps]);

      // Enhanced props with analytics
      const enhancedProps = {
        ...restProps,
        ref: elementRef,
        onClick: this.enhanceClickHandler(restProps.onClick, restProps, config),
        onFocus: this.enhanceFocusHandler(restProps.onFocus, restProps, config),
        onSubmit: this.enhanceSubmitHandler(restProps.onSubmit, restProps, config),
      };

      return React.createElement(component, enhancedProps, children);
    };

    return { props: { ...props }, additionalProps: { children: props.children } };
  }

  private enhanceClickHandler(
    originalHandler?: (event: any) => void,
    props?: any,
    config?: AnalyticsDecoratorConfig
  ) {
    return (event: any) => {
      if (config?.options?.trackClicks) {
        this.trackClick(event, props, config);
      }

      originalHandler?.(event);
    };
  }

  private enhanceFocusHandler(
    originalHandler?: (event: any) => void,
    props?: any,
    config?: AnalyticsDecoratorConfig
  ) {
    return (event: any) => {
      this.trackInteraction('focus', event, props, config);
      originalHandler?.(event);
    };
  }

  private enhanceSubmitHandler(
    originalHandler?: (event: any) => void,
    props?: any,
    config?: AnalyticsDecoratorConfig
  ) {
    return (event: any) => {
      this.trackInteraction('submit', event, props, config);
      originalHandler?.(event);
    };
  }

  private trackView(props: any, config?: AnalyticsDecoratorConfig): void {
    const eventData = {
      type: 'view',
      component: this.getComponentName(props),
      timestamp: new Date().toISOString(),
      userId: config?.options?.userId,
      sessionId: config?.options?.sessionId,
      properties: this.extractAnalyticsProperties(props),
    };

    this.sendAnalyticsEvent('component_view', eventData);
  }

  private trackClick(event: any, props: any, config?: AnalyticsDecoratorConfig): void {
    const eventData = {
      type: 'click',
      component: this.getComponentName(props),
      element: event.target.tagName,
      text: event.target.textContent?.substring(0, 100),
      timestamp: new Date().toISOString(),
      userId: config?.options?.userId,
      sessionId: config?.options?.sessionId,
      properties: this.extractAnalyticsProperties(props),
      coordinates: {
        x: event.clientX,
        y: event.clientY,
      },
    };

    this.sendAnalyticsEvent('component_click', eventData);
  }

  private trackScrollIntoView(props: any, config?: AnalyticsDecoratorConfig): void {
    const eventData = {
      type: 'scroll_into_view',
      component: this.getComponentName(props),
      timestamp: new Date().toISOString(),
      userId: config?.options?.userId,
      sessionId: config?.options?.sessionId,
      properties: this.extractAnalyticsProperties(props),
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };

    this.sendAnalyticsEvent('component_scroll_view', eventData);
  }

  private trackInteraction(
    type: string,
    event: any,
    props: any,
    config?: AnalyticsDecoratorConfig
  ): void {
    const eventData = {
      type: `interaction_${type}`,
      component: this.getComponentName(props),
      timestamp: new Date().toISOString(),
      userId: config?.options?.userId,
      sessionId: config?.options?.sessionId,
      properties: this.extractAnalyticsProperties(props),
    };

    this.sendAnalyticsEvent(`component_${type}`, eventData);
  }

  private trackCustomEvent(
    eventName: string,
    props: any,
    config?: AnalyticsDecoratorConfig,
    additionalData?: Record<string, unknown>
  ): void {
    const eventData = {
      type: 'custom',
      component: this.getComponentName(props),
      eventName,
      timestamp: new Date().toISOString(),
      userId: config?.options?.userId,
      sessionId: config?.options?.sessionId,
      properties: this.extractAnalyticsProperties(props),
      ...additionalData,
    };

    this.sendAnalyticsEvent(eventName, eventData);
  }

  private getComponentName(props: any): string {
    return (
      props?.analyticsName || props?.id || props?.className?.split(' ')[0] || 'unknown_component'
    );
  }

  private extractAnalyticsProperties(props: any): Record<string, unknown> {
    const analyticsProps: Record<string, unknown> = {};

    // Extract common analytics properties
    if (props.id) analyticsProps.id = props.id;
    if (props.className) analyticsProps.className = props.className;
    if (props.title) analyticsProps.title = props.title;
    if (props.href) analyticsProps.href = props.href;
    if (props.value) analyticsProps.value = props.value;

    // Extract custom analytics properties
    Object.keys(props).forEach(key => {
      if (key.startsWith('analytics-') || key.startsWith('data-analytics-')) {
        analyticsProps[key.replace(/^(analytics-|data-analytics-)/, '')] = props[key];
      }
    });

    return analyticsProps;
  }

  private sendAnalyticsEvent(eventName: string, eventData: Record<string, unknown>): void {
    try {
      // In a real implementation, this would send to your analytics service
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Analytics] ${eventName}:`, eventData);
      }

      // Send to global analytics if available
      if (typeof window !== 'undefined') {
        // Google Analytics 4
        if ((window as any).gtag) {
          (window as any).gtag('event', eventName, eventData);
        }

        // Adobe Analytics
        if ((window as any).s) {
          (window as any).s.trackEvent(eventName, eventData);
        }

        // Custom analytics
        if ((window as any).analytics) {
          (window as any).analytics.track(eventName, eventData);
        }

        // Send to custom endpoint
        this.sendToAnalyticsEndpoint(eventName, eventData);
      }
    } catch (error) {
      this.log('error', 'Failed to send analytics event:', error);
    }
  }

  private async sendToAnalyticsEndpoint(
    eventName: string,
    eventData: Record<string, unknown>
  ): Promise<void> {
    try {
      const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
      if (!endpoint) return;

      await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: eventName,
          data: eventData,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      this.log('error', 'Failed to send to analytics endpoint:', error);
    }
  }
}
