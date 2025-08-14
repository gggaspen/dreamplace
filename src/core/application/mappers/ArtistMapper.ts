import { Artist, ArtistProps, ArtistLinkProps } from '../../domain/entities/Artist';
import { Url } from '../../domain/value-objects/Url';
import { ArtistDto, ArtistLinkDto, CreateArtistDto, UpdateArtistDto } from '../dto/ArtistDto';

export class ArtistMapper {
  static toDto(artist: Artist): ArtistDto {
    return {
      id: artist.id,
      name: artist.name,
      photos: artist.photos,
      links: artist.links.map(link => ({
        platform: link.platform,
        url: link.url.value,
        displayName: link.displayName,
      })),
      bio: artist.bio,
      genre: artist.genre,
      website: artist.website?.value,
      hasPhotos: artist.hasPhotos(),
      hasBio: artist.hasBio(),
      socialLinks: artist.getSocialLinks().map(link => ({
        platform: link.platform,
        url: link.url.value,
        displayName: link.displayName,
      })),
      musicLinks: artist.getMusicLinks().map(link => ({
        platform: link.platform,
        url: link.url.value,
        displayName: link.displayName,
      })),
      createdAt: artist.createdAt.toISOString(),
      updatedAt: artist.updatedAt.toISOString(),
    };
  }

  static toEntity(dto: ArtistDto): Artist {
    const links: ArtistLinkProps[] = dto.links.map(link => ({
      platform: link.platform as any,
      url: new Url(link.url),
      displayName: link.displayName,
    }));

    const props: ArtistProps = {
      id: dto.id,
      name: dto.name,
      photos: dto.photos,
      links,
      bio: dto.bio,
      genre: dto.genre,
      website: dto.website ? new Url(dto.website) : undefined,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt),
    };

    return new Artist(props);
  }

  static fromCreateDto(dto: CreateArtistDto): ArtistProps {
    const links: ArtistLinkProps[] =
      dto.links?.map(link => ({
        platform: link.platform as any,
        url: new Url(link.url),
        displayName: link.displayName,
      })) || [];

    return {
      id: 0, // Will be set by repository
      name: dto.name,
      photos: dto.photos || [],
      links,
      bio: dto.bio,
      genre: dto.genre,
      website: dto.website ? new Url(dto.website) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static applyUpdateDto(artist: Artist, dto: UpdateArtistDto): ArtistProps {
    const links: ArtistLinkProps[] =
      dto.links?.map(link => ({
        platform: link.platform as any,
        url: new Url(link.url),
        displayName: link.displayName,
      })) ||
      artist.links.map(link => ({
        platform: link.platform as any,
        url: link.url,
        displayName: link.displayName,
      }));

    return {
      id: dto.id,
      name: dto.name ?? artist.name,
      photos: dto.photos ?? artist.photos,
      links,
      bio: dto.bio ?? artist.bio,
      genre: dto.genre ?? artist.genre,
      website: dto.website ? new Url(dto.website) : artist.website,
      createdAt: artist.createdAt,
      updatedAt: new Date(),
    };
  }
}
