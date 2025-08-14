import { BaseObserver } from '../BaseObserver';
import { IObservable, EventType } from '../types';

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Analytics Observer - tracks user interactions and system events for analytics
 */
export class AnalyticsObserver extends BaseObserver<AnalyticsEvent> {
  private analyticsService: any; // Analytics service (Google Analytics, Mixpanel, etc.)
  private batchSize: number = 10;
  private eventBatch: AnalyticsEvent[] = [];
  private batchTimeout: NodeJS.Timeout | null = null;

  constructor(analyticsService?: any, batchSize: number = 10) {
    super('analytics_observer');
    this.analyticsService = analyticsService;
    this.batchSize = batchSize;
  }

  async update(
    data: AnalyticsEvent, 
    eventType: string, 
    source: IObservable<AnalyticsEvent>
  ): Promise<void> {
    if (!this.isActive()) return;

    const enrichedEvent = this.enrichEvent(data, eventType);
    
    if (this.shouldBatch()) {
      this.addToBatch(enrichedEvent);
    } else {
      await this.trackEvent(enrichedEvent);
    }
  }

  onError(error: Error, eventType: string): void {
    this.log(`Analytics tracking failed for event ${eventType}`, error);
    
    // Track the error as an analytics event
    const errorEvent: AnalyticsEvent = {
      action: 'error',
      category: 'system',
      label: eventType,
      metadata: {
        error: error.message,
        stack: error.stack,
      },
    };
    
    // Don't batch error events, send immediately
    this.trackEvent(errorEvent).catch(console.error);
  }

  private enrichEvent(data: AnalyticsEvent, eventType: string): AnalyticsEvent {
    return {
      ...data,
      metadata: {
        ...data.metadata,
        eventType,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        referrer: typeof document !== 'undefined' ? document.referrer : undefined,
      },
    };
  }

  private shouldBatch(): boolean {
    return this.batchSize > 1;
  }

  private addToBatch(event: AnalyticsEvent): void {
    this.eventBatch.push(event);
    
    if (this.eventBatch.length >= this.batchSize) {
      this.flushBatch();
    } else if (!this.batchTimeout) {
      // Set timeout to flush batch after delay
      this.batchTimeout = setTimeout(() => this.flushBatch(), 5000);
    }
  }

  private async flushBatch(): Promise<void> {
    if (this.eventBatch.length === 0) return;

    const eventsToSend = [...this.eventBatch];
    this.eventBatch = [];
    
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }

    try {
      if (this.analyticsService?.trackBatch) {
        await this.analyticsService.trackBatch(eventsToSend);
      } else {
        // Fallback to individual tracking
        for (const event of eventsToSend) {
          await this.trackEvent(event);
        }
      }
      
      this.log(`Flushed batch of ${eventsToSend.length} analytics events`);
    } catch (error) {
      this.log(`Failed to flush analytics batch`, error);
      // Re-add events to batch for retry (with some limit)
      if (this.eventBatch.length < this.batchSize * 2) {
        this.eventBatch.unshift(...eventsToSend);
      }
    }
  }

  private async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      if (this.analyticsService?.track) {
        await this.analyticsService.track(event);
      } else {
        // Fallback to console logging in development
        if (process.env.NODE_ENV === 'development') {
          console.log('[Analytics]', event);
        }
      }
    } catch (error) {
      this.log(`Failed to track event`, { event, error });
    }
  }

  // Manual flush for cleanup
  async flush(): Promise<void> {
    await this.flushBatch();
  }

  // Get current batch size for monitoring
  getBatchSize(): number {
    return this.eventBatch.length;
  }
}