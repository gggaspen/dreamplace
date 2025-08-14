import { IObserver, IObservable } from './types';

/**
 * Base implementation of the Observer interface
 * Provides common functionality for all observers
 */
export abstract class BaseObserver<T = unknown> implements IObserver<T> {
  public readonly id: string;
  protected isActiveFlag: boolean = true;

  constructor(id?: string) {
    this.id = id || this.generateId();
  }

  abstract update(data: T, eventType: string, source: IObservable<T>): void | Promise<void>;

  onError(error: Error, eventType: string): void {
    console.error(`Observer ${this.id} error for event ${eventType}:`, error);
  }

  isActive(): boolean {
    return this.isActiveFlag;
  }

  activate(): void {
    this.isActiveFlag = true;
  }

  deactivate(): void {
    this.isActiveFlag = false;
  }

  protected generateId(): string {
    return `observer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected log(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Observer ${this.id}] ${message}`, data || '');
    }
  }
}