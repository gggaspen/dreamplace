import {
  getEvents,
  getHeroData,
  getCarousel,
  getSpotifySection,
  getContactData,
  getArtistSection,
  getFooterSection,
} from '@/services/strapi.service';

// Mock fetch globally
global.fetch = jest.fn();

describe('Strapi Service', () => {
  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  describe('getEvents', () => {
    it('should call the correct API endpoint', async () => {
      const mockResponse = {
        data: [
          {
            id: 1,
            documentId: 'test-event',
            name: 'Test Event',
            active: true,
            date: '2024-12-31',
            location: 'Test Location',
            ticket_link: 'http://test.com',
          },
        ],
      };

      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const events = await getEvents();

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/api/events'));
      expect(Array.isArray(events)).toBe(true);
      expect(events[0]).toHaveProperty('id');
    });

    it('should throw error when response is not ok', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(getEvents()).rejects.toThrow(
        'Failed to fetch events: 500 Internal Server Error'
      );
    });
  });

  describe('API endpoint validation', () => {
    it('should use correct base URL from environment', () => {
      expect(process.env.NEXT_PUBLIC_API_URL).toBeDefined();
    });

    it('should have all required service functions exported', () => {
      expect(typeof getEvents).toBe('function');
      expect(typeof getHeroData).toBe('function');
      expect(typeof getCarousel).toBe('function');
      expect(typeof getSpotifySection).toBe('function');
      expect(typeof getContactData).toBe('function');
      expect(typeof getArtistSection).toBe('function');
      expect(typeof getFooterSection).toBe('function');
    });
  });
});
