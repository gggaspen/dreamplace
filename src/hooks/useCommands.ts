import { useCallback, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CommandInvoker, 
  CommandFactory, 
  ICommand, 
  CommandResult, 
  CommandType,
  NavigationPayload,
  ThemePayload,
  MediaPayload,
  DataPayload 
} from '@/patterns/command';

/**
 * React hook for command pattern integration
 * Provides an easy way to execute commands with undo/redo support
 */
export function useCommands() {
  const router = useRouter();
  const invokerRef = useRef<CommandInvoker>();
  const factoryRef = useRef<CommandFactory>();

  // Initialize command infrastructure
  useEffect(() => {
    if (!invokerRef.current) {
      invokerRef.current = new CommandInvoker();
    }
    
    if (!factoryRef.current) {
      factoryRef.current = new CommandFactory();
      
      // Register dependencies
      factoryRef.current.registerDependency('router', router);
      
      // Theme manager would be registered here when available
      // factoryRef.current.registerDependency('themeManager', themeManager);
      
      // Media player would be registered here when available
      // factoryRef.current.registerDependency('mediaPlayer', mediaPlayer);
      
      // Data service would be registered here when available
      // factoryRef.current.registerDependency('dataService', dataService);
    }
  }, [router]);

  // Execute a command
  const execute = useCallback(async <T>(
    type: CommandType,
    payload: unknown,
    context?: Record<string, unknown>
  ): Promise<CommandResult<T>> => {
    if (!invokerRef.current || !factoryRef.current) {
      throw new Error('Command infrastructure not initialized');
    }

    const command = factoryRef.current.createCommand<T>(type, payload, context);
    return invokerRef.current.execute(command);
  }, []);

  // Execute a raw command object
  const executeCommand = useCallback(async <T>(
    command: ICommand<T>
  ): Promise<CommandResult<T>> => {
    if (!invokerRef.current) {
      throw new Error('Command invoker not initialized');
    }

    return invokerRef.current.execute(command);
  }, []);

  // Undo last command
  const undo = useCallback(async (): Promise<void> => {
    if (!invokerRef.current) {
      throw new Error('Command invoker not initialized');
    }

    await invokerRef.current.undo();
  }, []);

  // Redo last undone command
  const redo = useCallback(async (): Promise<void> => {
    if (!invokerRef.current) {
      throw new Error('Command invoker not initialized');
    }

    await invokerRef.current.redo();
  }, []);

  // Check if undo is available
  const canUndo = useCallback((): boolean => {
    return invokerRef.current?.canUndo() ?? false;
  }, []);

  // Check if redo is available
  const canRedo = useCallback((): boolean => {
    return invokerRef.current?.canRedo() ?? false;
  }, []);

  // Get command history
  const getHistory = useCallback(() => {
    return invokerRef.current?.getHistory() ?? [];
  }, []);

  // Clear command history
  const clearHistory = useCallback(() => {
    invokerRef.current?.clearHistory();
  }, []);

  // Convenience methods for common commands
  const navigate = useCallback(async (payload: NavigationPayload) => {
    return execute<void>(CommandType.NAVIGATE, payload);
  }, [execute]);

  const changeTheme = useCallback(async (payload: ThemePayload) => {
    return execute<void>(CommandType.TOGGLE_THEME, payload);
  }, [execute]);

  const controlMedia = useCallback(async (payload: MediaPayload) => {
    const commandType = payload.action === 'play' 
      ? CommandType.PLAY_MEDIA 
      : CommandType.PAUSE_MEDIA;
    return execute<void>(commandType, payload);
  }, [execute]);

  const manageData = useCallback(async <T>(payload: DataPayload<T>) => {
    let commandType: CommandType;
    switch (payload.operation) {
      case 'create': commandType = CommandType.CREATE_ITEM; break;
      case 'update': commandType = CommandType.UPDATE_ITEM; break;
      case 'delete': commandType = CommandType.DELETE_ITEM; break;
      case 'fetch': commandType = CommandType.FETCH_DATA; break;
      default: commandType = CommandType.FETCH_DATA;
    }
    return execute<T>(commandType, payload);
  }, [execute]);

  // Register additional dependencies
  const registerDependency = useCallback((key: string, dependency: any) => {
    factoryRef.current?.registerDependency(key, dependency);
  }, []);

  return {
    // Core command operations
    execute,
    executeCommand,
    undo,
    redo,
    canUndo,
    canRedo,
    
    // History management
    getHistory,
    clearHistory,
    
    // Convenience methods
    navigate,
    changeTheme,
    controlMedia,
    manageData,
    
    // Configuration
    registerDependency,
  };
}