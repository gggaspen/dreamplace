export type ServiceIdentifier = string | symbol;
export type Factory<T = any> = () => T;
export type AsyncFactory<T = any> = () => Promise<T>;

export interface ServiceDefinition<T = any> {
  factory: Factory<T> | AsyncFactory<T>;
  singleton: boolean;
}

export class Container {
  private readonly services = new Map<ServiceIdentifier, ServiceDefinition>();
  private readonly singletonInstances = new Map<ServiceIdentifier, any>();

  register<T>(
    identifier: ServiceIdentifier,
    factory: Factory<T> | AsyncFactory<T>,
    options: { singleton?: boolean } = {}
  ): void {
    const { singleton = false } = options;

    this.services.set(identifier, {
      factory,
      singleton
    });
  }

  registerSingleton<T>(
    identifier: ServiceIdentifier,
    factory: Factory<T> | AsyncFactory<T>
  ): void {
    this.register(identifier, factory, { singleton: true });
  }

  registerTransient<T>(
    identifier: ServiceIdentifier,
    factory: Factory<T> | AsyncFactory<T>
  ): void {
    this.register(identifier, factory, { singleton: false });
  }

  async resolve<T>(identifier: ServiceIdentifier): Promise<T> {
    const serviceDefinition = this.services.get(identifier);

    if (!serviceDefinition) {
      throw new Error(`Service ${String(identifier)} is not registered`);
    }

    // Check if it's a singleton and already instantiated
    if (serviceDefinition.singleton && this.singletonInstances.has(identifier)) {
      return this.singletonInstances.get(identifier) as T;
    }

    // Create new instance
    const instance = await serviceDefinition.factory();

    // Store singleton instance
    if (serviceDefinition.singleton) {
      this.singletonInstances.set(identifier, instance);
    }

    return instance as T;
  }

  resolveSync<T>(identifier: ServiceIdentifier): T {
    const serviceDefinition = this.services.get(identifier);

    if (!serviceDefinition) {
      throw new Error(`Service ${String(identifier)} is not registered`);
    }

    // Check if it's a singleton and already instantiated
    if (serviceDefinition.singleton && this.singletonInstances.has(identifier)) {
      return this.singletonInstances.get(identifier) as T;
    }

    // Create new instance (must be synchronous)
    const result = serviceDefinition.factory();
    
    if (result instanceof Promise) {
      throw new Error(`Service ${String(identifier)} factory returns a Promise. Use resolve() instead of resolveSync()`);
    }

    const instance = result as T;

    // Store singleton instance
    if (serviceDefinition.singleton) {
      this.singletonInstances.set(identifier, instance);
    }

    return instance;
  }

  isRegistered(identifier: ServiceIdentifier): boolean {
    return this.services.has(identifier);
  }

  unregister(identifier: ServiceIdentifier): void {
    this.services.delete(identifier);
    this.singletonInstances.delete(identifier);
  }

  clear(): void {
    this.services.clear();
    this.singletonInstances.clear();
  }

  getRegisteredServices(): ServiceIdentifier[] {
    return Array.from(this.services.keys());
  }
}

// Global container instance
let globalContainer: Container | null = null;

export const createContainer = (): Container => {
  return new Container();
};

export const getContainer = (): Container => {
  if (!globalContainer) {
    globalContainer = createContainer();
  }
  return globalContainer;
};

export const setContainer = (container: Container): void => {
  globalContainer = container;
};