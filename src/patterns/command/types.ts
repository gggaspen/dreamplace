/**
 * Command Pattern Implementation for User Actions
 *
 * The Command pattern encapsulates a request as an object, thereby allowing
 * you to parameterize clients with different requests, queue or log requests,
 * and support undoable operations.
 */

export interface ICommand<TResult = unknown, TError = Error> {
  execute(): Promise<TResult>;
  undo?(): Promise<void>;
  redo?(): Promise<TResult>;
  canUndo?(): boolean;
  canRedo?(): boolean;
  getDescription(): string;
  getMetadata(): CommandMetadata;
}

export interface CommandMetadata {
  id: string;
  timestamp: Date;
  userId?: string;
  type: CommandType;
  payload?: unknown;
  context?: Record<string, unknown>;
}

export enum CommandType {
  // UI Actions
  NAVIGATE = 'NAVIGATE',
  OPEN_MODAL = 'OPEN_MODAL',
  CLOSE_MODAL = 'CLOSE_MODAL',
  TOGGLE_THEME = 'TOGGLE_THEME',

  // Data Actions
  FETCH_DATA = 'FETCH_DATA',
  CREATE_ITEM = 'CREATE_ITEM',
  UPDATE_ITEM = 'UPDATE_ITEM',
  DELETE_ITEM = 'DELETE_ITEM',

  // User Interactions
  PLAY_MEDIA = 'PLAY_MEDIA',
  PAUSE_MEDIA = 'PAUSE_MEDIA',
  LIKE_CONTENT = 'LIKE_CONTENT',
  SHARE_CONTENT = 'SHARE_CONTENT',

  // Analytics
  TRACK_EVENT = 'TRACK_EVENT',
  LOG_ERROR = 'LOG_ERROR',
}

export interface CommandResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: Error;
  metadata: CommandMetadata;
}

export interface ICommandInvoker {
  execute<T>(command: ICommand<T>): Promise<CommandResult<T>>;
  undo(): Promise<void>;
  redo(): Promise<void>;
  canUndo(): boolean;
  canRedo(): boolean;
  getHistory(): CommandMetadata[];
  clearHistory(): void;
}

export interface ICommandReceiver {
  id: string;
  name: string;
  handleCommand<T>(command: ICommand<T>): Promise<T>;
}
