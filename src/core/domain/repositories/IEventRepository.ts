import { Event } from '../entities/Event';

export interface EventFilters {
  active?: boolean;
  upcoming?: boolean;
  featured?: boolean;
  tags?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface IEventRepository {
  findAll(filters?: EventFilters): Promise<Event[]>;
  findById(id: number): Promise<Event | null>;
  findActiveEvent(): Promise<Event | null>;
  findUpcomingEvents(): Promise<Event[]>;
  findFeaturedEvents(): Promise<Event[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<Event[]>;
  save(event: Event): Promise<Event>;
  delete(id: number): Promise<void>;
  exists(id: number): Promise<boolean>;
}