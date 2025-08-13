import { Event, EventProps } from '../../domain/entities/Event';
import { Url } from '../../domain/value-objects/Url';
import { EventDto, CreateEventDto, UpdateEventDto } from '../dto/EventDto';

export class EventMapper {
  static toDto(event: Event): EventDto {
    return {
      id: event.id,
      name: event.name,
      description: event.description,
      date: event.date.toISOString(),
      location: event.location,
      isActive: event.isActive,
      ticketLink: event.ticketLink.value,
      coverMobile: event.coverMobile,
      coverDesktop: event.coverDesktop,
      price: event.price,
      capacity: event.capacity,
      tags: event.tags,
      isFeatured: event.isFeatured,
      isUpcoming: event.isUpcoming(),
      isPast: event.isPast(),
      isToday: event.isToday(),
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString()
    };
  }

  static toEntity(dto: EventDto): Event {
    const props: EventProps = {
      id: dto.id,
      name: dto.name,
      description: dto.description,
      date: new Date(dto.date),
      location: dto.location,
      active: dto.isActive,
      ticketLink: new Url(dto.ticketLink),
      coverMobile: dto.coverMobile,
      coverDesktop: dto.coverDesktop,
      price: dto.price,
      capacity: dto.capacity,
      tags: dto.tags,
      featured: dto.isFeatured,
      createdAt: new Date(dto.createdAt),
      updatedAt: new Date(dto.updatedAt)
    };

    return new Event(props);
  }

  static fromCreateDto(dto: CreateEventDto): EventProps {
    return {
      id: 0, // Will be set by repository
      name: dto.name,
      description: dto.description,
      date: new Date(dto.date),
      location: dto.location,
      active: false, // New events are inactive by default
      ticketLink: new Url(dto.ticketLink),
      coverMobile: dto.coverMobile,
      coverDesktop: dto.coverDesktop,
      price: dto.price,
      capacity: dto.capacity,
      tags: dto.tags,
      featured: dto.featured,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  static applyUpdateDto(event: Event, dto: UpdateEventDto): EventProps {
    return {
      id: dto.id,
      name: dto.name ?? event.name,
      description: dto.description ?? event.description,
      date: dto.date ? new Date(dto.date) : event.date,
      location: dto.location ?? event.location,
      active: dto.active ?? event.isActive,
      ticketLink: dto.ticketLink ? new Url(dto.ticketLink) : event.ticketLink,
      coverMobile: dto.coverMobile ?? event.coverMobile,
      coverDesktop: dto.coverDesktop ?? event.coverDesktop,
      price: dto.price ?? event.price,
      capacity: dto.capacity ?? event.capacity,
      tags: dto.tags ?? event.tags,
      featured: dto.featured ?? event.isFeatured,
      createdAt: event.createdAt,
      updatedAt: new Date()
    };
  }
}