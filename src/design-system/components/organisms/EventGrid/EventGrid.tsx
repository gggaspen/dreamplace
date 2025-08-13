/**
 * EventGrid Organism Component
 * 
 * A compound component that displays a responsive grid of event cards
 * with filtering, sorting, and pagination capabilities.
 */

import { useState, useMemo } from 'react';
import { 
  Grid, 
  VStack, 
  HStack, 
  Select, 
  Input, 
  InputGroup, 
  InputLeftElement,
  Spinner,
  Text,
  Box
} from '@chakra-ui/react';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { EventCard } from '../../molecules/EventCard';
import { Heading } from '../../atoms/Typography';
import { Button } from '../../atoms/Button';

export interface EventGridProps {
  /**
   * Array of events to display
   */
  events: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
    image?: string;
    description?: string;
    genre?: string;
    status?: 'upcoming' | 'live' | 'ended';
  }>;
  
  /**
   * Grid title
   */
  title?: string;
  
  /**
   * Show search and filter controls
   */
  showControls?: boolean;
  
  /**
   * Number of columns (responsive)
   */
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  
  /**
   * Items per page for pagination
   */
  itemsPerPage?: number;
  
  /**
   * Loading state
   */
  loading?: boolean;
  
  /**
   * Empty state message
   */
  emptyMessage?: string;
  
  /**
   * Event handlers
   */
  onEventClick?: (eventId: string) => void;
  onTicketClick?: (eventId: string) => void;
}

const defaultColumns = {
  base: 1,
  sm: 1,
  md: 2,
  lg: 3,
  xl: 4
};

export const EventGrid: React.FC<EventGridProps> = ({
  events,
  title,
  showControls = true,
  columns = defaultColumns,
  itemsPerPage = 12,
  loading = false,
  emptyMessage = "No events found",
  onEventClick,
  onTicketClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Extract unique genres for filter dropdown
  const availableGenres = useMemo(() => {
    const genres = events
      .filter(event => event.genre)
      .map(event => event.genre!)
      .filter((genre, index, array) => array.indexOf(genre) === index);
    return ['all', ...genres];
  }, [events]);

  // Filter and search events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesGenre = genreFilter === 'all' || event.genre === genreFilter;
      const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
      
      return matchesSearch && matchesGenre && matchesStatus;
    });
  }, [events, searchTerm, genreFilter, statusFilter]);

  // Paginate events
  const paginatedEvents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredEvents.slice(startIndex, endIndex);
  }, [filteredEvents, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setGenreFilter('all');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <VStack spacing={8} py={8}>
        <Spinner size="xl" color="brand.500" />
        <Text>Loading events...</Text>
      </VStack>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      {title && (
        <Heading size="xl" textAlign="center">
          {title}
        </Heading>
      )}

      {/* Controls */}
      {showControls && (
        <VStack spacing={4} align="stretch">
          {/* Search */}
          <InputGroup maxW="md" mx="auto">
            <InputLeftElement>
              <FiSearch color="var(--chakra-colors-fg-muted)" />
            </InputLeftElement>
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </InputGroup>

          {/* Filters */}
          <HStack spacing={4} justify="center" wrap="wrap">
            <HStack spacing={2} align="center">
              <FiFilter />
              <Text fontSize="sm" color="fg.muted">Filters:</Text>
            </HStack>

            <Select 
              size="sm" 
              w="auto" 
              value={genreFilter}
              onChange={(e) => {
                setGenreFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {availableGenres.map(genre => (
                <option key={genre} value={genre}>
                  {genre === 'all' ? 'All Genres' : genre}
                </option>
              ))}
            </Select>

            <Select 
              size="sm" 
              w="auto"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
            </Select>

            <Button size="sm" variant="ghost" onClick={resetFilters}>
              Clear
            </Button>
          </HStack>
        </VStack>
      )}

      {/* Results Info */}
      <Text textAlign="center" fontSize="sm" color="fg.muted">
        Showing {paginatedEvents.length} of {filteredEvents.length} events
      </Text>

      {/* Grid */}
      {paginatedEvents.length > 0 ? (
        <Grid
          templateColumns={{
            base: `repeat(${columns.base || 1}, 1fr)`,
            sm: `repeat(${columns.sm || 1}, 1fr)`,
            md: `repeat(${columns.md || 2}, 1fr)`,
            lg: `repeat(${columns.lg || 3}, 1fr)`,
            xl: `repeat(${columns.xl || 4}, 1fr)`
          }}
          gap={6}
          px={{ base: 4, md: 0 }}
        >
          {paginatedEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onEventClick={onEventClick}
              onTicketClick={onTicketClick}
            />
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={12}>
          <Text fontSize="lg" color="fg.muted">
            {emptyMessage}
          </Text>
          {(searchTerm || genreFilter !== 'all' || statusFilter !== 'all') && (
            <Button mt={4} variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          )}
        </Box>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <HStack spacing={2} justify="center" pt={4}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              size="sm"
              variant={page === currentPage ? 'brand' : 'ghost'}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            size="sm"
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </HStack>
      )}
    </VStack>
  );
};