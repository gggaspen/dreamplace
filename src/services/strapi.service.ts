import { NEXT_PUBLIC_API_URL as API_URL } from '@/app/config';
import IEvent from '@/interfaces/event.interface';
import {
  HeroData,
  CarouselData,
  SpotifySection,
  ContactSection,
  ArtistSection,
  FooterSection,
  StrapiCollectionResponse,
} from '@/interfaces/api-responses.interface';

/**
 * Get all events from Strapi API
 * @returns Promise<IEvent[]> - Array of events
 * @throws Error if the request fails
 */
async function getEvents(): Promise<IEvent[]> {
  const res = await fetch(
    `${API_URL}/api/events?fields[0]=name&fields[1]=location&fields[2]=description&fields[3]=date&fields[4]=active&fields[5]=ticket_link&populate[cover_mobile][fields][1]=formats&populate[cover_desktop][fields][1]=formats`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch events: ${res.status} ${res.statusText}`);
  }
  const response: StrapiCollectionResponse<IEvent> = await res.json();
  return response.data;
}

/**
 * Get hero section data from Strapi API
 * @returns Promise<HeroData> - Hero section data
 * @throws Error if the request fails
 */
async function getHeroData(): Promise<HeroData> {
  const QUERY = `${API_URL}/api/hero-sections?fields[1]=title&fields[2]=subtitle&fields[3]=paragraph&populate[navigator][fields]=*&populate[button][fields]=*&populate[cover_mobile][fields][0]=url&populate[cover_mobile][fields][1]=formats&populate[cover_desktop][fields][0]=url&populate[cover_desktop][fields][1]=formats`;
  const res = await fetch(QUERY);
  if (!res.ok) {
    throw new Error(`Failed to fetch hero data: ${res.status} ${res.statusText}`);
  }
  const response: StrapiCollectionResponse<HeroData> = await res.json();
  return response.data[0];
}

/**
 * Get carousel data from Strapi API
 * @returns Promise<CarouselData> - Carousel data
 * @throws Error if the request fails
 */
async function getCarousel(): Promise<CarouselData> {
  const res = await fetch(
    `${API_URL}/api/carousels?fields[0]=banner_text&&populate[fotos][fields][1]=formats`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch carousel data: ${res.status} ${res.statusText}`);
  }
  const response: StrapiCollectionResponse<CarouselData> = await res.json();
  return response.data[0];
}

/**
 * Get Spotify section data from Strapi API
 * @returns Promise<SpotifySection> - Spotify section data
 * @throws Error if the request fails
 */
async function getSpotifySection(): Promise<SpotifySection> {
  const res = await fetch(
    `${API_URL}/api/spotify-sections?&fields[0]=titulo&fields[1]=embed_url&fields[2]=link_url&fields[3]=banner_text&fields[4]=banner_url`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch Spotify section data: ${res.status} ${res.statusText}`);
  }
  const response: StrapiCollectionResponse<SpotifySection> = await res.json();
  return response.data[0];
}

/**
 * Get contact section data from Strapi API
 * @returns Promise<ContactSection> - Contact section data
 * @throws Error if the request fails
 */
async function getContactData(): Promise<ContactSection> {
  const res = await fetch(
    `${API_URL}/api/contact-sections?fields[0]=titulo&fields[1]=texto_boton&fields[2]=numero_telefono&fields[3]=mensaje_default`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch contact data: ${res.status} ${res.statusText}`);
  }
  const response: StrapiCollectionResponse<ContactSection> = await res.json();
  return response.data[0];
}

/**
 * Get artist section data from Strapi API
 * @returns Promise<ArtistSection> - Artist section data
 * @throws Error if the request fails
 */
async function getArtistSection(): Promise<ArtistSection> {
  const res = await fetch(
    `${API_URL}/api/artist-sections?populate[artists][populate][photos]=*&populate[artists][populate][links]=*&populate[artists][populate][labels]=*`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch artist section data: ${res.status} ${res.statusText}`);
  }
  const response: StrapiCollectionResponse<ArtistSection> = await res.json();
  return response.data[0];
}

/**
 * Get footer section data from Strapi API
 * @returns Promise<FooterSection> - Footer section data
 * @throws Error if the request fails
 */
async function getFooterSection(): Promise<FooterSection> {
  const res = await fetch(
    `${API_URL}/api/footer-sections?fields[0]=youtube_url&fields[1]=youtube_title`
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch footer section data: ${res.status} ${res.statusText}`);
  }
  const response: StrapiCollectionResponse<FooterSection> = await res.json();
  return response.data[0];
}

export {
  getHeroData,
  getEvents,
  getCarousel,
  getSpotifySection,
  getContactData,
  getArtistSection,
  getFooterSection,
};
