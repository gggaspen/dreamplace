import IEvent, { ICover } from '@/interfaces/event.interface';
import {
  HeroData,
  CarouselData,
  SpotifySection,
  ContactSection,
  ArtistSection,
  FooterSection,
} from '@/interfaces/api-responses.interface';

// Mock cover image
const mockCover: ICover = {
  id: 1,
  documentId: 'mock-doc-id',
  formats: {
    large: {
      ext: '.jpg',
      url: '/mock-image-large.jpg',
      hash: 'mock-hash-large',
      mime: 'image/jpeg',
      name: 'mock-image-large.jpg',
      path: null,
      size: 500000,
      width: 1200,
      height: 800,
      sizeInBytes: 500000,
      provider_metadata: {
        public_id: 'mock-public-id-large',
        resource_type: 'image',
      },
    },
    medium: {
      ext: '.jpg',
      url: '/mock-image-medium.jpg',
      hash: 'mock-hash-medium',
      mime: 'image/jpeg',
      name: 'mock-image-medium.jpg',
      path: null,
      size: 250000,
      width: 800,
      height: 600,
      sizeInBytes: 250000,
      provider_metadata: {
        public_id: 'mock-public-id-medium',
        resource_type: 'image',
      },
    },
    small: {
      ext: '.jpg',
      url: '/mock-image-small.jpg',
      hash: 'mock-hash-small',
      mime: 'image/jpeg',
      name: 'mock-image-small.jpg',
      path: null,
      size: 100000,
      width: 400,
      height: 300,
      sizeInBytes: 100000,
      provider_metadata: {
        public_id: 'mock-public-id-small',
        resource_type: 'image',
      },
    },
    thumbnail: {
      ext: '.jpg',
      url: '/mock-image-thumbnail.jpg',
      hash: 'mock-hash-thumbnail',
      mime: 'image/jpeg',
      name: 'mock-image-thumbnail.jpg',
      path: null,
      size: 25000,
      width: 150,
      height: 100,
      sizeInBytes: 25000,
      provider_metadata: {
        public_id: 'mock-public-id-thumbnail',
        resource_type: 'image',
      },
    },
  },
  url: '/mock-image.jpg',
  name: 'mock-image.jpg',
  alternativeText: 'Mock image',
  caption: 'A mock image for testing',
  width: 1200,
  height: 800,
  hash: 'mock-hash',
  ext: '.jpg',
  mime: 'image/jpeg',
  size: 500000,
  provider: 'cloudinary',
  provider_metadata: {
    public_id: 'mock-public-id',
    resource_type: 'image',
  },
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  publishedAt: '2024-01-01T00:00:00.000Z',
};

// Mock events
export const mockEvents: IEvent[] = [
  {
    id: 1,
    documentId: 'event-1',
    active: true,
    date: '2024-12-31T23:00:00.000Z',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'An amazing electronic music event featuring top DJs.',
            type: 'text',
          },
        ],
      },
    ],
    location: 'Club Example, Buenos Aires',
    name: 'New Year Electronic Bash',
    cover_mobile: [mockCover],
    cover_desktop: mockCover,
    ticket_link: 'https://example.com/tickets',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    publishedAt: '2024-01-01T00:00:00.000Z',
    price: 50,
    capacity: 500,
    tags: ['electronic', 'techno', 'new-year'],
    featured: true,
  },
  {
    id: 2,
    documentId: 'event-2',
    active: false,
    date: '2024-06-15T22:00:00.000Z',
    description: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Summer electronic music festival.',
            type: 'text',
          },
        ],
      },
    ],
    location: 'Outdoor Venue, Rosario',
    name: 'Summer Beats Festival',
    cover_mobile: [mockCover],
    cover_desktop: mockCover,
    ticket_link: 'https://example.com/summer-tickets',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    publishedAt: '2024-01-01T00:00:00.000Z',
    price: 35,
    capacity: 1000,
    tags: ['electronic', 'house', 'summer'],
    featured: false,
  },
];

// Mock hero data
export const mockHeroData: HeroData = {
  id: 1,
  documentId: 'hero-1',
  title: 'DreamPlace',
  subtitle: 'Electronic Music Experience',
  paragraph: 'Immerse yourself in the best electronic music events and artist showcases.',
  navigator: [
    {
      id: 1,
      text: 'Events',
      link: '#events',
      isExternal: false,
      target: '_self',
    },
    {
      id: 2,
      text: 'Artists',
      link: '#artists',
      isExternal: false,
      target: '_self',
    },
  ],
  button: [
    {
      id: 1,
      text: 'Get Tickets',
      link: '#tickets',
      variant: 'primary',
      size: 'lg',
      disabled: false,
    },
  ],
  cover_mobile: [mockCover],
  cover_desktop: mockCover,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  publishedAt: '2024-01-01T00:00:00.000Z',
};

// Mock carousel data
export const mockCarouselData: CarouselData = {
  id: 1,
  documentId: 'carousel-1',
  banner_text: 'Experience the Magic',
  fotos: [mockCover, mockCover, mockCover],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  publishedAt: '2024-01-01T00:00:00.000Z',
};

// Mock Spotify section
export const mockSpotifySection: SpotifySection = {
  id: 1,
  documentId: 'spotify-1',
  titulo: 'Listen to Our Playlists',
  embed_url: 'https://open.spotify.com/embed/playlist/mock-playlist',
  link_url: 'https://open.spotify.com/playlist/mock-playlist',
  banner_text: 'Follow us on Spotify',
  banner_url: 'https://spotify.com/dreamplace',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  publishedAt: '2024-01-01T00:00:00.000Z',
};

// Mock contact section
export const mockContactSection: ContactSection = {
  id: 1,
  documentId: 'contact-1',
  text: 'Get in touch with us for bookings and collaborations.',
  email: 'info@dreamplace.com',
  whatsapp: '+54911234567',
  instagram: '@dreamplace_official',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  publishedAt: '2024-01-01T00:00:00.000Z',
};

// Mock artist section
export const mockArtistSection: ArtistSection = {
  id: 1,
  documentId: 'artists-1',
  title: 'Featured Artists',
  artists: [
    {
      id: 1,
      name: 'DJ Example',
      photos: [mockCover],
      links: [
        {
          id: 1,
          platform: 'spotify',
          url: 'https://open.spotify.com/artist/dj-example',
          displayName: 'DJ Example on Spotify',
        },
        {
          id: 2,
          platform: 'instagram',
          url: 'https://instagram.com/djexample',
          displayName: '@djexample',
        },
      ],
      bio: 'An amazing electronic music artist.',
      genre: 'Techno',
      website: 'https://djexample.com',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    },
  ],
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  publishedAt: '2024-01-01T00:00:00.000Z',
};

// Mock footer section
export const mockFooterSection: FooterSection = {
  id: 1,
  documentId: 'footer-1',
  description: 'DreamPlace - Electronic Music Experience',
  copyright: '© 2024 DreamPlace. All rights reserved.',
  youtube_url: 'https://youtube.com/dreamplace',
  youtube_title: 'DreamPlace YouTube Channel',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  publishedAt: '2024-01-01T00:00:00.000Z',
};
