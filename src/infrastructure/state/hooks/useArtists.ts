import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Container } from '../../di/Container';
import { SERVICE_TOKENS } from '../../di/ServiceTokens';
import { IArtistRepository } from '../../../core/domain/repositories/IArtistRepository';

// Query keys
export const artistKeys = {
  all: ['artists'] as const,
  lists: () => [...artistKeys.all, 'list'] as const,
  list: (filters: string) => [...artistKeys.lists(), { filters }] as const,
  details: () => [...artistKeys.all, 'detail'] as const,
  detail: (id: string) => [...artistKeys.details(), id] as const,
};

// Get all artists
export const useArtists = () => {
  const artistRepository = Container.get<IArtistRepository>(SERVICE_TOKENS.ARTIST_REPOSITORY);
  
  return useQuery({
    queryKey: artistKeys.lists(),
    queryFn: () => artistRepository.getAllArtists(),
    staleTime: 1000 * 60 * 10, // 10 minutes - artists change less frequently
    retry: 3,
  });
};

// Get artist by ID
export const useArtist = (id: string) => {
  const artistRepository = Container.get<IArtistRepository>(SERVICE_TOKENS.ARTIST_REPOSITORY);
  
  return useQuery({
    queryKey: artistKeys.detail(id),
    queryFn: () => artistRepository.getArtistById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
    retry: 3,
  });
};

// Prefetch artists
export const usePrefetchArtists = () => {
  const queryClient = useQueryClient();
  const artistRepository = Container.get<IArtistRepository>(SERVICE_TOKENS.ARTIST_REPOSITORY);
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: artistKeys.lists(),
      queryFn: () => artistRepository.getAllArtists(),
      staleTime: 1000 * 60 * 10,
    });
  };
};

// Invalidate artists cache
export const useInvalidateArtists = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: artistKeys.all });
  };
};