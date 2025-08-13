import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Event } from '../../../core/domain/entities/Event';
import { Container } from '../../di/Container';
import { SERVICE_TOKENS } from '../../di/ServiceTokens';
import { IEventRepository } from '../../../core/domain/repositories/IEventRepository';

// Query keys
export const eventKeys = {
  all: ['events'] as const,
  lists: () => [...eventKeys.all, 'list'] as const,
  list: (filters: string) => [...eventKeys.lists(), { filters }] as const,
  details: () => [...eventKeys.all, 'detail'] as const,
  detail: (id: string) => [...eventKeys.details(), id] as const,
  active: () => [...eventKeys.all, 'active'] as const,
};

// Get all events
export const useEvents = () => {
  const eventRepository = Container.get<IEventRepository>(SERVICE_TOKENS.EVENT_REPOSITORY);
  
  return useQuery({
    queryKey: eventKeys.lists(),
    queryFn: () => eventRepository.getAllEvents(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};

// Get active event
export const useActiveEvent = () => {
  const eventRepository = Container.get<IEventRepository>(SERVICE_TOKENS.EVENT_REPOSITORY);
  
  return useQuery({
    queryKey: eventKeys.active(),
    queryFn: () => eventRepository.getActiveEvent(),
    staleTime: 1000 * 60 * 2, // 2 minutes for active event
    retry: 3,
  });
};

// Get event by ID
export const useEvent = (id: string) => {
  const eventRepository = Container.get<IEventRepository>(SERVICE_TOKENS.EVENT_REPOSITORY);
  
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventRepository.getEventById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 3,
  });
};

// Prefetch events (for optimistic loading)
export const usePrefetchEvents = () => {
  const queryClient = useQueryClient();
  const eventRepository = Container.get<IEventRepository>(SERVICE_TOKENS.EVENT_REPOSITORY);
  
  return () => {
    queryClient.prefetchQuery({
      queryKey: eventKeys.lists(),
      queryFn: () => eventRepository.getAllEvents(),
      staleTime: 1000 * 60 * 5,
    });
  };
};

// Invalidate events cache
export const useInvalidateEvents = () => {
  const queryClient = useQueryClient();
  
  return () => {
    queryClient.invalidateQueries({ queryKey: eventKeys.all });
  };
};