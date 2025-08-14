/**
 * EventCard Molecule Component
 *
 * A specialized card component for displaying event information
 * including image, title, date, location, and action buttons.
 */

import { forwardRef } from 'react';
import { Box, Image, VStack, HStack, Badge, BoxProps } from '@chakra-ui/react';
import { Card } from '../../atoms/Card';
import { Heading, Body, Caption } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';

export interface EventCardProps extends BoxProps {
  /**
   * Event data
   */
  event: {
    id: string;
    title: string;
    date: string;
    location: string;
    image?: string;
    description?: string;
    genre?: string;
    status?: 'upcoming' | 'live' | 'ended';
  };

  /**
   * Card size
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Show action buttons
   */
  showActions?: boolean;

  /**
   * Event handlers
   */
  onEventClick?: (eventId: string) => void;
  onTicketClick?: (eventId: string) => void;
}

const sizeStyles = {
  sm: {
    imageHeight: '120px',
    padding: 'sm' as const,
  },
  md: {
    imageHeight: '160px',
    padding: 'md' as const,
  },
  lg: {
    imageHeight: '200px',
    padding: 'lg' as const,
  },
};

const statusColors = {
  upcoming: 'brand',
  live: 'green',
  ended: 'gray',
};

export const EventCard = forwardRef<HTMLDivElement, EventCardProps>(
  ({ event, size = 'md', showActions = true, onEventClick, onTicketClick, ...props }, ref) => {
    const styles = sizeStyles[size];

    const handleCardClick = () => {
      onEventClick?.(event.id);
    };

    const handleTicketClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onTicketClick?.(event.id);
    };

    return (
      <Card
        ref={ref}
        variant='elevated'
        size={styles.padding}
        interactive={!!onEventClick}
        onClick={handleCardClick}
        maxW='sm'
        {...props}
      >
        <VStack spacing={4} align='stretch'>
          {/* Event Image */}
          {event.image && (
            <Box
              position='relative'
              overflow='hidden'
              borderRadius='md'
              height={styles.imageHeight}
            >
              <Image
                src={event.image}
                alt={event.title}
                objectFit='cover'
                w='full'
                h='full'
                loading='lazy'
              />

              {/* Status Badge */}
              {event.status && (
                <Badge
                  position='absolute'
                  top={2}
                  right={2}
                  colorScheme={statusColors[event.status]}
                  variant='solid'
                  textTransform='uppercase'
                  fontSize='xs'
                >
                  {event.status}
                </Badge>
              )}

              {/* Genre Badge */}
              {event.genre && (
                <Badge
                  position='absolute'
                  bottom={2}
                  left={2}
                  colorScheme='secondary'
                  variant='subtle'
                  fontSize='xs'
                >
                  {event.genre}
                </Badge>
              )}
            </Box>
          )}

          {/* Event Content */}
          <VStack spacing={2} align='stretch'>
            <Heading size='md' lineHeight='shorter'>
              {event.title}
            </Heading>

            <VStack spacing={1} align='stretch'>
              <HStack spacing={2}>
                <Caption variant='muted'>📅</Caption>
                <Caption>{event.date}</Caption>
              </HStack>

              <HStack spacing={2}>
                <Caption variant='muted'>📍</Caption>
                <Caption>{event.location}</Caption>
              </HStack>
            </VStack>

            {event.description && (
              <Body size='sm' variant='muted' noOfLines={2}>
                {event.description}
              </Body>
            )}
          </VStack>

          {/* Actions */}
          {showActions && event.status !== 'ended' && (
            <HStack spacing={2} pt={2}>
              <Button
                variant='brand'
                size='sm'
                flex={1}
                onClick={handleTicketClick}
                disabled={event.status === 'ended'}
              >
                {event.status === 'live' ? 'Join Now' : 'Get Tickets'}
              </Button>

              <Button variant='outline' size='sm' onClick={handleCardClick}>
                Details
              </Button>
            </HStack>
          )}
        </VStack>
      </Card>
    );
  }
);

EventCard.displayName = 'EventCard';
