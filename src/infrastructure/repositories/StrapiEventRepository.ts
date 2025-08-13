import { IEventRepository, EventFilters } from '../../core/domain/repositories/IEventRepository';
import { Event, EventProps } from '../../core/domain/entities/Event';
import { Url } from '../../core/domain/value-objects/Url';
import { StrapiApiClient, StrapiEntity, StrapiQueryParams } from '../api/client/StrapiApiClient';

interface StrapiEventAttributes {
  name: string;
  description: any;
  date: string;
  location: string;
  active: boolean;
  ticket_link: string;
  cover_mobile: {
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
  cover_desktop: {
    data: {
      id: number;
      attributes: {
        url: string;
        formats: any;
        name: string;
        alternativeText?: string;
      };
    };
  };
  price?: number;
  capacity?: number;
  tags?: string[];
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export class StrapiEventRepository implements IEventRepository {
  constructor(private readonly apiClient: StrapiApiClient) {}

  async findAll(filters?: EventFilters): Promise<Event[]> {
    const params: StrapiQueryParams = {
      fields: ['name', 'location', 'description', 'date', 'active', 'ticket_link', 'price', 'capacity', 'featured'],
      populate: {
        cover_mobile: {
          fields: ['url', 'formats']
        },
        cover_desktop: {
          fields: ['url', 'formats']
        }
      }
    };

    // Apply filters if provided
    if (filters) {
      params.filters = {};
      
      if (filters.active !== undefined) {
        params.filters.active = { $eq: filters.active };
      }
      if (filters.featured) {
        params.filters.featured = { $eq: true };
      }
      if (filters.tags && filters.tags.length > 0) {
        params.filters.tags = { $in: filters.tags };
      }
      if (filters.dateRange) {
        params.filters.date = {
          $gte: filters.dateRange.start.toISOString(),
          $lte: filters.dateRange.end.toISOString()
        };
      }
    }

    const response = await this.apiClient.getEntries<StrapiEventAttributes>('events', params);
    return response.data.map(item => this.mapToDomainEntity(item));
  }

  async findById(id: number): Promise<Event | null> {
    try {
      const params: StrapiQueryParams = {
        populate: {
          cover_mobile: {
            fields: ['url', 'formats']
          },
          cover_desktop: {
            fields: ['url', 'formats']
          }
        }
      };

      const response = await this.apiClient.getEntry<StrapiEventAttributes>('events', id, params);
      return this.mapToDomainEntity(response);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async findActiveEvent(): Promise<Event | null> {
    const events = await this.findAll({ active: true });
    return events.find(event => event.isActive) || null;
  }

  async findUpcomingEvents(): Promise<Event[]> {
    const events = await this.findAll();
    return events.filter(event => event.isUpcoming());
  }

  async findFeaturedEvents(): Promise<Event[]> {
    return await this.findAll({ featured: true });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Event[]> {
    return await this.findAll({ dateRange: { start: startDate, end: endDate } });
  }

  async save(event: Event): Promise<Event> {
    const data = this.mapToStrapiData(event);
    
    if (event.isNew()) {
      const response = await this.apiClient.createEntry<StrapiEventAttributes>('events', data);
      return this.mapToDomainEntity(response);
    } else {
      const response = await this.apiClient.updateEntry<StrapiEventAttributes>('events', event.id!, data);
      return this.mapToDomainEntity(response);
    }
  }

  async delete(id: number): Promise<void> {
    await this.apiClient.deleteEntry('events', id);
  }

  async exists(id: number): Promise<boolean> {
    try {
      const event = await this.findById(id);
      return event !== null;
    } catch (error) {
      return false;
    }
  }

  private mapToDomainEntity(strapiData: StrapiEntity<StrapiEventAttributes>): Event {
    const props: EventProps = {
      id: strapiData.id,
      name: strapiData.attributes.name,
      description: this.extractTextFromRichText(strapiData.attributes.description),
      date: new Date(strapiData.attributes.date),
      location: strapiData.attributes.location,
      active: strapiData.attributes.active,
      ticketLink: new Url(strapiData.attributes.ticket_link),
      coverMobile: strapiData.attributes.cover_mobile?.data?.map(cover => cover.attributes.url) || [],
      coverDesktop: strapiData.attributes.cover_desktop?.data?.attributes?.url,
      price: strapiData.attributes.price,
      capacity: strapiData.attributes.capacity,
      tags: strapiData.attributes.tags || [],
      featured: strapiData.attributes.featured || false,
      createdAt: new Date(strapiData.attributes.createdAt),
      updatedAt: new Date(strapiData.attributes.updatedAt)
    };

    return new Event(props);
  }

  private mapToStrapiData(event: Event): any {
    return {
      name: event.name,
      description: event.description,
      date: event.date.toISOString(),
      location: event.location,
      active: event.isActive,
      ticket_link: event.ticketLink.value,
      price: event.price,
      capacity: event.capacity,
      featured: event.isFeatured
    };
  }

  private extractTextFromRichText(richText: any): string {
    if (!richText) return '';
    if (typeof richText === 'string') return richText;
    if (Array.isArray(richText)) {
      return richText.map(block => {
        if (block.children) {
          return block.children.map((child: any) => child.text || '').join('');
        }
        return '';
      }).join('\\n');
    }
    return '';
  }
}