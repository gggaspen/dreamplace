/**
 * Real-time Subscriptions Hooks
 * 
 * Custom hooks for managing GraphQL subscriptions with automatic
 * reconnection, error handling, and cache updates.
 */

import { useSubscription, useApolloClient } from '@apollo/client';
import { useEffect, useCallback, useRef } from 'react';
import { DocumentNode } from 'graphql';
import { SUBSCRIPTIONS } from '../schema';
import { Event, Artist, Notification } from '../types';

// Subscription options
interface SubscriptionOptions<T> {
  variables?: any;
  onData?: (data: T) => void;
  onError?: (error: any) => void;
  onComplete?: () => void;
  enabled?: boolean;
  reconnectOnError?: boolean;
  maxReconnectAttempts?: number;
}

// Base subscription hook
export function useBaseSubscription<T>(
  subscription: DocumentNode,
  options: SubscriptionOptions<T> = {}
) {
  const {
    variables,
    onData,
    onError,
    onComplete,
    enabled = true,
    reconnectOnError = true,
    maxReconnectAttempts = 5,
  } = options;

  const reconnectAttempts = useRef(0);
  const client = useApolloClient();

  const { data, loading, error } = useSubscription(subscription, {
    variables,
    skip: !enabled,
    onData: ({ data: subscriptionData }) => {
      if (subscriptionData) {
        onData?.(subscriptionData);
        reconnectAttempts.current = 0; // Reset on successful data
      }
    },
    onError: (subscriptionError) => {
      console.error('Subscription error:', subscriptionError);
      onError?.(subscriptionError);

      // Attempt reconnection if enabled
      if (
        reconnectOnError &&
        reconnectAttempts.current < maxReconnectAttempts
      ) {
        reconnectAttempts.current += 1;
        console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
        
        setTimeout(() => {
          // Refetch queries to sync state
          client.refetchQueries({ include: 'active' });
        }, Math.pow(2, reconnectAttempts.current) * 1000); // Exponential backoff
      }
    },
    onComplete,
  });

  return {
    data,
    loading,
    error,
    reconnectAttempts: reconnectAttempts.current,
  };
}

// Event updates subscription
export function useEventUpdatesSubscription(
  eventId: string,
  options: Omit<SubscriptionOptions<{ eventUpdated: Event }>, 'variables'> = {}
) {
  const client = useApolloClient();

  return useBaseSubscription(SUBSCRIPTIONS.EVENT_UPDATED, {
    ...options,
    variables: { eventId },
    onData: (data) => {
      // Update cache with new event data
      client.cache.modify({
        id: client.cache.identify({ __typename: 'Event', id: eventId }),
        fields: {
          ...data.eventUpdated,
        },
      });

      options.onData?.(data);
    },
    enabled: !!eventId && options.enabled !== false,
  });
}

// Ticket availability subscription
export function useTicketAvailabilitySubscription(
  eventId: string,
  options: Omit<SubscriptionOptions<{ ticketAvailabilityChanged: any }>, 'variables'> = {}
) {
  const client = useApolloClient();

  return useBaseSubscription(SUBSCRIPTIONS.TICKET_AVAILABILITY_CHANGED, {
    ...options,
    variables: { eventId },
    onData: (data) => {
      // Update cache with new ticket availability
      client.cache.modify({
        id: client.cache.identify({ __typename: 'Event', id: eventId }),
        fields: {
          tickets: (existingTickets = [], { readField }) => {
            return existingTickets.map((ticket: any) => {
              const ticketId = readField('id', ticket);
              const updatedTicket = data.ticketAvailabilityChanged.find(
                (t: any) => t.id === ticketId
              );
              return updatedTicket || ticket;
            });
          },
        },
      });

      options.onData?.(data);
    },
    enabled: !!eventId && options.enabled !== false,
  });
}

// New events subscription (for followed artists)
export function useNewEventsSubscription(
  artistIds: string[],
  options: Omit<SubscriptionOptions<{ newEventCreated: Event }>, 'variables'> = {}
) {
  const client = useApolloClient();

  return useBaseSubscription(SUBSCRIPTIONS.NEW_EVENT_CREATED, {
    ...options,
    variables: { artistIds },
    onData: (data) => {
      // Add new event to relevant caches
      client.cache.modify({
        fields: {
          events: (existingEvents = { edges: [], pageInfo: {} }) => {
            const newEvent = data.newEventCreated;
            const newEdge = {
              __typename: 'EventEdge',
              node: newEvent,
              cursor: btoa(`event:${newEvent.id}`),
            };

            return {
              ...existingEvents,
              edges: [newEdge, ...existingEvents.edges],
              pageInfo: {
                ...existingEvents.pageInfo,
                totalCount: existingEvents.pageInfo.totalCount + 1,
              },
            };
          },
        },
      });

      options.onData?.(data);
    },
    enabled: artistIds.length > 0 && options.enabled !== false,
  });
}

