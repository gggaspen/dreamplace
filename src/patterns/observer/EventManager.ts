import {
  IObserver,
  IObservable,
  ObserverSubscription,
  EventManagerConfig,
  EventData,
} from './types';

/**
 * Event Manager - Central event bus implementing Observer pattern
 * Manages subscriptions and notifications across the application
 */
export class EventManager<T = unknown> implements IObservable<T> {
  private subscriptions: Map<string, ObserverSubscription> = new Map();
  private eventTypeMap: Map<string, Set<string>> = new Map();
  private config: Required<EventManagerConfig>;
  private eventHistory: EventData<T>[] = [];
  private readonly maxHistorySize = 100;

  constructor(config: EventManagerConfig = {}) {
    this.config = {
      maxObservers: 1000,
      asyncEvents: true,
      errorHandling: 'callback',
      enableLogging: false,
      ...config,
    };
  }

  subscribe(observer: IObserver<T>, eventTypes: string[] = ['*']): string {
    if (this.subscriptions.size >= this.config.maxObservers) {
      throw new Error(`Maximum number of observers reached: ${this.config.maxObservers}`);
    }

    const subscription: ObserverSubscription = {
      id: observer.id,
      observer,
      eventTypes,
      subscribeTime: new Date(),
      isActive: true,
    };

    this.subscriptions.set(observer.id, subscription);

    // Update event type mapping
    eventTypes.forEach(eventType => {
      if (!this.eventTypeMap.has(eventType)) {
        this.eventTypeMap.set(eventType, new Set());
      }
      this.eventTypeMap.get(eventType)!.add(observer.id);
    });

    this.log(`Observer ${observer.id} subscribed to events: ${eventTypes.join(', ')}`);
    return observer.id;
  }

  unsubscribe(observerId: string): boolean {
    const subscription = this.subscriptions.get(observerId);
    if (!subscription) {
      return false;
    }

    // Remove from event type mappings
    subscription.eventTypes.forEach(eventType => {
      const observers = this.eventTypeMap.get(eventType);
      if (observers) {
        observers.delete(observerId);
        if (observers.size === 0) {
          this.eventTypeMap.delete(eventType);
        }
      }
    });

    this.subscriptions.delete(observerId);
    this.log(`Observer ${observerId} unsubscribed`);
    return true;
  }

  unsubscribeAll(): void {
    this.subscriptions.clear();
    this.eventTypeMap.clear();
    this.log('All observers unsubscribed');
  }

  async notify(data: T, eventType: string): Promise<void> {
    const eventData: EventData<T> = {
      type: eventType,
      payload: data,
      timestamp: new Date(),
      source: 'EventManager',
    };

    // Add to history
    this.addToHistory(eventData);

    // Get observers for this event type and wildcard observers
    const observerIds = new Set<string>();

    // Add observers subscribed to this specific event type
    const typeObservers = this.eventTypeMap.get(eventType);
    if (typeObservers) {
      typeObservers.forEach(id => observerIds.add(id));
    }

    // Add wildcard observers
    const wildcardObservers = this.eventTypeMap.get('*');
    if (wildcardObservers) {
      wildcardObservers.forEach(id => observerIds.add(id));
    }

    this.log(`Notifying ${observerIds.size} observers for event: ${eventType}`);

    // Notify all relevant observers
    const notificationPromises = Array.from(observerIds)
      .map(id => this.subscriptions.get(id))
      .filter(
        (subscription): subscription is ObserverSubscription =>
          subscription !== undefined &&
          subscription.isActive &&
          subscription.observer.isActive?.() !== false
      )
      .map(subscription => this.notifyObserver(subscription.observer, data, eventType));

    if (this.config.asyncEvents) {
      // Handle errors individually to prevent one failing observer from stopping others
      await Promise.allSettled(notificationPromises);
    } else {
      // Synchronous notification
      for (const promise of notificationPromises) {
        try {
          await promise;
        } catch (error) {
          this.handleError(error as Error, eventType);
        }
      }
    }
  }

  hasObserver(observerId: string): boolean {
    return this.subscriptions.has(observerId);
  }

  getObserverCount(eventType?: string): number {
    if (!eventType) {
      return this.subscriptions.size;
    }

    const observers = this.eventTypeMap.get(eventType);
    return observers ? observers.size : 0;
  }

  getEventHistory(): EventData<T>[] {
    return [...this.eventHistory];
  }

  getActiveSubscriptions(): ObserverSubscription[] {
    return Array.from(this.subscriptions.values()).filter(sub => sub.isActive);
  }

  // Helper method to emit events (alias for notify)
  async emit(eventType: string, data: T): Promise<void> {
    return this.notify(data, eventType);
  }

  // Helper method to create event-specific emitters
  createEmitter<K>(eventType: string) {
    return (data: K) => this.notify(data as T, eventType);
  }

  private async notifyObserver(observer: IObserver<T>, data: T, eventType: string): Promise<void> {
    try {
      const result = observer.update(data, eventType, this);
      if (result instanceof Promise) {
        await result;
      }
    } catch (error) {
      this.handleObserverError(observer, error as Error, eventType);
    }
  }

  private handleObserverError(observer: IObserver<T>, error: Error, eventType: string): void {
    try {
      observer.onError?.(error, eventType);
    } catch (onErrorError) {
      console.error(`Observer ${observer.id} onError handler failed:`, onErrorError);
    }

    this.handleError(error, eventType, observer.id);
  }

  private handleError(error: Error, eventType: string, observerId?: string): void {
    const errorMessage = `Error in event notification${observerId ? ` for observer ${observerId}` : ''} (${eventType}): ${error.message}`;

    switch (this.config.errorHandling) {
      case 'silent':
        // Do nothing
        break;
      case 'throw':
        throw new Error(errorMessage);
      case 'callback':
        console.error(errorMessage, error);
        break;
    }
  }

  private addToHistory(eventData: EventData<T>): void {
    this.eventHistory.push(eventData);

    // Maintain history size
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }
  }

  private log(message: string): void {
    if (this.config.enableLogging) {
      console.log(`[EventManager] ${message}`);
    }
  }
}
