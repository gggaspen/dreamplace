import { IEventRepository } from '../../domain/repositories/IEventRepository';
import { IArtistRepository } from '../../domain/repositories/IArtistRepository';
import { IHeroSectionRepository } from '../../domain/repositories/IHeroSectionRepository';
import { IContactInfoRepository } from '../../domain/repositories/IContactInfoRepository';
import { AppDataDto } from '../dto/AppDataDto';
import { EventMapper } from '../mappers/EventMapper';
import { ArtistMapper } from '../mappers/ArtistMapper';
import { HeroSectionMapper } from '../mappers/HeroSectionMapper';
import { ContactInfoMapper } from '../mappers/ContactInfoMapper';

export class GetAppDataUseCase {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly artistRepository: IArtistRepository,
    private readonly heroSectionRepository: IHeroSectionRepository,
    private readonly contactInfoRepository: IContactInfoRepository
  ) {}

  async execute(): Promise<AppDataDto> {
    try {
      // Fetch all data in parallel for better performance
      const [heroSection, events, activeEvent, artists, contactInfo] = await Promise.all([
        this.heroSectionRepository.findCurrent(),
        this.eventRepository.findAll(),
        this.eventRepository.findActiveEvent(),
        this.artistRepository.findAll(),
        this.contactInfoRepository.findCurrent(),
      ]);

      if (!heroSection) {
        throw new Error('Hero section not found');
      }

      if (!contactInfo) {
        throw new Error('Contact info not found');
      }

      const eventsDto = events.map(event => EventMapper.toDto(event));
      const activeEventDto = activeEvent ? EventMapper.toDto(activeEvent) : undefined;
      const mainDate = activeEvent ? activeEvent.date.toISOString() : new Date().toISOString();

      return {
        heroSection: HeroSectionMapper.toDto(heroSection),
        events: eventsDto,
        activeEvent: activeEventDto,
        mainDate,
        carousel: {
          id: 1, // This will be replaced when Carousel entity is created
          bannerText: '',
          photos: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        spotifySection: {
          id: 1, // This will be replaced when SpotifySection entity is created
          title: '',
          embedUrl: '',
          linkUrl: '',
          bannerText: '',
          bannerUrl: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        contactInfo: ContactInfoMapper.toDto(contactInfo),
        artistSection: {
          id: 1,
          title: 'Artists',
          artists: artists.map(artist => ArtistMapper.toDto(artist)),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        footerSection: {
          id: 1, // This will be replaced when FooterSection entity is created
          description: '',
          copyright: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        counter: {
          counter: 0, // This will be replaced when Counter service is integrated
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to get app data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
