/**
 * Type-safe localStorage wrapper with error handling
 */
export class LocalStorage {
  private static isAvailable(): boolean {
    try {
      const test = 'localStorage-test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  static setItem<T>(key: string, value: T): boolean {
    if (!this.isAvailable()) {
      console.warn('localStorage is not available');
      return false;
    }

    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  static getItem<T>(key: string): T | null {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  static removeItem(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  static clear(): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }

  static keys(): string[] {
    if (!this.isAvailable()) {
      return [];
    }

    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  }

  static hasItem(key: string): boolean {
    if (!this.isAvailable()) {
      return false;
    }

    try {
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Error checking localStorage key:', error);
      return false;
    }
  }
}

/**
 * Strongly typed localStorage helpers for specific app data
 */
export class AppStorage {
  private static readonly KEYS = {
    USER_PREFERENCES: 'dreamplace:userPreferences',
    THEME_MODE: 'dreamplace:themeMode',
    LANGUAGE: 'dreamplace:language',
    WELCOME_SEEN: 'dreamplace:welcomeSeen',
    CACHE_TIMESTAMP: 'dreamplace:cacheTimestamp',
  } as const;

  // User preferences
  static setUserPreferences(preferences: {
    language?: string;
    themeMode?: 'light' | 'dark';
    welcomeSeen?: boolean;
  }): boolean {
    return LocalStorage.setItem(this.KEYS.USER_PREFERENCES, preferences);
  }

  static getUserPreferences(): {
    language?: string;
    themeMode?: 'light' | 'dark';
    welcomeSeen?: boolean;
  } | null {
    return LocalStorage.getItem(this.KEYS.USER_PREFERENCES);
  }

  // Theme mode
  static setThemeMode(mode: 'light' | 'dark'): boolean {
    return LocalStorage.setItem(this.KEYS.THEME_MODE, mode);
  }

  static getThemeMode(): 'light' | 'dark' | null {
    return LocalStorage.getItem(this.KEYS.THEME_MODE);
  }

  // Language
  static setLanguage(language: string): boolean {
    return LocalStorage.setItem(this.KEYS.LANGUAGE, language);
  }

  static getLanguage(): string | null {
    return LocalStorage.getItem(this.KEYS.LANGUAGE);
  }

  // Welcome message
  static setWelcomeSeen(seen: boolean): boolean {
    return LocalStorage.setItem(this.KEYS.WELCOME_SEEN, seen);
  }

  static getWelcomeSeen(): boolean {
    return LocalStorage.getItem(this.KEYS.WELCOME_SEEN) || false;
  }

  // Cache timestamp
  static setCacheTimestamp(timestamp: number): boolean {
    return LocalStorage.setItem(this.KEYS.CACHE_TIMESTAMP, timestamp);
  }

  static getCacheTimestamp(): number | null {
    return LocalStorage.getItem(this.KEYS.CACHE_TIMESTAMP);
  }

  // Clear all app data
  static clearAppData(): boolean {
    const keys = Object.values(this.KEYS);
    let success = true;
    
    keys.forEach(key => {
      if (!LocalStorage.removeItem(key)) {
        success = false;
      }
    });
    
    return success;
  }
}