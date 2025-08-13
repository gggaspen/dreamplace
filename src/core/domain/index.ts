// Base Entity
export { BaseEntity } from './entities/BaseEntity';

// Entities
export { Event, type EventProps } from './entities/Event';
export { Artist, ArtistLink, type ArtistProps, type ArtistLinkProps } from './entities/Artist';
export { HeroSection, NavigationItem, ButtonItem, type HeroSectionProps, type NavigationItemProps, type ButtonItemProps } from './entities/HeroSection';
export { ContactInfo, type ContactInfoProps } from './entities/ContactInfo';

// Value Objects
export { DateRange } from './value-objects/DateRange';
export { Url } from './value-objects/Url';
export { Email } from './value-objects/Email';

// Repository Interfaces
export { type IEventRepository, type EventFilters } from './repositories/IEventRepository';
export { type IArtistRepository, type ArtistFilters } from './repositories/IArtistRepository';
export { type IHeroSectionRepository } from './repositories/IHeroSectionRepository';
export { type IContactInfoRepository } from './repositories/IContactInfoRepository';