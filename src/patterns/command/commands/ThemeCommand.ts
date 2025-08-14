import { BaseCommand } from '../BaseCommand';
import { CommandType } from '../types';

export interface ThemePayload {
  theme: 'light' | 'dark' | 'system';
}

/**
 * Theme Command - handles theme changes with undo support
 */
export class ThemeCommand extends BaseCommand<void> {
  private themeManager: any; // Theme manager instance
  private previousTheme?: string;

  constructor(
    payload: ThemePayload,
    themeManager: any,
    context?: Record<string, unknown>
  ) {
    super(CommandType.TOGGLE_THEME, payload, context);
    this.themeManager = themeManager;
  }

  async execute(): Promise<void> {
    const payload = this.metadata.payload as ThemePayload;
    
    // Save current theme for undo
    this.previousTheme = this.themeManager.currentTheme;
    this.saveState({ previousTheme: this.previousTheme });

    // Apply new theme
    await this.themeManager.setTheme(payload.theme);
    
    // Persist to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('dreamplace-theme', payload.theme);
    }
  }

  canUndo(): boolean {
    return !!this.previousTheme;
  }

  protected async performUndo(): Promise<void> {
    if (this.previousTheme) {
      await this.themeManager.setTheme(this.previousTheme);
      
      // Update localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('dreamplace-theme', this.previousTheme);
      }
    }
  }

  getDescription(): string {
    const payload = this.metadata.payload as ThemePayload;
    return `Change theme to ${payload.theme}`;
  }
}