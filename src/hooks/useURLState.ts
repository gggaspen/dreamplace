/**
 * URL State Hook
 * React hook for managing state synchronized with URL parameters
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  URLStateConfig,
  URLStateConfigs,
  urlStateManager,
} from '@/infrastructure/routing/URLStateManager';

/**
 * Hook for managing a single URL parameter as React state
 */
export function useURLState<T>(config: URLStateConfig<T>): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => urlStateManager.getParam(config));

  useEffect(() => {
    // Update state when URL changes (e.g., browser back/forward)
    const handlePopState = () => {
      setState(urlStateManager.getParam(config));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [config]);

  const setValue = useCallback(
    (value: T) => {
      setState(value);
      urlStateManager.setParam(config, value);
    },
    [config]
  );

  return [state, setValue];
}

/**
 * Hook for managing multiple URL parameters
 */
export function useURLStateMultiple<T extends Record<string, any>>(configs: {
  [K in keyof T]: URLStateConfig<T[K]>;
}): [T, (updates: Partial<T>) => void] {
  const [state, setState] = useState<T>(() => {
    const initialState = {} as T;
    for (const key in configs) {
      initialState[key] = urlStateManager.getParam(configs[key]);
    }
    return initialState;
  });

  useEffect(() => {
    const handlePopState = () => {
      const newState = {} as T;
      for (const key in configs) {
        newState[key] = urlStateManager.getParam(configs[key]);
      }
      setState(newState);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [configs]);

  const setValues = useCallback(
    (updates: Partial<T>) => {
      setState(prev => ({ ...prev, ...updates }));

      const urlUpdates = Object.entries(updates).map(([key, value]) => ({
        config: configs[key as keyof T],
        value,
      }));

      urlStateManager.updateParams(urlUpdates);
    },
    [configs]
  );

  return [state, setValues];
}

/**
 * Convenience hooks for common parameter types
 */
export function useURLString(
  paramName: string,
  defaultValue: string = ''
): [string, (value: string) => void] {
  return useURLState(URLStateConfigs.string(paramName, defaultValue));
}

export function useURLNumber(
  paramName: string,
  defaultValue: number = 0
): [number, (value: number) => void] {
  return useURLState(URLStateConfigs.number(paramName, defaultValue));
}

export function useURLBoolean(
  paramName: string,
  defaultValue: boolean = false
): [boolean, (value: boolean) => void] {
  return useURLState(URLStateConfigs.boolean(paramName, defaultValue));
}

export function useURLArray<T>(
  paramName: string,
  defaultValue: T[] = [],
  itemSerializer?: (item: T) => string,
  itemDeserializer?: (value: string) => T
): [T[], (value: T[]) => void] {
  return useURLState(
    URLStateConfigs.array(paramName, defaultValue, itemSerializer, itemDeserializer)
  );
}

export function useURLDate(
  paramName: string,
  defaultValue: Date = new Date()
): [Date, (value: Date) => void] {
  return useURLState(URLStateConfigs.date(paramName, defaultValue));
}

/**
 * Hook for pagination state in URL
 */
export interface PaginationState {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useURLPagination(
  defaults: PaginationState = { page: 1, limit: 10 }
): [PaginationState, (updates: Partial<PaginationState>) => void] {
  const configs = {
    page: URLStateConfigs.number('page', defaults.page),
    limit: URLStateConfigs.number('limit', defaults.limit),
    sortBy: URLStateConfigs.string('sortBy', defaults.sortBy || ''),
    sortOrder: URLStateConfigs.string('sortOrder', defaults.sortOrder || 'asc'),
  };

  const [state, setState] = useURLStateMultiple(configs);

  const updatePagination = useCallback(
    (updates: Partial<PaginationState>) => {
      // Reset to page 1 when changing sort or limit
      if (
        updates.sortBy !== undefined ||
        updates.sortOrder !== undefined ||
        updates.limit !== undefined
      ) {
        updates.page = 1;
      }
      setState(updates);
    },
    [setState]
  );

  return [state, updatePagination];
}

/**
 * Hook for filter state in URL
 */
export function useURLFilters<T extends Record<string, any>>(filterConfigs: {
  [K in keyof T]: URLStateConfig<T[K]>;
}): [T, (updates: Partial<T>) => void, () => void] {
  const [filters, setFilters] = useURLStateMultiple(filterConfigs);

  const clearFilters = useCallback(() => {
    const defaultFilters = {} as T;
    for (const key in filterConfigs) {
      defaultFilters[key] = filterConfigs[key].defaultValue;
    }
    setFilters(defaultFilters);
  }, [filterConfigs, setFilters]);

  return [filters, setFilters, clearFilters];
}

/**
 * Hook for search state with debouncing
 */
export function useURLSearch(
  paramName: string = 'search',
  defaultValue: string = '',
  debounceMs: number = 300
): [string, (value: string) => void, string] {
  const [urlValue, setURLValue] = useURLString(paramName, defaultValue);
  const [localValue, setLocalValue] = useState(urlValue);

  useEffect(() => {
    setLocalValue(urlValue);
  }, [urlValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== urlValue) {
        setURLValue(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, urlValue, setURLValue, debounceMs]);

  return [localValue, setLocalValue, urlValue];
}
