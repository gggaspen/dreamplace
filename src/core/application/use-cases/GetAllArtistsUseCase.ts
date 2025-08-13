import { IArtistRepository, ArtistFilters } from '../../domain/repositories/IArtistRepository';
import { ArtistDto, ArtistFilterDto } from '../dto/ArtistDto';
import { ArtistMapper } from '../mappers/ArtistMapper';

export class GetAllArtistsUseCase {
  constructor(private readonly artistRepository: IArtistRepository) {}

  async execute(filterDto?: ArtistFilterDto): Promise<ArtistDto[]> {
    try {
      const filters: ArtistFilters | undefined = filterDto ? {
        genre: filterDto.genre,
        hasPhotos: filterDto.hasPhotos,
        hasBio: filterDto.hasBio,
        platform: filterDto.platform
      } : undefined;

      const artists = await this.artistRepository.findAll(filters);
      return artists.map(artist => ArtistMapper.toDto(artist));
    } catch (error) {
      throw new Error(`Failed to get artists: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}