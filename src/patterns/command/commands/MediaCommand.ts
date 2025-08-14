import { BaseCommand } from '../BaseCommand';
import { CommandType } from '../types';

export interface MediaPayload {
  mediaId: string;
  action: 'play' | 'pause' | 'stop';
  position?: number;
  volume?: number;
}

/**
 * Media Command - handles media playback actions with state management
 */
export class MediaCommand extends BaseCommand<void> {
  private mediaPlayer: any; // Media player instance
  private previousState?: {
    isPlaying: boolean;
    position: number;
    volume: number;
  };

  constructor(
    payload: MediaPayload,
    mediaPlayer: any,
    context?: Record<string, unknown>
  ) {
    super(
      payload.action === 'play' ? CommandType.PLAY_MEDIA : CommandType.PAUSE_MEDIA,
      payload,
      context
    );
    this.mediaPlayer = mediaPlayer;
  }

  async execute(): Promise<void> {
    const payload = this.metadata.payload as MediaPayload;
    
    // Save current state for undo
    this.previousState = {
      isPlaying: this.mediaPlayer.isPlaying,
      position: this.mediaPlayer.getCurrentTime(),
      volume: this.mediaPlayer.getVolume(),
    };
    this.saveState(this.previousState);

    // Execute media action
    switch (payload.action) {
      case 'play':
        await this.mediaPlayer.play(payload.mediaId, payload.position);
        break;
      case 'pause':
        await this.mediaPlayer.pause();
        break;
      case 'stop':
        await this.mediaPlayer.stop();
        break;
    }

    // Set volume if specified
    if (payload.volume !== undefined) {
      await this.mediaPlayer.setVolume(payload.volume);
    }
  }

  canUndo(): boolean {
    return !!this.previousState;
  }

  protected async performUndo(): Promise<void> {
    if (this.previousState) {
      if (this.previousState.isPlaying) {
        const payload = this.metadata.payload as MediaPayload;
        await this.mediaPlayer.play(payload.mediaId, this.previousState.position);
      } else {
        await this.mediaPlayer.pause();
      }
      
      await this.mediaPlayer.setVolume(this.previousState.volume);
    }
  }

  getDescription(): string {
    const payload = this.metadata.payload as MediaPayload;
    return `${payload.action.charAt(0).toUpperCase() + payload.action.slice(1)} media: ${payload.mediaId}`;
  }
}