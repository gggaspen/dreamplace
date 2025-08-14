import { BaseEntity } from './BaseEntity';
import { Url } from '../value-objects/Url';

export interface EventProps {
  id: number;
  name: string;
  description: string;
  date: Date;
  location: string;
  active: boolean;
  ticketLink: Url;
  coverMobile?: string[];
  coverDesktop?: string;
  price?: number;
  capacity?: number;
  tags?: string[];
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Event extends BaseEntity {
  private readonly _name: string;
  private readonly _description: string;
  private readonly _date: Date;
  private readonly _location: string;
  private readonly _active: boolean;
  private readonly _ticketLink: Url;
  private readonly _coverMobile: string[];
  private readonly _coverDesktop?: string;
  private readonly _price?: number;
  private readonly _capacity?: number;
  private readonly _tags: string[];
  private readonly _featured: boolean;

  constructor(props: EventProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this._name = this.validateName(props.name);
    this._description = props.description;
    this._date = props.date;
    this._location = this.validateLocation(props.location);
    this._active = props.active;
    this._ticketLink = props.ticketLink;
    this._coverMobile = props.coverMobile || [];
    this._coverDesktop = props.coverDesktop;
    this._price = props.price;
    this._capacity = props.capacity;
    this._tags = props.tags || [];
    this._featured = props.featured || false;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get date(): Date {
    return new Date(this._date);
  }

  get location(): string {
    return this._location;
  }

  get isActive(): boolean {
    return this._active;
  }

  get ticketLink(): Url {
    return this._ticketLink;
  }

  get coverMobile(): string[] {
    return [...this._coverMobile];
  }

  get coverDesktop(): string | undefined {
    return this._coverDesktop;
  }

  get price(): number | undefined {
    return this._price;
  }

  get capacity(): number | undefined {
    return this._capacity;
  }

  get tags(): string[] {
    return [...this._tags];
  }

  get isFeatured(): boolean {
    return this._featured;
  }

  public isUpcoming(): boolean {
    return this._date > new Date();
  }

  public isPast(): boolean {
    return this._date < new Date();
  }

  public isToday(): boolean {
    const today = new Date();
    const eventDate = this._date;

    return (
      today.getDate() === eventDate.getDate() &&
      today.getMonth() === eventDate.getMonth() &&
      today.getFullYear() === eventDate.getFullYear()
    );
  }

  public hasTag(tag: string): boolean {
    return this._tags.includes(tag.toLowerCase());
  }

  public hasCover(): boolean {
    return this._coverMobile.length > 0 || !!this._coverDesktop;
  }

  private validateName(name: string): string {
    if (!name || name.trim().length === 0) {
      throw new Error('Event name cannot be empty');
    }
    if (name.length > 100) {
      throw new Error('Event name cannot exceed 100 characters');
    }
    return name.trim();
  }

  private validateLocation(location: string): string {
    if (!location || location.trim().length === 0) {
      throw new Error('Event location cannot be empty');
    }
    return location.trim();
  }
}
