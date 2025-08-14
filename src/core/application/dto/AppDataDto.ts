import { EventDto } from './EventDto';
import { ArtistDto } from './ArtistDto';

export interface NavigationItemDto {
  id: number;
  text: string;
  link: string;
  isExternal: boolean;
  target: string;
}

export interface ButtonItemDto {
  id: number;
  text: string;
  link: string;
  variant: string;
  size: string;
  disabled: boolean;
  isEnabled: boolean;
}

export interface HeroSectionDto {
  id: number;
  title: string;
  subtitle: string;
  paragraph: string;
  navigator: NavigationItemDto[];
  buttons: ButtonItemDto[];
  coverMobile: string[];
  coverDesktop: string;
  hasNavigation: boolean;
  hasButtons: boolean;
  enabledButtons: ButtonItemDto[];
  hasCover: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInfoDto {
  id: number;
  text: string;
  email: string;
  whatsapp: string;
  instagram: string;
  whatsappLink: string;
  formattedWhatsApp: string;
  createdAt: string;
  updatedAt: string;
}

export interface CarouselDto {
  id: number;
  bannerText: string;
  photos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SpotifySectionDto {
  id: number;
  title: string;
  embedUrl: string;
  linkUrl: string;
  bannerText: string;
  bannerUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface FooterSectionDto {
  id: number;
  description: string;
  copyright: string;
  youtubeUrl?: string;
  youtubeTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistSectionDto {
  id: number;
  title: string;
  artists: ArtistDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CounterDto {
  counter: number;
}

export interface AppDataDto {
  heroSection: HeroSectionDto;
  events: EventDto[];
  activeEvent?: EventDto;
  mainDate: string;
  carousel: CarouselDto;
  spotifySection: SpotifySectionDto;
  contactInfo: ContactInfoDto;
  artistSection: ArtistSectionDto;
  footerSection: FooterSectionDto;
  counter: CounterDto;
}
