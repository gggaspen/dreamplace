import { IEventRepository } from '../../domain/repositories/IEventRepository';
import { EventDto } from '../dto/EventDto';
import { EventMapper } from '../mappers/EventMapper';

export class GetActiveEventUseCase {
  constructor(private readonly eventRepository: IEventRepository) {}

  async execute(): Promise<EventDto | null> {
    try {
      const activeEvent = await this.eventRepository.findActiveEvent();
      return activeEvent ? EventMapper.toDto(activeEvent) : null;
    } catch (error) {
      throw new Error(
        `Failed to get active event: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
