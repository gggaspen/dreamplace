import { ICommand, CommandMetadata, CommandType } from './types';

/**
 * Base implementation of the Command interface
 * Provides common functionality for all commands
 */
export abstract class BaseCommand<TResult = unknown, TError = Error>
  implements ICommand<TResult, TError>
{
  protected metadata: CommandMetadata;
  protected previousState?: unknown;

  constructor(type: CommandType, payload?: unknown, context?: Record<string, unknown>) {
    this.metadata = {
      id: this.generateId(),
      timestamp: new Date(),
      type,
      payload,
      context,
    };
  }

  abstract execute(): Promise<TResult>;

  async undo(): Promise<void> {
    if (!this.canUndo()) {
      throw new Error(`Command ${this.metadata.type} cannot be undone`);
    }
    await this.performUndo();
  }

  async redo(): Promise<TResult> {
    if (!this.canRedo()) {
      throw new Error(`Command ${this.metadata.type} cannot be redone`);
    }
    return this.execute();
  }

  canUndo(): boolean {
    return false; // Override in subclasses that support undo
  }

  canRedo(): boolean {
    return this.canUndo(); // Most commands that can undo can also redo
  }

  getDescription(): string {
    return `${this.metadata.type} command executed at ${this.metadata.timestamp.toISOString()}`;
  }

  getMetadata(): CommandMetadata {
    return { ...this.metadata };
  }

  protected async performUndo(): Promise<void> {
    // Override in subclasses
    throw new Error('Undo not implemented');
  }

  protected generateId(): string {
    return `cmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  protected saveState(state: unknown): void {
    this.previousState = state;
  }

  protected getPreviousState<T>(): T | undefined {
    return this.previousState as T;
  }
}
