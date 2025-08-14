import { IEventRepository, EventFilters } from '../../domain/repositories/IEventRepository';
import { Event } from '../../domain/entities/Event';
import { EventDto, EventFilterDto } from '../dto/EventDto';
import { EventMapper } from '../mappers/EventMapper';

export class GetAllEventsUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(filterDto?: EventFilterDto): Promise<EventDto[]> {
    try {
      const filters: EventFilters | undefined = filterDto
        ? {
            active: filterDto.active,
            upcoming: filterDto.upcoming,
            featured: filterDto.featured,
            tags: filterDto.tags,
            dateRange: filterDto.dateRange
              ? {
                  start: new Date(filterDto.dateRange.start),
                  end: new Date(filterDto.dateRange.end),
                }
              : undefined,
          }
        : undefined;

      const events = await this.eventRepository.findAll(filters);
      return events.map(event => EventMapper.toDto(event));
    } catch (error) {
      throw new Error(
        `Failed to get events: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
