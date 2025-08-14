import { BaseObserver } from '../BaseObserver';
import { IObservable } from '../types';

export interface StateChangeEvent {
  path: string;
  oldValue: unknown;
  newValue: unknown;
  component?: string;
  action?: string;
}

/**
 * State Observer - monitors application state changes for debugging and persistence
 */
export class StateObserver extends BaseObserver<StateChangeEvent> {
  private stateHistory: Array<StateChangeEvent & { timestamp: Date }> = [];
  private maxHistorySize: number = 50;
  private persistenceService?: any;
  private shouldPersist: boolean = false;

  constructor(
    persistenceService?: any,
    maxHistorySize: number = 50,
    shouldPersist: boolean = false
  ) {
    super('state_observer');
    this.persistenceService = persistenceService;
    this.maxHistorySize = maxHistorySize;
    this.shouldPersist = shouldPersist;
  }

  async update(
    data: StateChangeEvent,
    eventType: string,
    source: IObservable<StateChangeEvent>
  ): Promise<void> {
    if (!this.isActive()) return;

    const timestampedEvent = {
      ...data,
      timestamp: new Date(),
    };

    // Add to history
    this.stateHistory.push(timestampedEvent);

    // Maintain history size
    if (this.stateHistory.length > this.maxHistorySize) {
      this.stateHistory.shift();
    }

    // Log state change in development
    if (process.env.NODE_ENV === 'development') {
      this.logStateChange(timestampedEvent);
    }

    // Persist state if enabled
    if (this.shouldPersist && this.persistenceService) {
      await this.persistState(timestampedEvent);
    }

    // Check for potentially problematic state changes
    this.analyzeStateChange(timestampedEvent);
  }

  onError(error: Error, eventType: string): void {
    this.log(`State observation error for event ${eventType}`, error);
  }

  private logStateChange(event: StateChangeEvent & { timestamp: Date }): void {
    const { path, oldValue, newValue, component, action, timestamp } = event;

    console.group(`🔄 State Change: ${path}`);
    console.log('Timestamp:', timestamp.toISOString());
    console.log('Component:', component || 'Unknown');
    console.log('Action:', action || 'Unknown');
    console.log('Old Value:', oldValue);
    console.log('New Value:', newValue);
    console.groupEnd();
  }

  private async persistState(event: StateChangeEvent & { timestamp: Date }): Promise<void> {
    try {
      if (this.persistenceService?.saveStateChange) {
        await this.persistenceService.saveStateChange(event);
      } else if (typeof window !== 'undefined') {
        // Fallback to localStorage
        const key = `dreamplace_state_${event.path}`;
        localStorage.setItem(
          key,
          JSON.stringify({
            value: event.newValue,
            timestamp: event.timestamp,
          })
        );
      }
    } catch (error) {
      this.log('Failed to persist state change', { event, error });
    }
  }

  private analyzeStateChange(event: StateChangeEvent & { timestamp: Date }): void {
    // Check for rapid state changes (potential performance issue)
    const recentChanges = this.stateHistory.filter(
      e => e.path === event.path && Date.now() - e.timestamp.getTime() < 1000 // Last 1 second
    );

    if (recentChanges.length > 10) {
      console.warn(
        `⚠️ High frequency state changes detected for path: ${event.path}`,
        `${recentChanges.length} changes in the last second`
      );
    }

    // Check for large state objects (potential memory issue)
    const newValueSize = this.getObjectSize(event.newValue);
    if (newValueSize > 1000000) {
      // > 1MB
      console.warn(
        `⚠️ Large state object detected for path: ${event.path}`,
        `Size: ${(newValueSize / 1000000).toFixed(2)}MB`
      );
    }

    // Check for unchanged values (potential unnecessary updates)
    if (this.deepEqual(event.oldValue, event.newValue)) {
      console.warn(
        `⚠️ Unnecessary state update detected for path: ${event.path}`,
        'Old and new values are identical'
      );
    }
  }

  private getObjectSize(obj: unknown): number {
    try {
      return JSON.stringify(obj).length;
    } catch {
      return 0;
    }
  }

  private deepEqual(a: unknown, b: unknown): boolean {
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return a === b;
    }
  }

  // Get state history
  getStateHistory(): Array<StateChangeEvent & { timestamp: Date }> {
    return [...this.stateHistory];
  }

  // Get history for specific path
  getPathHistory(path: string): Array<StateChangeEvent & { timestamp: Date }> {
    return this.stateHistory.filter(event => event.path === path);
  }

  // Clear history
  clearHistory(): void {
    this.stateHistory = [];
  }

  // Get statistics
  getStatistics(): {
    totalChanges: number;
    uniquePaths: number;
    mostChangedPath: string | null;
    avgChangesPerMinute: number;
  } {
    const totalChanges = this.stateHistory.length;
    const uniquePaths = new Set(this.stateHistory.map(e => e.path)).size;

    // Find most changed path
    const pathCounts = this.stateHistory.reduce(
      (acc, event) => {
        acc[event.path] = (acc[event.path] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const mostChangedPath = Object.keys(pathCounts).reduce(
      (max, path) => (pathCounts[path] > (pathCounts[max] || 0) ? path : max),
      null as string | null
    );

    // Calculate average changes per minute
    const oldestTimestamp = this.stateHistory[0]?.timestamp;
    const newestTimestamp = this.stateHistory[this.stateHistory.length - 1]?.timestamp;
    const timeSpanMinutes =
      oldestTimestamp && newestTimestamp
        ? (newestTimestamp.getTime() - oldestTimestamp.getTime()) / (1000 * 60)
        : 0;

    const avgChangesPerMinute = timeSpanMinutes > 0 ? totalChanges / timeSpanMinutes : 0;

    return {
      totalChanges,
      uniquePaths,
      mostChangedPath,
      avgChangesPerMinute,
    };
  }
}