// Artist updates subscription
export function useArtistUpdatesSubscription(
  artistId: string,
  options: Omit<SubscriptionOptions<{ artistUpdated: Artist }>, 'variables'> = {}
) {
  const client = useApolloClient();

  return useBaseSubscription(SUBSCRIPTIONS.ARTIST_UPDATED, {
    ...options,
    variables: { artistId },
    onData: (data) => {
      // Update cache with new artist data
      client.cache.modify({
        id: client.cache.identify({ __typename: 'Artist', id: artistId }),
        fields: {
          ...data.artistUpdated,
        },
      });

      options.onData?.(data);
    },
    enabled: !!artistId && options.enabled !== false,
  });
}

// User notifications subscription
export function useUserNotificationsSubscription(
  userId: string,
  options: Omit<SubscriptionOptions<{ userNotification: Notification }>, 'variables'> = {}
) {
  const client = useApolloClient();

  return useBaseSubscription(SUBSCRIPTIONS.USER_NOTIFICATION, {
    ...options,
    variables: { userId },
    onData: (data) => {
      // Add notification to cache
      client.cache.modify({
        fields: {
          notifications: (existingNotifications = []) => {
            return [data.userNotification, ...existingNotifications];
          },
        },
      });

      options.onData?.(data);
    },
    enabled: !!userId && options.enabled !== false,
  });
}

// Combined subscriptions hook for event details page
export function useEventSubscriptions(
  eventId: string,
  options: {
    onEventUpdate?: (event: Event) => void;
    onTicketUpdate?: (tickets: any[]) => void;
    enabled?: boolean;
  } = {}
) {
  const { onEventUpdate, onTicketUpdate, enabled = true } = options;

  // Event updates
  const eventSubscription = useEventUpdatesSubscription(eventId, {
    enabled,
    onData: (data) => onEventUpdate?.(data.eventUpdated),
  });

  // Ticket availability
  const ticketSubscription = useTicketAvailabilitySubscription(eventId, {
    enabled,
    onData: (data) => onTicketUpdate?.(data.ticketAvailabilityChanged),
  });

  return {
    eventSubscription,
    ticketSubscription,
    loading: eventSubscription.loading || ticketSubscription.loading,
    error: eventSubscription.error || ticketSubscription.error,
  };
}

// Combined subscriptions hook for user dashboard
export function useUserSubscriptions(
  userId: string,
  followedArtistIds: string[],
  options: {
    onNewEvent?: (event: Event) => void;
    onNotification?: (notification: Notification) => void;
    enabled?: boolean;
  } = {}
) {
  const { onNewEvent, onNotification, enabled = true } = options;

  // New events from followed artists
  const eventsSubscription = useNewEventsSubscription(followedArtistIds, {
    enabled,
    onData: (data) => onNewEvent?.(data.newEventCreated),
  });

  // User notifications
  const notificationsSubscription = useUserNotificationsSubscription(userId, {
    enabled,
    onData: (data) => onNotification?.(data.userNotification),
  });

  return {
    eventsSubscription,
    notificationsSubscription,
    loading: eventsSubscription.loading || notificationsSubscription.loading,
    error: eventsSubscription.error || notificationsSubscription.error,
  };
}

// Subscription manager hook for handling multiple subscriptions
export function useSubscriptionManager() {
  const activeSubscriptions = useRef<Set<string>>(new Set());
  const client = useApolloClient();

  const registerSubscription = useCallback((subscriptionId: string) => {
    activeSubscriptions.current.add(subscriptionId);
  }, []);

  const unregisterSubscription = useCallback((subscriptionId: string) => {
    activeSubscriptions.current.delete(subscriptionId);
  }, []);

  const getActiveSubscriptions = useCallback(() => {
    return Array.from(activeSubscriptions.current);
  }, []);

  const closeAllSubscriptions = useCallback(() => {
    // Apollo Client handles subscription cleanup automatically
    // This is mainly for tracking purposes
    activeSubscriptions.current.clear();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeAllSubscriptions();
    };
  }, [closeAllSubscriptions]);

  return {
    registerSubscription,
    unregisterSubscription,
    getActiveSubscriptions,
    closeAllSubscriptions,
    activeCount: activeSubscriptions.current.size,
  };
}