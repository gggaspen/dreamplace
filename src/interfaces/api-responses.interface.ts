import IEvent, { ICover } from './event.interface';

export interface HeroData {
  id: number;
  documentId: string;
  title: string;
  subtitle: string;
  paragraph: string;
  navigator: NavigatorItem[];
  button: ButtonItem[];
  cover_mobile: ICover[];
  cover_desktop: ICover;
}

export interface NavigatorItem {
  id: number;
  text: string;
  link: string;
}

export interface ButtonItem {
  id: number;
  text: string;
  link: string;
}

export interface CarouselData {
  id: number;
  documentId: string;
  banner_text: string;
  fotos: ICover[];
}

export interface SpotifySection {
  id: number;
  documentId: string;
  titulo: string;
  embed_url: string;
  link_url: string;
  banner_text: string;
  banner_url: string;
}

export interface ContactSection {
  id: number;
  documentId: string;
  text: string;
  email: string;
  whatsapp: string;
  instagram: string;
}

export interface ArtistSection {
  id: number;
  documentId: string;
  title: string;
  artists: Artist[];
}

export interface Artist {
  id: number;
  name: string;
  photos: ICover[];
  links: ArtistLink[];
}

export interface ArtistLink {
  id: number;
  platform: string;
  url: string;
}

export interface FooterSection {
  id: number;
  documentId: string;
  description: string;
  copyright: string;
  youtube_url?: string;
  youtube_title?: string;
}

export interface CounterResponse {
  counter: number;
}

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
