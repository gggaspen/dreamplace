/**
 * Auto-save Hook for Forms
 * 
 * Custom hook that provides automatic form saving functionality
 * with configurable triggers, debouncing, and error handling.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { FieldValues, UseFormWatch } from 'react-hook-form';
import { debounce } from 'lodash';

// Auto-save status
export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// Auto-save options
interface AutoSaveOptions<T extends FieldValues> {
  onSave: (data: T) => Promise<void> | void;
  debounceMs?: number;
  enabled?: boolean;
  saveOnMount?: boolean;
  saveOnBlur?: boolean;
  excludeFields?: (keyof T)[];
  trigger?: 'change' | 'blur' | 'manual';
  onError?: (error: Error) => void;
  onSuccess?: (data: T) => void;
}

// Auto-save state
interface AutoSaveState {
  status: AutoSaveStatus;
  lastSaved: Date | null;
  error: Error | null;
  saveCount: number;
}

export function useAutoSave<T extends FieldValues>({
  onSave,
  debounceMs = 2000,
  enabled = true,
  saveOnMount = false,
  saveOnBlur = false,
  excludeFields = [],
  trigger = 'change',
  onError,
  onSuccess,
}: AutoSaveOptions<T>) {
  const [state, setState] = useState<AutoSaveState>({
    status: 'idle',
    lastSaved: null,
    error: null,
    saveCount: 0,
  });

  const previousDataRef = useRef<T | null>(null);
  const isSavingRef = useRef(false);
  const mountedRef = useRef(false);

  // Filter out excluded fields
  const filterData = useCallback((data: T): Partial<T> => {
    const filtered = { ...data };
    excludeFields.forEach(field => {
      delete filtered[field];
    });
    return filtered;
  }, [excludeFields]);

  // Check if data has changed
  const hasDataChanged = useCallback((newData: T): boolean => {
    if (!previousDataRef.current) return true;
    
    const filteredNew = filterData(newData);
    const filteredPrevious = filterData(previousDataRef.current);
    
    return JSON.stringify(filteredNew) !== JSON.stringify(filteredPrevious);
  }, [filterData]);

  // Perform save operation
  const performSave = useCallback(async (data: T) => {
    if (!enabled || isSavingRef.current || !hasDataChanged(data)) {
      return;
    }

    isSavingRef.current = true;
    setState(prev => ({ ...prev, status: 'saving', error: null }));

    try {
      await onSave(data);
      
      setState(prev => ({
        ...prev,
        status: 'saved',
        lastSaved: new Date(),
        saveCount: prev.saveCount + 1,
        error: null,
      }));

      previousDataRef.current = { ...data };
      onSuccess?.(data);

      // Reset status to idle after a delay
      setTimeout(() => {
        setState(prev => prev.status === 'saved' ? { ...prev, status: 'idle' } : prev);
      }, 2000);

    } catch (error) {
      const saveError = error instanceof Error ? error : new Error('Save failed');
      
      setState(prev => ({
        ...prev,
        status: 'error',
        error: saveError,
      }));

      onError?.(saveError);
    } finally {
      isSavingRef.current = false;
    }
  }, [enabled, hasDataChanged, onSave, onSuccess, onError]);

  // Create debounced save function
  const debouncedSave = useRef(
    debounce((data: T) => {
      performSave(data);
    }, debounceMs)
  ).current;

  // Manual save function
  const saveNow = useCallback((data: T) => {
    debouncedSave.cancel();
    performSave(data);
  }, [performSave, debouncedSave]);

  // Watch form changes for auto-save
  const watchAndAutoSave = useCallback((watch: UseFormWatch<T>) => {
    if (!enabled || trigger === 'manual') return;

    const subscription = watch((data) => {
      if (!mountedRef.current && !saveOnMount) {
        mountedRef.current = true;
        previousDataRef.current = data as T;
        return;
      }

      if (trigger === 'change') {
        debouncedSave(data as T);
      }
    });

    return subscription;
  }, [enabled, trigger, saveOnMount, debouncedSave]);

  // Handle blur events
  const handleBlur = useCallback((data: T) => {
    if (enabled && saveOnBlur) {
      debouncedSave.cancel();
      performSave(data);
    }
  }, [enabled, saveOnBlur, debouncedSave, performSave]);

  // Cancel pending saves
  const cancelSave = useCallback(() => {
    debouncedSave.cancel();
    isSavingRef.current = false;
    setState(prev => prev.status === 'saving' ? { ...prev, status: 'idle' } : prev);
  }, [debouncedSave]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  // Reset error state when data changes
  useEffect(() => {
    if (state.error && state.status === 'error') {
      const timer = setTimeout(() => {
        setState(prev => prev.status === 'error' ? { ...prev, status: 'idle', error: null } : prev);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state.error, state.status]);

  return {
    // State
    status: state.status,
    lastSaved: state.lastSaved,
    error: state.error,
    saveCount: state.saveCount,
    isSaving: state.status === 'saving',
    
    // Actions
    saveNow,
    cancelSave,
    watchAndAutoSave,
    handleBlur,
    
    // Status checks
    isIdle: state.status === 'idle',
    isSaved: state.status === 'saved',
    hasError: state.status === 'error',
  };
}