import { EventManager } from '@/patterns/observer/EventManager';
import { BaseObserver } from '@/patterns/observer/BaseObserver';
import { IObservable } from '@/patterns/observer/types';

// Mock observer for testing
class MockObserver extends BaseObserver<string> {
  public updateCallCount = 0;
  public lastEventType = '';
  public lastData = '';
  public shouldThrowError = false;

  update(data: string, eventType: string, source: IObservable<string>): void {
    if (this.shouldThrowError) {
      throw new Error('Mock observer error');
    }
    
    this.updateCallCount++;
    this.lastEventType = eventType;
    this.lastData = data;
  }

  onError(error: Error, eventType: string): void {
    console.log(`Mock observer error for ${eventType}: ${error.message}`);
  }

  reset(): void {
    this.updateCallCount = 0;
    this.lastEventType = '';
    this.lastData = '';
    this.shouldThrowError = false;
  }
}

describe('EventManager', () => {
  let eventManager: EventManager<string>;
  let observer1: MockObserver;
  let observer2: MockObserver;

  beforeEach(() => {
    eventManager = new EventManager<string>({
      maxObservers: 10,
      asyncEvents: true,
      errorHandling: 'callback',
      enableLogging: false,
    });
    
    observer1 = new MockObserver('observer1');
    observer2 = new MockObserver('observer2');
  });

  describe('subscribe', () => {
    it('should subscribe observer to events', () => {
      const observerId = eventManager.subscribe(observer1, ['test-event']);
      
      expect(observerId).toBe(observer1.id);
      expect(eventManager.hasObserver(observer1.id)).toBe(true);
      expect(eventManager.getObserverCount('test-event')).toBe(1);
    });

    it('should subscribe observer to all events with wildcard', () => {
      eventManager.subscribe(observer1, ['*']);
      
      expect(eventManager.getObserverCount('*')).toBe(1);
    });

    it('should throw error when max observers exceeded', () => {
      const smallEventManager = new EventManager({ maxObservers: 1 });
      
      smallEventManager.subscribe(observer1, ['test']);
      
      expect(() => {
        smallEventManager.subscribe(observer2, ['test']);
      }).toThrow('Maximum number of observers reached: 1');
    });

    it('should allow multiple event types for one observer', () => {
      eventManager.subscribe(observer1, ['event1', 'event2', 'event3']);
      
      expect(eventManager.getObserverCount('event1')).toBe(1);
      expect(eventManager.getObserverCount('event2')).toBe(1);
      expect(eventManager.getObserverCount('event3')).toBe(1);
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe observer', () => {
      eventManager.subscribe(observer1, ['test-event']);
      
      expect(eventManager.hasObserver(observer1.id)).toBe(true);
      
      const result = eventManager.unsubscribe(observer1.id);
      
      expect(result).toBe(true);
      expect(eventManager.hasObserver(observer1.id)).toBe(false);
      expect(eventManager.getObserverCount('test-event')).toBe(0);
    });

    it('should return false for non-existent observer', () => {
      const result = eventManager.unsubscribe('non-existent-id');
      expect(result).toBe(false);
    });

    it('should unsubscribe all observers', () => {
      eventManager.subscribe(observer1, ['test-event']);
      eventManager.subscribe(observer2, ['test-event']);
      
      expect(eventManager.getObserverCount()).toBe(2);
      
      eventManager.unsubscribeAll();
      
      expect(eventManager.getObserverCount()).toBe(0);
    });
  });

  describe('notify', () => {
    it('should notify subscribed observers', async () => {
      eventManager.subscribe(observer1, ['test-event']);
      eventManager.subscribe(observer2, ['test-event']);
      
      await eventManager.notify('test-data', 'test-event');
      
      expect(observer1.updateCallCount).toBe(1);
      expect(observer1.lastEventType).toBe('test-event');
      expect(observer1.lastData).toBe('test-data');
      
      expect(observer2.updateCallCount).toBe(1);
      expect(observer2.lastEventType).toBe('test-event');
      expect(observer2.lastData).toBe('test-data');
    });

    it('should notify wildcard observers', async () => {
      eventManager.subscribe(observer1, ['*']);
      eventManager.subscribe(observer2, ['specific-event']);
      
      await eventManager.notify('test-data', 'any-event');
      
      expect(observer1.updateCallCount).toBe(1);
      expect(observer2.updateCallCount).toBe(0);
      
      await eventManager.notify('test-data', 'specific-event');
      
      expect(observer1.updateCallCount).toBe(2);
      expect(observer2.updateCallCount).toBe(1);
    });

    it('should handle observer errors gracefully', async () => {
      observer1.shouldThrowError = true;
      eventManager.subscribe(observer1, ['test-event']);
      eventManager.subscribe(observer2, ['test-event']);
      
      // Should not throw, even though observer1 throws an error
      await expect(eventManager.notify('test-data', 'test-event')).resolves.not.toThrow();
      
      // observer2 should still be notified despite observer1's error
      expect(observer2.updateCallCount).toBe(1);
    });

    it('should not notify inactive observers', async () => {
      eventManager.subscribe(observer1, ['test-event']);
      observer1.deactivate();
      
      await eventManager.notify('test-data', 'test-event');
      
      expect(observer1.updateCallCount).toBe(0);
    });
  });

  describe('emit (alias for notify)', () => {
    it('should work as alias for notify', async () => {
      eventManager.subscribe(observer1, ['test-event']);
      
      await eventManager.emit('test-event', 'test-data');
      
      expect(observer1.updateCallCount).toBe(1);
      expect(observer1.lastEventType).toBe('test-event');
      expect(observer1.lastData).toBe('test-data');
    });
  });

  describe('event history', () => {
    it('should maintain event history', async () => {
      await eventManager.notify('data1', 'event1');
      await eventManager.notify('data2', 'event2');
      
      const history = eventManager.getEventHistory();
      
      expect(history).toHaveLength(2);
      expect(history[0].type).toBe('event1');
      expect(history[0].payload).toBe('data1');
      expect(history[1].type).toBe('event2');
      expect(history[1].payload).toBe('data2');
    });
  });

  describe('createEmitter', () => {
    it('should create event-specific emitter function', async () => {
      const testEmitter = eventManager.createEmitter('test-event');
      eventManager.subscribe(observer1, ['test-event']);
      
      await testEmitter('test-data');
      
      expect(observer1.updateCallCount).toBe(1);
      expect(observer1.lastEventType).toBe('test-event');
      expect(observer1.lastData).toBe('test-data');
    });
  });

  describe('getActiveSubscriptions', () => {
    it('should return active subscriptions', () => {
      eventManager.subscribe(observer1, ['event1', 'event2']);
      eventManager.subscribe(observer2, ['event3']);
      
      const subscriptions = eventManager.getActiveSubscriptions();
      
      expect(subscriptions).toHaveLength(2);
      expect(subscriptions[0].observer.id).toBe(observer1.id);
      expect(subscriptions[1].observer.id).toBe(observer2.id);
    });
  });
});