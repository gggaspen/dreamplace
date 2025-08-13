import { BaseEntity } from './BaseEntity';
import { Url } from '../value-objects/Url';

export interface ArtistLinkProps {
  platform: 'spotify' | 'instagram' | 'soundcloud' | 'facebook' | 'twitter' | 'youtube' | 'bandcamp' | 'website';
  url: Url;
  displayName?: string;
}

export interface ArtistProps {
  id: number;
  name: string;
  photos: string[];
  links: ArtistLinkProps[];
  bio?: string;
  genre?: string;
  website?: Url;
  createdAt: Date;
  updatedAt: Date;
}

export class ArtistLink {
  public readonly platform: string;
  public readonly url: Url;
  public readonly displayName?: string;

  constructor(props: ArtistLinkProps) {
    this.platform = props.platform;
    this.url = props.url;
    this.displayName = props.displayName;
  }

  public equals(other: ArtistLink): boolean {
    return this.platform === other.platform && this.url.equals(other.url);
  }
}

export class Artist extends BaseEntity {
  private readonly _name: string;
  private readonly _photos: string[];
  private readonly _links: ArtistLink[];
  private readonly _bio?: string;
  private readonly _genre?: string;
  private readonly _website?: Url;

  constructor(props: ArtistProps) {
    super(props.id, props.createdAt, props.updatedAt);
    
    this._name = this.validateName(props.name);
    this._photos = props.photos || [];
    this._links = props.links.map(link => new ArtistLink(link));
    this._bio = props.bio;
    this._genre = props.genre;
    this._website = props.website;
  }

  get name(): string {
    return this._name;
  }

  get photos(): string[] {
    return [...this._photos];
  }

  get links(): ArtistLink[] {
    return [...this._links];
  }

  get bio(): string | undefined {
    return this._bio;
  }

  get genre(): string | undefined {
    return this._genre;
  }

  get website(): Url | undefined {
    return this._website;
  }

  public hasPhotos(): boolean {
    return this._photos.length > 0;
  }

  public hasBio(): boolean {
    return !!this._bio && this._bio.trim().length > 0;
  }

  public getLinkByPlatform(platform: string): ArtistLink | undefined {
    return this._links.find(link => link.platform === platform);
  }

  public hasLinkForPlatform(platform: string): boolean {
    return this._links.some(link => link.platform === platform);
  }

  public getSocialLinks(): ArtistLink[] {
    const socialPlatforms = ['instagram', 'facebook', 'twitter', 'youtube'];
    return this._links.filter(link => socialPlatforms.includes(link.platform));
  }

  public getMusicLinks(): ArtistLink[] {
    const musicPlatforms = ['spotify', 'soundcloud', 'bandcamp'];
    return this._links.filter(link => musicPlatforms.includes(link.platform));
  }

  private validateName(name: string): string {
    if (!name || name.trim().length === 0) {
      throw new Error('Artist name cannot be empty');
    }
    if (name.length > 50) {
      throw new Error('Artist name cannot exceed 50 characters');
    }
    return name.trim();
  }
}