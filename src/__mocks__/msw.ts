import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import {
  mockEvents,
  mockHeroData,
  mockCarouselData,
  mockSpotifySection,
  mockContactSection,
  mockArtistSection,
  mockFooterSection,
} from './data';

// Mock API handlers
export const handlers = [
  // Events endpoint
  http.get('*/api/events', () => {
    return HttpResponse.json({
      data: mockEvents,
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: mockEvents.length,
        },
      },
    });
  }),

  // Hero sections endpoint
  http.get('*/api/hero-sections', () => {
    return HttpResponse.json({
      data: [mockHeroData],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: 1,
        },
      },
    });
  }),

  // Carousel endpoint
  http.get('*/api/carousels', () => {
    return HttpResponse.json({
      data: [mockCarouselData],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: 1,
        },
      },
    });
  }),

  // Spotify sections endpoint
  http.get('*/api/spotify-sections', () => {
    return HttpResponse.json({
      data: [mockSpotifySection],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: 1,
        },
      },
    });
  }),

  // Contact sections endpoint
  http.get('*/api/contact-sections', () => {
    return HttpResponse.json({
      data: [mockContactSection],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: 1,
        },
      },
    });
  }),

  // Artist sections endpoint
  http.get('*/api/artist-sections', () => {
    return HttpResponse.json({
      data: [mockArtistSection],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: 1,
        },
      },
    });
  }),

  // Footer sections endpoint
  http.get('*/api/footer-sections', () => {
    return HttpResponse.json({
      data: [mockFooterSection],
      meta: {
        pagination: {
          page: 1,
          pageSize: 25,
          pageCount: 1,
          total: 1,
        },
      },
    });
  }),

  // Error handler for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled request: ${request.method} ${request.url}`);
    return HttpResponse.json({ error: 'Not found' }, { status: 404 });
  }),
];

// Setup test server
export const server = setupServer(...handlers);
