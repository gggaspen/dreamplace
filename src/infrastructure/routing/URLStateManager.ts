/**
 * URL State Manager
 * Manages application state synchronization with URL parameters
 */

export interface URLStateConfig<T> {
  paramName: string;
  defaultValue: T;
  serialize: (value: T) => string;
  deserialize: (value: string) => T;
  validate?: (value: T) => boolean;
}

export class URLStateManager {
  private static instance: URLStateManager;
  private listeners: Map<string, Set<(value: any) => void>> = new Map();

  private constructor() {}

  static getInstance(): URLStateManager {
    if (!URLStateManager.instance) {
      URLStateManager.instance = new URLStateManager();
    }
    return URLStateManager.instance;
  }

  /**
   * Get URL parameter value with type safety
   */
  getParam<T>(config: URLStateConfig<T>): T {
    if (typeof window === 'undefined') return config.defaultValue;

    const urlParams = new URLSearchParams(window.location.search);
    const rawValue = urlParams.get(config.paramName);

    if (!rawValue) return config.defaultValue;

    try {
      const deserializedValue = config.deserialize(rawValue);

      if (config.validate && !config.validate(deserializedValue)) {
        return config.defaultValue;
      }

      return deserializedValue;
    } catch (error) {
      console.warn(`Failed to deserialize URL parameter ${config.paramName}:`, error);
      return config.defaultValue;
    }
  }

  /**
   * Set URL parameter value
   */
  setParam<T>(config: URLStateConfig<T>, value: T, options: { replace?: boolean } = {}): void {
    if (typeof window === 'undefined') return;

    try {
      if (config.validate && !config.validate(value)) {
        console.warn(`Invalid value for URL parameter ${config.paramName}:`, value);
        return;
      }

      const serializedValue = config.serialize(value);
      const url = new URL(window.location.href);

      if (serializedValue === config.serialize(config.defaultValue)) {
        // Remove parameter if it's the default value
        url.searchParams.delete(config.paramName);
      } else {
        url.searchParams.set(config.paramName, serializedValue);
      }

      const method = options.replace ? 'replaceState' : 'pushState';
      window.history[method]({}, '', url.toString());

      // Notify listeners
      this.notifyListeners(config.paramName, value);
    } catch (error) {
      console.error(`Failed to set URL parameter ${config.paramName}:`, error);
    }
  }

  /**
   * Subscribe to parameter changes
   */
  subscribe<T>(paramName: string, callback: (value: T) => void): () => void {
    if (!this.listeners.has(paramName)) {
      this.listeners.set(paramName, new Set());
    }

    this.listeners.get(paramName)!.add(callback);

    // Return unsubscribe function
    return () => {
      const paramListeners = this.listeners.get(paramName);
      if (paramListeners) {
        paramListeners.delete(callback);
        if (paramListeners.size === 0) {
          this.listeners.delete(paramName);
        }
      }
    };
  }

  /**
   * Update multiple parameters at once
   */
  updateParams(
    updates: Array<{ config: URLStateConfig<any>; value: any }>,
    options: { replace?: boolean } = {}
  ): void {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);

    updates.forEach(({ config, value }) => {
      try {
        if (config.validate && !config.validate(value)) {
          console.warn(`Invalid value for URL parameter ${config.paramName}:`, value);
          return;
        }

        const serializedValue = config.serialize(value);

        if (serializedValue === config.serialize(config.defaultValue)) {
          url.searchParams.delete(config.paramName);
        } else {
          url.searchParams.set(config.paramName, serializedValue);
        }

        // Notify listeners
        this.notifyListeners(config.paramName, value);
      } catch (error) {
        console.error(`Failed to update URL parameter ${config.paramName}:`, error);
      }
    });

    const method = options.replace ? 'replaceState' : 'pushState';
    window.history[method]({}, '', url.toString());
  }

  /**
   * Clear all URL parameters
   */
  clearParams(options: { replace?: boolean } = {}): void {
    if (typeof window === 'undefined') return;

    const url = new URL(window.location.href);
    url.search = '';

    const method = options.replace ? 'replaceState' : 'pushState';
    window.history[method]({}, '', url.toString());
  }

  private notifyListeners(paramName: string, value: any): void {
    const listeners = this.listeners.get(paramName);
    if (listeners) {
      listeners.forEach(callback => callback(value));
    }
  }
}

// Common URL state configurations
export const URLStateConfigs = {
  // String parameter
  string: (paramName: string, defaultValue: string = ''): URLStateConfig<string> => ({
    paramName,
    defaultValue,
    serialize: value => value,
    deserialize: value => value,
    validate: value => typeof value === 'string',
  }),

  // Number parameter
  number: (paramName: string, defaultValue: number = 0): URLStateConfig<number> => ({
    paramName,
    defaultValue,
    serialize: value => value.toString(),
    deserialize: value => Number(value),
    validate: value => typeof value === 'number' && !isNaN(value),
  }),

  // Boolean parameter
  boolean: (paramName: string, defaultValue: boolean = false): URLStateConfig<boolean> => ({
    paramName,
    defaultValue,
    serialize: value => (value ? 'true' : 'false'),
    deserialize: value => value === 'true',
    validate: value => typeof value === 'boolean',
  }),

  // Array parameter
  array: <T>(
    paramName: string,
    defaultValue: T[] = [],
    itemSerializer: (item: T) => string = item => String(item),
    itemDeserializer: (value: string) => T = value => value as T
  ): URLStateConfig<T[]> => ({
    paramName,
    defaultValue,
    serialize: value => value.map(itemSerializer).join(','),
    deserialize: value => (value ? value.split(',').map(itemDeserializer) : []),
    validate: value => Array.isArray(value),
  }),

  // JSON parameter (for complex objects)
  json: <T>(paramName: string, defaultValue: T): URLStateConfig<T> => ({
    paramName,
    defaultValue,
    serialize: value => btoa(JSON.stringify(value)),
    deserialize: value => JSON.parse(atob(value)),
    validate: value => value !== null && value !== undefined,
  }),

  // Date parameter
  date: (paramName: string, defaultValue: Date = new Date()): URLStateConfig<Date> => ({
    paramName,
    defaultValue,
    serialize: value => value.toISOString(),
    deserialize: value => new Date(value),
    validate: value => value instanceof Date && !isNaN(value.getTime()),
  }),
};

// Singleton instance
export const urlStateManager = URLStateManager.getInstance();
