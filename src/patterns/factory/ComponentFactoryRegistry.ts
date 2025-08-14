import { ReactElement } from 'react';
import { 
  IComponentFactoryRegistry, 
  IComponentFactory, 
  ComponentConfig, 
  CreationContext 
} from './types';

/**
 * Component Factory Registry - manages and orchestrates component factories
 */
export class ComponentFactoryRegistry implements IComponentFactoryRegistry {
  private factories: Map<string, IComponentFactory> = new Map();
  private typeToFactoryMap: Map<string, string> = new Map();
  private creationHistory: Array<{
    type: string;
    factory: string;
    timestamp: Date;
    success: boolean;
  }> = [];

  register(factory: IComponentFactory): void {
    this.factories.set(factory.name, factory);
    
    // Map supported types to this factory
    const metadata = factory.getMetadata();
    metadata.supportedTypes.forEach(type => {
      this.typeToFactoryMap.set(type, factory.name);
    });

    this.log(`Factory '${factory.name}' registered with types: ${metadata.supportedTypes.join(', ')}`);
  }

  unregister(factoryName: string): boolean {
    const factory = this.factories.get(factoryName);
    if (!factory) {
      return false;
    }

    // Remove type mappings
    const metadata = factory.getMetadata();
    metadata.supportedTypes.forEach(type => {
      if (this.typeToFactoryMap.get(type) === factoryName) {
        this.typeToFactoryMap.delete(type);
      }
    });

    this.factories.delete(factoryName);
    this.log(`Factory '${factoryName}' unregistered`);
    return true;
  }

  getFactory(type: string): IComponentFactory | null {
    const factoryName = this.typeToFactoryMap.get(type);
    if (!factoryName) {
      return null;
    }

    return this.factories.get(factoryName) || null;
  }

  getAllFactories(): IComponentFactory[] {
    return Array.from(this.factories.values());
  }

  canCreate(type: string): boolean {
    return this.typeToFactoryMap.has(type);
  }

  async create(config: ComponentConfig, context?: CreationContext): Promise<ReactElement> {
    const startTime = performance.now();
    
    try {
      // Find appropriate factory
      const factory = this.getFactory(config.type);
      if (!factory) {
        throw new Error(`No factory found for component type: ${config.type}`);
      }

      // Validate factory can create this specific config
      if (!factory.canCreate(config)) {
        throw new Error(`Factory '${factory.name}' cannot create component with config: ${JSON.stringify(config)}`);
      }

      // Create component
      const element = await Promise.resolve(factory.create(config, context));
      
      // Record successful creation
      const creationTime = performance.now() - startTime;
      this.recordCreation(config.type, factory.name, true, creationTime);
      
      this.log(`Created component '${config.type}' using factory '${factory.name}' in ${creationTime.toFixed(2)}ms`);
      
      return element;
    } catch (error) {
      // Record failed creation
      const creationTime = performance.now() - startTime;
      this.recordCreation(config.type, 'unknown', false, creationTime);
      
      this.log(`Failed to create component '${config.type}': ${error}`);
      throw error;
    }
  }

  // Batch creation for multiple components
  async createBatch(
    configs: ComponentConfig[], 
    context?: CreationContext
  ): Promise<ReactElement[]> {
    const creationPromises = configs.map(config => 
      this.create(config, context).catch(error => {
        console.error(`Failed to create component ${config.type}:`, error);
        return null;
      })
    );

    const results = await Promise.all(creationPromises);
    return results.filter((element): element is ReactElement => element !== null);
  }

  // Create with fallback
  async createWithFallback(
    config: ComponentConfig,
    fallbackConfig: ComponentConfig,
    context?: CreationContext
  ): Promise<ReactElement> {
    try {
      return await this.create(config, context);
    } catch (error) {
      this.log(`Primary creation failed, using fallback for type '${config.type}'`);
      return this.create(fallbackConfig, context);
    }
  }

  private recordCreation(
    type: string,
    factoryName: string,
    success: boolean,
    creationTime?: number
  ): void {
    this.creationHistory.push({
      type,
      factory: factoryName,
      timestamp: new Date(),
      success,
    });

    // Keep history manageable
    if (this.creationHistory.length > 1000) {
      this.creationHistory = this.creationHistory.slice(-500);
    }
  }

  // Registry statistics
  getRegistryStatistics(): {
    factoryCount: number;
    supportedTypes: number;
    totalCreations: number;
    successRate: number;
    factories: Array<{
      name: string;
      supportedTypes: string[];
      description: string;
    }>;
    creationsByType: Record<string, number>;
    failuresByType: Record<string, number>;
  } {
    const totalCreations = this.creationHistory.length;
    const successfulCreations = this.creationHistory.filter(h => h.success).length;
    const successRate = totalCreations > 0 ? successfulCreations / totalCreations : 0;

    // Count creations by type
    const creationsByType = this.creationHistory.reduce((acc, history) => {
      if (history.success) {
        acc[history.type] = (acc[history.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Count failures by type
    const failuresByType = this.creationHistory.reduce((acc, history) => {
      if (!history.success) {
        acc[history.type] = (acc[history.type] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      factoryCount: this.factories.size,
      supportedTypes: this.typeToFactoryMap.size,
      totalCreations,
      successRate,
      factories: Array.from(this.factories.values()).map(factory => {
        const metadata = factory.getMetadata();
        return {
          name: metadata.name,
          supportedTypes: metadata.supportedTypes,
          description: metadata.description,
        };
      }),
      creationsByType,
      failuresByType,
    };
  }

  // Debug utilities
  listSupportedTypes(): string[] {
    return Array.from(this.typeToFactoryMap.keys()).sort();
  }

  getFactoryForType(type: string): string | null {
    return this.typeToFactoryMap.get(type) || null;
  }

  // Clear history for cleanup
  clearHistory(): void {
    this.creationHistory = [];
  }

  private log(message: string, data?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ComponentFactoryRegistry] ${message}`, data || '');
    }
  }
}