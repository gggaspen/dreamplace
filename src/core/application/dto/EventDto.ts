export interface EventDto {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  isActive: boolean;
  ticketLink: string;
  coverMobile: string[];
  coverDesktop?: string;
  price?: number;
  capacity?: number;
  tags: string[];
  isFeatured: boolean;
  isUpcoming: boolean;
  isPast: boolean;
  isToday: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventDto {
  name: string;
  description: string;
  date: string;
  location: string;
  ticketLink: string;
  coverMobile?: string[];
  coverDesktop?: string;
  price?: number;
  capacity?: number;
  tags?: string[];
  featured?: boolean;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {
  id: number;
  active?: boolean;
}

export interface EventFilterDto {
  active?: boolean;
  upcoming?: boolean;
  featured?: boolean;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}