import { Artist } from '../entities/Artist';

export interface ArtistFilters {
  genre?: string;
  hasPhotos?: boolean;
  hasBio?: boolean;
  platform?: string;
}

export interface IArtistRepository {
  findAll(filters?: ArtistFilters): Promise<Artist[]>;
  findById(id: number): Promise<Artist | null>;
  findByName(name: string): Promise<Artist | null>;
  findByGenre(genre: string): Promise<Artist[]>;
  findWithPlatform(platform: string): Promise<Artist[]>;
  save(artist: Artist): Promise<Artist>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}