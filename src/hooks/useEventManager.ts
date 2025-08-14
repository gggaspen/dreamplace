import { useEffect, useRef, useCallback } from 'react';
import {
  EventManager,
  IObserver,
  EventType,
  AnalyticsObserver,
  LoggingObserver,
  StateObserver,
  ErrorObserver,
  PerformanceObserver,
  AnalyticsEvent,
  LogEvent,
  StateChangeEvent,
  ErrorEvent,
  PerformanceEvent,
} from '@/patterns/observer';

/**
 * React hook for event management using the Observer pattern
 * Provides centralized event handling with built-in observers
 */
export function useEventManager() {
  const eventManagerRef = useRef<EventManager>();
  const observersRef = useRef<Map<string, IObserver>>(new Map());

  // Initialize event manager and default observers
  useEffect(() => {
    if (!eventManagerRef.current) {
      eventManagerRef.current = new EventManager({
        maxObservers: 100,
        asyncEvents: true,
        errorHandling: 'callback',
        enableLogging: process.env.NODE_ENV === 'development',
      });

      // Set up default observers
      setupDefaultObservers();
    }

    return () => {
      // Cleanup on unmount
      eventManagerRef.current?.unsubscribeAll();
    };
  }, []);

  const setupDefaultObservers = useCallback(() => {
    if (!eventManagerRef.current) return;

    // Analytics Observer
    const analyticsObserver = new AnalyticsObserver();
    eventManagerRef.current.subscribe(analyticsObserver, [
      EventType.USER_ACTION,
      EventType.NAVIGATION,
      EventType.MEDIA_PLAY,
      EventType.MEDIA_PAUSE,
    ]);
    observersRef.current.set('analytics', analyticsObserver);

    // Logging Observer
    const loggingObserver = new LoggingObserver();
    eventManagerRef.current.subscribe(loggingObserver, [
      EventType.LOG_MESSAGE,
      EventType.ERROR_OCCURRED,
    ]);
    observersRef.current.set('logging', loggingObserver);

    // State Observer (development only)
    if (process.env.NODE_ENV === 'development') {
      const stateObserver = new StateObserver();
      eventManagerRef.current.subscribe(stateObserver, [EventType.STATE_CHANGED]);
      observersRef.current.set('state', stateObserver);
    }

    // Error Observer
    const errorObserver = new ErrorObserver();
    eventManagerRef.current.subscribe(errorObserver, [EventType.ERROR_OCCURRED]);
    observersRef.current.set('error', errorObserver);

    // Performance Observer
    const performanceObserver = new PerformanceObserver();
    eventManagerRef.current.subscribe(performanceObserver, [EventType.PERFORMANCE_METRIC]);
    observersRef.current.set('performance', performanceObserver);
  }, []);

  // Emit an event
  const emit = useCallback(async (eventType: string, data: unknown): Promise<void> => {
    if (!eventManagerRef.current) {
      console.warn('EventManager not initialized');
      return;
    }

    await eventManagerRef.current.emit(eventType, data);
  }, []);

  // Subscribe to events
  const subscribe = useCallback((observer: IObserver, eventTypes?: string[]): string => {
    if (!eventManagerRef.current) {
      throw new Error('EventManager not initialized');
    }

    return eventManagerRef.current.subscribe(observer, eventTypes);
  }, []);

  // Unsubscribe from events
  const unsubscribe = useCallback((observerId: string): boolean => {
    if (!eventManagerRef.current) {
      return false;
    }

    return eventManagerRef.current.unsubscribe(observerId);
  }, []);

  // Convenience methods for common events
  const trackAnalytics = useCallback(
    async (event: AnalyticsEvent): Promise<void> => {
      await emit(EventType.ANALYTICS_EVENT, event);
    },
    [emit]
  );

  const logMessage = useCallback(
    async (log: LogEvent): Promise<void> => {
      await emit(EventType.LOG_MESSAGE, log);
    },
    [emit]
  );

  const trackStateChange = useCallback(
    async (change: StateChangeEvent): Promise<void> => {
      await emit(EventType.STATE_CHANGED, change);
    },
    [emit]
  );

  const reportError = useCallback(
    async (error: ErrorEvent): Promise<void> => {
      await emit(EventType.ERROR_OCCURRED, error);
    },
    [emit]
  );

  const trackPerformance = useCallback(
    async (metric: PerformanceEvent): Promise<void> => {
      await emit(EventType.PERFORMANCE_METRIC, metric);
    },
    [emit]
  );

  const trackUserAction = useCallback(
    async (action: AnalyticsEvent): Promise<void> => {
      await emit(EventType.USER_ACTION, action);
    },
    [emit]
  );

  const trackNavigation = useCallback(
    async (navigation: { to: string; from?: string }): Promise<void> => {
      await emit(EventType.NAVIGATION, navigation);
    },
    [emit]
  );

  const trackMediaEvent = useCallback(
    async (
      event: 'play' | 'pause',
      mediaData: { id: string; title?: string; position?: number }
    ): Promise<void> => {
      const eventType = event === 'play' ? EventType.MEDIA_PLAY : EventType.MEDIA_PAUSE;
      await emit(eventType, mediaData);
    },
    [emit]
  );

  // Get observer instance
  const getObserver = useCallback((type: string): IObserver | undefined => {
    return observersRef.current.get(type);
  }, []);

  // Get event manager stats
  const getStats = useCallback(() => {
    if (!eventManagerRef.current) {
      return null;
    }

    return {
      observerCount: eventManagerRef.current.getObserverCount(),
      history: eventManagerRef.current.getEventHistory(),
      subscriptions: eventManagerRef.current.getActiveSubscriptions(),
    };
  }, []);

  // Register external services
  const registerAnalyticsService = useCallback((service: any) => {
    const analyticsObserver = observersRef.current.get('analytics') as AnalyticsObserver;
    if (analyticsObserver) {
      // Would need to modify AnalyticsObserver to accept service updates
      console.log('Analytics service registered');
    }
  }, []);

  const registerErrorService = useCallback((service: any) => {
    const errorObserver = observersRef.current.get('error') as ErrorObserver;
    if (errorObserver) {
      // Would need to modify ErrorObserver to accept service updates
      console.log('Error service registered');
    }
  }, []);

  return {
    // Core event operations
    emit,
    subscribe,
    unsubscribe,

    // Convenience methods
    trackAnalytics,
    logMessage,
    trackStateChange,
    reportError,
    trackPerformance,
    trackUserAction,
    trackNavigation,
    trackMediaEvent,

    // Management
    getObserver,
    getStats,

    // Service registration
    registerAnalyticsService,
    registerErrorService,
  };
}
