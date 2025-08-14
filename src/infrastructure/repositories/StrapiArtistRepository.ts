import { IArtistRepository, ArtistFilters } from '../../core/domain/repositories/IArtistRepository';
import { Artist, ArtistProps, ArtistLinkProps } from '../../core/domain/entities/Artist';
import { Url } from '../../core/domain/value-objects/Url';
import {
  StrapiApiClient,
  StrapiCollectionResponse,
  StrapiResponse,
} from '../external/StrapiApiClient';

interface StrapiArtistLinkData {
  id: number;
  platform: string;
  url: string;
  displayName?: string;
}

interface StrapiArtistData {
  id: number;
  attributes: {
    name: string;
    bio?: string;
    genre?: string;
    website?: string;
    photos: {
      data: Array<{
        id: number;
        attributes: {
          url: string;
          formats: any;
          name: string;
          alternativeText?: string;
        };
      }>;
    };
    links: StrapiArtistLinkData[];
    createdAt: string;
    updatedAt: string;
    publishedAt?: string;
  };
}

export class StrapiArtistRepository implements IArtistRepository {
  constructor(private readonly apiClient: StrapiApiClient) {}

  async findAll(filters?: ArtistFilters): Promise<Artist[]> {
    try {
      const params: Record<string, string | string[] | number> = {
        'populate[photos]': '*',
        'populate[links]': '*',
      };

      // Apply filters if provided
      if (filters) {
        if (filters.genre) {
          params['filters[genre][$eq]'] = filters.genre;
        }
        if (filters.hasPhotos !== undefined) {
          if (filters.hasPhotos) {
            params['filters[photos][$notNull]'] = 'true';
          } else {
            params['filters[photos][$null]'] = 'true';
          }
        }
        if (filters.hasBio !== undefined) {
          if (filters.hasBio) {
            params['filters[bio][$notNull]'] = 'true';
          } else {
            params['filters[bio][$null]'] = 'true';
          }
        }
        if (filters.platform) {
          params['filters[links][platform][$eq]'] = filters.platform;
        }
      }

      const response = await this.apiClient.get<StrapiCollectionResponse<StrapiArtistData>>(
        'artists',
        params
      );
      return response.data.map(item => this.mapToDomainEntity(item));
    } catch (error) {
      throw new Error(
        `Failed to fetch artists: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findById(id: number): Promise<Artist | null> {
    try {
      const response = await this.apiClient.get<StrapiResponse<StrapiArtistData>>(`artists/${id}`, {
        'populate[photos]': '*',
        'populate[links]': '*',
      });
      return this.mapToDomainEntity(response.data);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw new Error(
        `Failed to fetch artist ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findByName(name: string): Promise<Artist | null> {
    try {
      const response = await this.apiClient.get<StrapiCollectionResponse<StrapiArtistData>>(
        'artists',
        {
          'filters[name][$eq]': name,
          'populate[photos]': '*',
          'populate[links]': '*',
        }
      );

      if (response.data.length === 0) {
        return null;
      }

      return this.mapToDomainEntity(response.data[0]);
    } catch (error) {
      throw new Error(
        `Failed to fetch artist by name ${name}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findByGenre(genre: string): Promise<Artist[]> {
    try {
      return await this.findAll({ genre });
    } catch (error) {
      throw new Error(
        `Failed to fetch artists by genre ${genre}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async findWithPlatform(platform: string): Promise<Artist[]> {
    try {
      return await this.findAll({ platform });
    } catch (error) {
      throw new Error(
        `Failed to fetch artists with platform ${platform}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async save(artist: Artist): Promise<Artist> {
    try {
      const data = this.mapToStrapiData(artist);

      if (artist.isNew()) {
        const response = await this.apiClient.post<StrapiResponse<StrapiArtistData>>('artists', {
          data,
        });
        return this.mapToDomainEntity(response.data);
      } else {
        const response = await this.apiClient.put<StrapiResponse<StrapiArtistData>>(
          `artists/${artist.id}`,
          { data }
        );
        return this.mapToDomainEntity(response.data);
      }
    } catch (error) {
      throw new Error(
        `Failed to save artist: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.apiClient.delete(`artists/${id}`);
    } catch (error) {
      throw new Error(
        `Failed to delete artist ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async exists(id: number): Promise<boolean> {
    try {
      const artist = await this.findById(id);
      return artist !== null;
    } catch (error) {
      return false;
    }
  }

  private mapToDomainEntity(strapiData: StrapiArtistData): Artist {
    const links: ArtistLinkProps[] =
      strapiData.attributes.links?.map(link => ({
        platform: link.platform as any,
        url: new Url(link.url),
        displayName: link.displayName,
      })) || [];

    const props: ArtistProps = {
      id: strapiData.id,
      name: strapiData.attributes.name,
      photos: strapiData.attributes.photos?.data?.map(photo => photo.attributes.url) || [],
      links,
      bio: strapiData.attributes.bio,
      genre: strapiData.attributes.genre,
      website: strapiData.attributes.website ? new Url(strapiData.attributes.website) : undefined,
      createdAt: new Date(strapiData.attributes.createdAt),
      updatedAt: new Date(strapiData.attributes.updatedAt),
    };

    return new Artist(props);
  }

  private mapToStrapiData(artist: Artist): any {
    return {
      name: artist.name,
      bio: artist.bio,
      genre: artist.genre,
      website: artist.website?.value,
      links: artist.links.map(link => ({
        platform: link.platform,
        url: link.url.value,
        displayName: link.displayName,
      })),
    };
  }
}
