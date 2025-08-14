import { ICommand, ICommandInvoker, CommandResult, CommandMetadata } from './types';

/**
 * Command Invoker - manages command execution, undo/redo functionality
 * and maintains command history
 */
export class CommandInvoker implements ICommandInvoker {
  private history: ICommand[] = [];
  private currentIndex: number = -1;
  private maxHistorySize: number = 50;

  constructor(maxHistorySize?: number) {
    if (maxHistorySize) {
      this.maxHistorySize = maxHistorySize;
    }
  }

  async execute<T>(command: ICommand<T>): Promise<CommandResult<T>> {
    try {
      const result = await command.execute();
      
      // Add to history and manage size
      this.addToHistory(command);
      
      return {
        success: true,
        data: result,
        metadata: command.getMetadata(),
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
        metadata: command.getMetadata(),
      };
    }
  }

  async undo(): Promise<void> {
    if (!this.canUndo()) {
      throw new Error('No commands to undo');
    }

    const command = this.history[this.currentIndex];
    if (command.undo) {
      await command.undo();
      this.currentIndex--;
    } else {
      throw new Error('Current command does not support undo');
    }
  }

  async redo(): Promise<void> {
    if (!this.canRedo()) {
      throw new Error('No commands to redo');
    }

    this.currentIndex++;
    const command = this.history[this.currentIndex];
    if (command.redo) {
      await command.redo();
    } else {
      throw new Error('Current command does not support redo');
    }
  }

  canUndo(): boolean {
    return this.currentIndex >= 0 && 
           this.history[this.currentIndex]?.canUndo?.() === true;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1 &&
           this.history[this.currentIndex + 1]?.canRedo?.() === true;
  }

  getHistory(): CommandMetadata[] {
    return this.history.map(command => command.getMetadata());
  }

  clearHistory(): void {
    this.history = [];
    this.currentIndex = -1;
  }

  getHistorySize(): number {
    return this.history.length;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  private addToHistory(command: ICommand): void {
    // Remove any commands after current index (when redoing after undo)
    this.history = this.history.slice(0, this.currentIndex + 1);
    
    // Add new command
    this.history.push(command);
    this.currentIndex++;
    
    // Maintain max history size
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
      this.currentIndex--;
    }
  }
}