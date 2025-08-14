/**
 * Observer Pattern Implementation for Event Management
 * 
 * The Observer pattern defines a one-to-many dependency between objects
 * so that when one object changes state, all its dependents are notified
 * and updated automatically.
 */

export interface IObserver<T = unknown> {
  id: string;
  update(data: T, eventType: string, source: IObservable<T>): void | Promise<void>;
  onError?(error: Error, eventType: string): void;
  isActive?(): boolean;
}

export interface IObservable<T = unknown> {
  subscribe(observer: IObserver<T>, eventTypes?: string[]): string;
  unsubscribe(observerId: string): boolean;
  unsubscribeAll(): void;
  notify(data: T, eventType: string): Promise<void>;
  hasObserver(observerId: string): boolean;
  getObserverCount(eventType?: string): number;
}

export interface EventData<T = unknown> {
  type: string;
  payload: T;
  timestamp: Date;
  source?: string;
  metadata?: Record<string, unknown>;
}

export interface ObserverSubscription {
  id: string;
  observer: IObserver;
  eventTypes: string[];
  subscribeTime: Date;
  isActive: boolean;
}

export interface EventManagerConfig {
  maxObservers?: number;
  asyncEvents?: boolean;
  errorHandling?: 'silent' | 'throw' | 'callback';
  enableLogging?: boolean;
}

export enum EventType {
  // UI Events
  COMPONENT_MOUNTED = 'COMPONENT_MOUNTED',
  COMPONENT_UNMOUNTED = 'COMPONENT_UNMOUNTED',
  STATE_CHANGED = 'STATE_CHANGED',
  THEME_CHANGED = 'THEME_CHANGED',
  
  // Data Events
  DATA_LOADED = 'DATA_LOADED',
  DATA_ERROR = 'DATA_ERROR',
  CACHE_UPDATED = 'CACHE_UPDATED',
  API_REQUEST = 'API_REQUEST',
  API_RESPONSE = 'API_RESPONSE',
  
  // User Events
  USER_ACTION = 'USER_ACTION',
  NAVIGATION = 'NAVIGATION',
  MEDIA_PLAY = 'MEDIA_PLAY',
  MEDIA_PAUSE = 'MEDIA_PAUSE',
  
  // System Events
  ERROR_OCCURRED = 'ERROR_OCCURRED',
  PERFORMANCE_METRIC = 'PERFORMANCE_METRIC',
  ANALYTICS_EVENT = 'ANALYTICS_EVENT',
  LOG_MESSAGE = 'LOG_MESSAGE',
}