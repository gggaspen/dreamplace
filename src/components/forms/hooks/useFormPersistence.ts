/**
 * Form Persistence Hook
 *
 * Custom hook that provides form state persistence to localStorage
 * with automatic save/restore functionality and cleanup.
 */

import { useEffect, useRef, useCallback } from 'react';
import { FieldValues, UseFormWatch, UseFormReset } from 'react-hook-form';
import { debounce } from '@/utils/debounce';

// Persistence options
interface PersistenceOptions {
  key: string;
  storage?: Storage;
  debounceMs?: number;
  excludeFields?: string[];
  encryptData?: boolean;
  expiryMinutes?: number;
}

// Stored data interface
interface StoredFormData<T> {
  data: T;
  timestamp: number;
  expiresAt?: number;
}

// Simple encryption/decryption (for basic security, not production-level)
const simpleEncrypt = (data: string): string => {
  return btoa(data);
};

const simpleDecrypt = (data: string): string => {
  try {
    return atob(data);
  } catch {
    return '';
  }
};

export function useFormPersistence<T extends FieldValues>({
  key,
  storage = localStorage,
  debounceMs = 1000,
  excludeFields = [],
  encryptData = false,
  expiryMinutes,
}: PersistenceOptions) {
  const storageKey = `form_${key}`;
  const hasHydrated = useRef(false);

  // Save form data to storage
  const saveToStorage = useCallback(
    (data: T) => {
      try {
        // Filter out excluded fields
        const filteredData = Object.keys(data).reduce((acc, field) => {
          if (!excludeFields.includes(field)) {
            acc[field] = data[field];
          }
          return acc;
        }, {} as Partial<T>);

        const storageData: StoredFormData<Partial<T>> = {
          data: filteredData,
          timestamp: Date.now(),
          expiresAt: expiryMinutes ? Date.now() + expiryMinutes * 60 * 1000 : undefined,
        };

        let serializedData = JSON.stringify(storageData);

        if (encryptData) {
          serializedData = simpleEncrypt(serializedData);
        }

        storage.setItem(storageKey, serializedData);
      } catch (error) {
        console.warn('Failed to save form data to storage:', error);
      }
    },
    [storageKey, excludeFields, encryptData, expiryMinutes, storage]
  );

  // Load form data from storage
  const loadFromStorage = useCallback((): Partial<T> | null => {
    try {
      const stored = storage.getItem(storageKey);
      if (!stored) return null;

      let serializedData = stored;
      if (encryptData) {
        serializedData = simpleDecrypt(stored);
      }

      const storageData: StoredFormData<Partial<T>> = JSON.parse(serializedData);

      // Check if data has expired
      if (storageData.expiresAt && Date.now() > storageData.expiresAt) {
        storage.removeItem(storageKey);
        return null;
      }

      return storageData.data;
    } catch (error) {
      console.warn('Failed to load form data from storage:', error);
      storage.removeItem(storageKey);
      return null;
    }
  }, [storageKey, encryptData, storage]);

  // Clear stored data
  const clearStorage = useCallback(() => {
    try {
      storage.removeItem(storageKey);
    } catch (error) {
      console.warn('Failed to clear form data from storage:', error);
    }
  }, [storageKey, storage]);

  // Create debounced save function
  const debouncedSave = useRef(
    debounce((data: T) => {
      saveToStorage(data);
    }, debounceMs)
  ).current;

  // Restore form data on mount
  const restoreForm = useCallback(
    (reset: UseFormReset<T>) => {
      if (hasHydrated.current) return;

      const savedData = loadFromStorage();
      if (savedData && Object.keys(savedData).length > 0) {
        reset(savedData as T);
      }

      hasHydrated.current = true;
    },
    [loadFromStorage]
  );

  // Watch form changes and save
  const watchAndSave = useCallback(
    (watch: UseFormWatch<T>) => {
      const subscription = watch(data => {
        if (hasHydrated.current) {
          debouncedSave(data as T);
        }
      });

      return subscription;
    },
    [debouncedSave]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return {
    restoreForm,
    watchAndSave,
    clearStorage,
    loadFromStorage,
    saveToStorage,
  };
}
