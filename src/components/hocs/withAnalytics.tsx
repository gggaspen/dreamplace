/**
 * withAnalytics HOC
 * 
 * Higher-Order Component that adds analytics tracking to components.
 * Automatically tracks component renders, interactions, and errors.
 */

import React, { ComponentType, useEffect } from 'react';

interface AnalyticsOptions {
  trackRender?: boolean;
  trackUnmount?: boolean;
  componentName?: string;
  customEvents?: string[];
}

interface AnalyticsProps {
  trackEvent?: (eventName: string, properties?: object) => void;
}

export function withAnalytics<P extends object>(
  Component: ComponentType<P>,
  options: AnalyticsOptions = {}
) {
  const {
    trackRender = true,
    trackUnmount = false,
    componentName = Component.displayName || Component.name,
    customEvents = [],
  } = options;

  const WithAnalyticsComponent = (props: P & AnalyticsProps) => {
    const { trackEvent, ...componentProps } = props;

    // Track component render
    useEffect(() => {
      if (trackRender && trackEvent) {
        trackEvent(`${componentName}_render`, {
          timestamp: new Date().toISOString(),
          props: Object.keys(componentProps as object),
        });
      }
    }, [trackEvent, componentProps]);

    // Track component unmount
    useEffect(() => {
      if (trackUnmount && trackEvent) {
        return () => {
          trackEvent(`${componentName}_unmount`, {
            timestamp: new Date().toISOString(),
          });
        };
      }
    }, [trackEvent]);

    // Enhanced trackEvent function with component context
    const enhancedTrackEvent = (eventName: string, properties?: object) => {
      if (trackEvent) {
        trackEvent(`${componentName}_${eventName}`, {
          ...properties,
          component: componentName,
          timestamp: new Date().toISOString(),
        });
      }
    };

    const enhancedProps = {
      ...(componentProps as P),
      trackEvent: enhancedTrackEvent,
    };

    return <Component {...enhancedProps} />;
  };

  WithAnalyticsComponent.displayName = `withAnalytics(${componentName})`;

  return WithAnalyticsComponent;
}