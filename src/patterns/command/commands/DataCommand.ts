import { BaseCommand } from '../BaseCommand';
import { CommandType } from '../types';

export interface DataPayload<T = unknown> {
  entityType: string;
  entityId?: string;
  data?: T;
  operation: 'create' | 'update' | 'delete' | 'fetch';
}

/**
 * Data Command - handles CRUD operations with undo support
 */
export class DataCommand<T = unknown> extends BaseCommand<T> {
  private dataService: any; // Data service instance
  private originalData?: T;
  private createdId?: string;

  constructor(
    payload: DataPayload<T>,
    dataService: any,
    context?: Record<string, unknown>
  ) {
    super(
      DataCommand.getCommandType(payload.operation),
      payload,
      context
    );
    this.dataService = dataService;
  }

  private static getCommandType(operation: string): CommandType {
    switch (operation) {
      case 'create': return CommandType.CREATE_ITEM;
      case 'update': return CommandType.UPDATE_ITEM;
      case 'delete': return CommandType.DELETE_ITEM;
      case 'fetch': return CommandType.FETCH_DATA;
      default: return CommandType.FETCH_DATA;
    }
  }

  async execute(): Promise<T> {
    const payload = this.metadata.payload as DataPayload<T>;
    
    switch (payload.operation) {
      case 'create':
        return this.handleCreate(payload);
      case 'update':
        return this.handleUpdate(payload);
      case 'delete':
        return this.handleDelete(payload);
      case 'fetch':
        return this.handleFetch(payload);
      default:
        throw new Error(`Unknown operation: ${payload.operation}`);
    }
  }

  private async handleCreate(payload: DataPayload<T>): Promise<T> {
    const result = await this.dataService.create(payload.entityType, payload.data);
    this.createdId = result.id;
    this.saveState({ operation: 'create', createdId: this.createdId });
    return result;
  }

  private async handleUpdate(payload: DataPayload<T>): Promise<T> {
    if (!payload.entityId) {
      throw new Error('Entity ID required for update operation');
    }
    
    // Fetch original data for undo
    this.originalData = await this.dataService.getById(payload.entityType, payload.entityId);
    this.saveState({ operation: 'update', originalData: this.originalData });
    
    return this.dataService.update(payload.entityType, payload.entityId, payload.data);
  }

  private async handleDelete(payload: DataPayload<T>): Promise<T> {
    if (!payload.entityId) {
      throw new Error('Entity ID required for delete operation');
    }
    
    // Fetch data before deletion for undo
    this.originalData = await this.dataService.getById(payload.entityType, payload.entityId);
    this.saveState({ operation: 'delete', originalData: this.originalData });
    
    return this.dataService.delete(payload.entityType, payload.entityId);
  }

  private async handleFetch(payload: DataPayload<T>): Promise<T> {
    if (payload.entityId) {
      return this.dataService.getById(payload.entityType, payload.entityId);
    } else {
      return this.dataService.getAll(payload.entityType);
    }
  }

  canUndo(): boolean {
    const payload = this.metadata.payload as DataPayload<T>;
    return ['create', 'update', 'delete'].includes(payload.operation);
  }

  protected async performUndo(): Promise<void> {
    const payload = this.metadata.payload as DataPayload<T>;
    const savedState = this.getPreviousState<any>();
    
    if (!savedState) return;

    switch (payload.operation) {
      case 'create':
        if (savedState.createdId) {
          await this.dataService.delete(payload.entityType, savedState.createdId);
        }
        break;
      
      case 'update':
        if (savedState.originalData && payload.entityId) {
          await this.dataService.update(payload.entityType, payload.entityId, savedState.originalData);
        }
        break;
      
      case 'delete':
        if (savedState.originalData) {
          await this.dataService.create(payload.entityType, savedState.originalData);
        }
        break;
    }
  }

  getDescription(): string {
    const payload = this.metadata.payload as DataPayload<T>;
    const operation = payload.operation.charAt(0).toUpperCase() + payload.operation.slice(1);
    return `${operation} ${payload.entityType}${payload.entityId ? ` (ID: ${payload.entityId})` : ''}`;
  }
}