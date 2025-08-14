import { ICommand, CommandType } from './types';
import {
  NavigationCommand,
  ThemeCommand,
  MediaCommand,
  DataCommand,
  NavigationPayload,
  ThemePayload,
  MediaPayload,
  DataPayload,
} from './commands';

/**
 * Command Factory - creates command instances based on type and payload
 */
export class CommandFactory {
  private dependencies: Map<string, any> = new Map();

  constructor() {
    // Initialize with default dependencies
  }

  /**
   * Register a dependency that commands might need
   */
  registerDependency(key: string, dependency: any): void {
    this.dependencies.set(key, dependency);
  }

  /**
   * Create a command based on type and payload
   */
  createCommand<T>(
    type: CommandType,
    payload: unknown,
    context?: Record<string, unknown>
  ): ICommand<T> {
    switch (type) {
      case CommandType.NAVIGATE:
        return this.createNavigationCommand(payload as NavigationPayload, context);
      
      case CommandType.TOGGLE_THEME:
        return this.createThemeCommand(payload as ThemePayload, context);
      
      case CommandType.PLAY_MEDIA:
      case CommandType.PAUSE_MEDIA:
        return this.createMediaCommand(payload as MediaPayload, context);
      
      case CommandType.CREATE_ITEM:
      case CommandType.UPDATE_ITEM:
      case CommandType.DELETE_ITEM:
      case CommandType.FETCH_DATA:
        return this.createDataCommand(payload as DataPayload, context);
      
      default:
        throw new Error(`Unsupported command type: ${type}`);
    }
  }

  private createNavigationCommand(
    payload: NavigationPayload,
    context?: Record<string, unknown>
  ): NavigationCommand {
    const router = this.dependencies.get('router');
    if (!router) {
      throw new Error('Router dependency not registered');
    }
    return new NavigationCommand(payload, router, context);
  }

  private createThemeCommand(
    payload: ThemePayload,
    context?: Record<string, unknown>
  ): ThemeCommand {
    const themeManager = this.dependencies.get('themeManager');
    if (!themeManager) {
      throw new Error('ThemeManager dependency not registered');
    }
    return new ThemeCommand(payload, themeManager, context);
  }

  private createMediaCommand(
    payload: MediaPayload,
    context?: Record<string, unknown>
  ): MediaCommand {
    const mediaPlayer = this.dependencies.get('mediaPlayer');
    if (!mediaPlayer) {
      throw new Error('MediaPlayer dependency not registered');
    }
    return new MediaCommand(payload, mediaPlayer, context);
  }

  private createDataCommand<T>(
    payload: DataPayload<T>,
    context?: Record<string, unknown>
  ): DataCommand<T> {
    const dataService = this.dependencies.get('dataService');
    if (!dataService) {
      throw new Error('DataService dependency not registered');
    }
    return new DataCommand(payload, dataService, context);
  }

  /**
   * Get all registered dependencies
   */
  getDependencies(): Record<string, any> {
    return Object.fromEntries(this.dependencies);
  }

  /**
   * Check if a dependency is registered
   */
  hasDependency(key: string): boolean {
    return this.dependencies.has(key);
  }
}