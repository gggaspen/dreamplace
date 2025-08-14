import { BaseCommand } from '../BaseCommand';
import { CommandType } from '../types';

export interface NavigationPayload {
  to: string;
  replace?: boolean;
  state?: unknown;
}

/**
 * Navigation Command - handles route navigation with undo support
 */
export class NavigationCommand extends BaseCommand<void> {
  private router: any; // Router instance (Next.js router)
  private fromPath?: string;

  constructor(
    payload: NavigationPayload,
    router: any,
    context?: Record<string, unknown>
  ) {
    super(CommandType.NAVIGATE, payload, context);
    this.router = router;
  }

  async execute(): Promise<void> {
    const payload = this.metadata.payload as NavigationPayload;
    
    // Save current path for undo
    this.fromPath = this.router.asPath;
    this.saveState({ fromPath: this.fromPath });

    if (payload.replace) {
      await this.router.replace(payload.to, undefined, { shallow: false });
    } else {
      await this.router.push(payload.to, undefined, { shallow: false });
    }
  }

  canUndo(): boolean {
    return !!this.fromPath;
  }

  protected async performUndo(): Promise<void> {
    if (this.fromPath) {
      await this.router.push(this.fromPath, undefined, { shallow: false });
    }
  }

  getDescription(): string {
    const payload = this.metadata.payload as NavigationPayload;
    return `Navigate to ${payload.to}`;
  }
}