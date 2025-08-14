export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlMs?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
  size(): Promise<number>;
}

export class MemoryCacheService implements ICacheService {
  private readonly cache = new Map<string, CacheEntry<unknown>>();
  private readonly defaultTtl: number;
  private readonly maxSize?: number;
  private cleanupInterval?: NodeJS.Timeout;

  constructor(defaultTtl: number = 300000, maxSize?: number) {
    // 5 minutes default
    this.defaultTtl = defaultTtl;
    this.maxSize = maxSize;
    this.startCleanup();
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    const ttl = ttlMs ?? this.defaultTtl;
    const expiresAt = Date.now() + ttl;

    // Check if we need to make space
    if (this.maxSize && this.cache.size >= this.maxSize) {
      this.evictLeastRecentlyUsed();
    }

    this.cache.set(key, {
      value,
      expiresAt,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    const entry = this.cache.get(key);
    if (!entry) {
      return false;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  async size(): Promise<number> {
    return this.cache.size;
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.cache.clear();
  }

  private startCleanup(): void {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpired();
    }, 60000);
  }

  private cleanupExpired(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => this.cache.delete(key));
  }

  private evictLeastRecentlyUsed(): void {
    // Simple LRU: remove the first entry (oldest)
    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      this.cache.delete(firstKey);
    }
  }
}

export class RedisCacheService implements ICacheService {
  constructor(
    private readonly redisUrl: string,
    private readonly defaultTtl: number = 300000
  ) {
    // Redis implementation would go here
    throw new Error('Redis cache service not implemented yet');
  }

  async get<T>(key: string): Promise<T | null> {
    throw new Error('Redis cache service not implemented yet');
  }

  async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    throw new Error('Redis cache service not implemented yet');
  }

  async delete(key: string): Promise<void> {
    throw new Error('Redis cache service not implemented yet');
  }

  async clear(): Promise<void> {
    throw new Error('Redis cache service not implemented yet');
  }

  async has(key: string): Promise<boolean> {
    throw new Error('Redis cache service not implemented yet');
  }

  async size(): Promise<number> {
    throw new Error('Redis cache service not implemented yet');
  }
}

export const createCacheService = (
  provider: 'memory' | 'redis',
  ttl: number,
  maxSize?: number,
  redisUrl?: string
): ICacheService => {
  switch (provider) {
    case 'memory':
      return new MemoryCacheService(ttl, maxSize);
    case 'redis':
      if (!redisUrl) {
        throw new Error('Redis URL is required for Redis cache provider');
      }
      return new RedisCacheService(redisUrl, ttl);
    default:
      throw new Error(`Unsupported cache provider: ${provider}`);
  }
};
