export interface ArtistLinkDto {
  platform: string;
  url: string;
  displayName?: string;
}

export interface ArtistDto {
  id: number;
  name: string;
  photos: string[];
  links: ArtistLinkDto[];
  bio?: string;
  genre?: string;
  website?: string;
  hasPhotos: boolean;
  hasBio: boolean;
  socialLinks: ArtistLinkDto[];
  musicLinks: ArtistLinkDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateArtistDto {
  name: string;
  photos?: string[];
  links?: ArtistLinkDto[];
  bio?: string;
  genre?: string;
  website?: string;
}

export interface UpdateArtistDto extends Partial<CreateArtistDto> {
  id: number;
}

export interface ArtistFilterDto {
  genre?: string;
  hasPhotos?: boolean;
  hasBio?: boolean;
  platform?: string;
}
