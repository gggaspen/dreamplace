/**
 * Offline-first Data Synchronization Hook
 * 
 * Provides offline-first functionality with background sync,
 * optimistic updates, and conflict resolution.
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { useApolloClient, ApolloCache } from '@apollo/client';

// Offline sync status
export type SyncStatus = 'online' | 'offline' | 'syncing' | 'error';

// Pending operation
interface PendingOperation {
  id: string;
  type: 'mutation' | 'query';
  operation: any;
  variables: any;
  timestamp: number;
  retryCount: number;
}

// Offline sync hook
export function useOfflineSync() {
  const client = useApolloClient();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('online');
  const [pendingOperations, setPendingOperations] = useState<PendingOperation[]>([]);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  
  const syncQueue = useRef<PendingOperation[]>([]);
  const isOnline = useRef(navigator?.onLine ?? true);

  // Check online status
  const updateOnlineStatus = useCallback(() => {
    const online = navigator?.onLine ?? true;
    isOnline.current = online;
    setSyncStatus(online ? 'online' : 'offline');
    
    if (online && syncQueue.current.length > 0) {
      syncPendingOperations();
    }
  }, []);

  // Add operation to sync queue
  const queueOperation = useCallback((operation: Omit<PendingOperation, 'id' | 'timestamp' | 'retryCount'>) => {
    const pendingOp: PendingOperation = {
      ...operation,
      id: `${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
      retryCount: 0,
    };
    
    syncQueue.current.push(pendingOp);
    setPendingOperations([...syncQueue.current]);
    
    // Store in localStorage for persistence
    localStorage.setItem('apollo_offline_queue', JSON.stringify(syncQueue.current));
  }, []);

  // Sync pending operations
  const syncPendingOperations = useCallback(async () => {
    if (!isOnline.current || syncQueue.current.length === 0) return;
    
    setSyncStatus('syncing');
    const operations = [...syncQueue.current];
    
    for (const operation of operations) {
      try {
        if (operation.type === 'mutation') {
          await client.mutate({
            mutation: operation.operation,
            variables: operation.variables,
          });
        } else {
          await client.query({
            query: operation.operation,
            variables: operation.variables,
            fetchPolicy: 'network-only',
          });
        }
        
        // Remove successful operation
        syncQueue.current = syncQueue.current.filter(op => op.id !== operation.id);
      } catch (error) {
        console.error('Sync error for operation:', operation.id, error);
        
        // Increment retry count
        const opIndex = syncQueue.current.findIndex(op => op.id === operation.id);
        if (opIndex >= 0) {
          syncQueue.current[opIndex].retryCount += 1;
          
          // Remove after max retries
          if (syncQueue.current[opIndex].retryCount >= 3) {
            syncQueue.current.splice(opIndex, 1);
          }
        }
      }
    }
    
    setPendingOperations([...syncQueue.current]);
    localStorage.setItem('apollo_offline_queue', JSON.stringify(syncQueue.current));
    setLastSyncTime(new Date());
    setSyncStatus(isOnline.current ? 'online' : 'offline');
  }, [client]);

  // Load queue from localStorage
  const loadPersistedQueue = useCallback(() => {
    try {
      const stored = localStorage.getItem('apollo_offline_queue');
      if (stored) {
        const operations = JSON.parse(stored);
        syncQueue.current = operations;
        setPendingOperations(operations);
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }, []);

  // Clear queue
  const clearQueue = useCallback(() => {
    syncQueue.current = [];
    setPendingOperations([]);
    localStorage.removeItem('apollo_offline_queue');
  }, []);

  // Setup event listeners
  useEffect(() => {
    loadPersistedQueue();
    updateOnlineStatus();
    
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [updateOnlineStatus, loadPersistedQueue]);

  return {
    syncStatus,
    pendingOperations,
    lastSyncTime,
    queueOperation,
    syncPendingOperations,
    clearQueue,
    isOnline: isOnline.current,
  };
}

// Background refresh hook
export function useBackgroundRefresh() {
  const client = useApolloClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshQueries = useCallback(async (queryNames?: string[]) => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      if (queryNames) {
        // Refresh specific queries
        await Promise.all(
          queryNames.map(name => 
            client.refetchQueries({
              include: [name],
            })
          )
        );
      } else {
        // Refresh all active queries
        await client.refetchQueries({
          include: 'active',
        });
      }
    } catch (error) {
      console.error('Background refresh error:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [client, isRefreshing]);

  const startBackgroundRefresh = useCallback((intervalMs: number = 300000) => { // 5 minutes
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (navigator.onLine && !document.hidden) {
        refreshQueries();
      }
    }, intervalMs);
  }, [refreshQueries]);

  const stopBackgroundRefresh = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopBackgroundRefresh();
    };
  }, [stopBackgroundRefresh]);

  return {
    isRefreshing,
    refreshQueries,
    startBackgroundRefresh,
    stopBackgroundRefresh,
  };
}