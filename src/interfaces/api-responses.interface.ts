import IEvent, { ICover } from './event.interface';
import { BaseEntity, NavigationItem } from '../types/common.types';

export interface HeroData extends BaseEntity {
  title: string;
  subtitle: string;
  paragraph: string;
  navigator: NavigatorItem[];
  button: ButtonItem[];
  cover_mobile: ICover[];
  cover_desktop: ICover;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface NavigatorItem extends NavigationItem {
  // Inherits id, text, link from NavigationItem
  isExternal?: boolean;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

export interface ButtonItem extends NavigationItem {
  // Inherits id, text, link from NavigationItem
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export interface CarouselData extends BaseEntity {
  banner_text: string;
  fotos: ICover[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface SpotifySection extends BaseEntity {
  titulo: string;
  embed_url: string;
  link_url: string;
  banner_text: string;
  banner_url: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ContactSection extends BaseEntity {
  text: string;
  email: string;
  whatsapp: string;
  instagram: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface ArtistSection extends BaseEntity {
  title: string;
  artists: Artist[];
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface Artist {
  id: number;
  name: string;
  photos: ICover[];
  links: ArtistLink[];
  bio?: string;
  genre?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ArtistLink {
  id: number;
  platform:
    | 'spotify'
    | 'instagram'
    | 'soundcloud'
    | 'facebook'
    | 'twitter'
    | 'youtube'
    | 'bandcamp'
    | 'website';
  url: string;
  displayName?: string;
}

export interface FooterSection extends BaseEntity {
  description: string;
  copyright: string;
  youtube_url?: string;
  youtube_title?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CounterResponse {
  counter: number;
}

// Strapi API response wrappers
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface StrapiCollectionResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Main application data structure
export interface AppData {
  heroData: HeroData;
  events: IEvent[];
  activeEvent: IEvent | undefined;
  mainDate: Date;
  carousel: CarouselData;
  spotifySection: SpotifySection;
  contactSection: ContactSection;
  artistSection: ArtistSection;
  footerSection: FooterSection;
  counter: CounterResponse;
}

// Loading states for different sections
export interface AppLoadingStates {
  heroData: boolean;
  events: boolean;
  carousel: boolean;
  spotifySection: boolean;
  contactSection: boolean;
  artistSection: boolean;
  footerSection: boolean;
  counter: boolean;
}

// Error states for different sections
export interface AppErrorStates {
  heroData: string | null;
  events: string | null;
  carousel: string | null;
  spotifySection: string | null;
  contactSection: string | null;
  artistSection: string | null;
  footerSection: string | null;
  counter: string | null;
}
