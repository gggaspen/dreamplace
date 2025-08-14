/**
 * Infinite Scroll List Component
 *
 * Reusable component that renders an infinite scrolling list
 * with loading states, error handling, and empty states.
 */

import React, { ReactNode } from 'react';
import {
  Box,
  Grid,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Text,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react';

// Generic item type
interface ListItem {
  id: string;
}

// Loading skeleton props
interface LoadingSkeletonProps {
  count?: number;
  height?: string | number;
  gridColumns?: number;
}

// Empty state props
interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

// Error state props
interface ErrorStateProps {
  error: any;
  onRetry?: () => void;
}

// Infinite scroll list props
interface InfiniteScrollListProps<T extends ListItem> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  loading: boolean;
  hasNextPage: boolean;
  loadMoreRef: (node: HTMLElement | null) => void;
  error?: any;
  onRetry?: () => void;

  // Layout options
  layout?: 'grid' | 'list';
  gridColumns?: number | { base?: number; md?: number; lg?: number; xl?: number };
  spacing?: number | string;

  // State components
  loadingSkeleton?: ReactNode;
  emptyState?: EmptyStateProps;
  errorState?: ErrorStateProps;

  // Container props
  containerProps?: any;
  className?: string;
}

// Default loading skeleton
function DefaultLoadingSkeleton({
  count = 6,
  height = '200px',
  gridColumns = 1,
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, index) => (
    <Box key={index} p={4} borderWidth={1} borderRadius='md'>
      <Skeleton height={height} mb={3} />
      <SkeletonText noOfLines={2} spacing={2} />
    </Box>
  ));

  if (gridColumns > 1) {
    return (
      <Grid templateColumns={`repeat(${gridColumns}, 1fr)`} gap={6}>
        {skeletons}
      </Grid>
    );
  }

  return <VStack spacing={4}>{skeletons}</VStack>;
}

// Default empty state
function DefaultEmptyState({ title, description, action, icon }: EmptyStateProps) {
  return (
    <VStack spacing={4} textAlign='center' py={8}>
      {icon}
      <Text fontSize='lg' fontWeight='semibold' color='gray.600'>
        {title || 'No items found'}
      </Text>
      {description && (
        <Text color='gray.500' maxW='md'>
          {description}
        </Text>
      )}
      {action}
    </VStack>
  );
}

// Default error state
function DefaultErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <Alert status='error' flexDirection='column' textAlign='center' py={8}>
      <AlertIcon boxSize='40px' mr={0} />
      <AlertTitle mt={4} mb={1} fontSize='lg'>
        Something went wrong
      </AlertTitle>
      <AlertDescription maxWidth='sm' mb={4}>
        {error?.message || 'An unexpected error occurred while loading data.'}
      </AlertDescription>
      {onRetry && (
        <Button colorScheme='red' variant='outline' onClick={onRetry}>
          Try Again
        </Button>
      )}
    </Alert>
  );
}

// Load more indicator
function LoadMoreIndicator() {
  return (
    <Box textAlign='center' py={6}>
      <Spinner size='md' color='blue.500' />
      <Text mt={2} color='gray.500' fontSize='sm'>
        Loading more...
      </Text>
    </Box>
  );
}

export function InfiniteScrollList<T extends ListItem>({
  items,
  renderItem,
  loading,
  hasNextPage,
  loadMoreRef,
  error,
  onRetry,
  layout = 'grid',
  gridColumns = { base: 1, md: 2, lg: 3, xl: 4 },
  spacing = 6,
  loadingSkeleton,
  emptyState,
  errorState,
  containerProps,
  className,
}: InfiniteScrollListProps<T>) {
  // Handle initial loading state
  if (loading && items.length === 0) {
    return (
      <Box className={className} {...containerProps}>
        {loadingSkeleton || (
          <DefaultLoadingSkeleton
            count={layout === 'grid' ? (typeof gridColumns === 'number' ? gridColumns * 2 : 8) : 6}
            gridColumns={
              layout === 'grid' ? (typeof gridColumns === 'number' ? gridColumns : 3) : 1
            }
          />
        )}
      </Box>
    );
  }

  // Handle error state
  if (error && items.length === 0) {
    const errorProps = errorState || { error, onRetry };
    return (
      <Box className={className} {...containerProps}>
        <DefaultErrorState {...errorProps} />
      </Box>
    );
  }

  // Handle empty state
  if (!loading && items.length === 0) {
    const emptyProps = emptyState || {};
    return (
      <Box className={className} {...containerProps}>
        <DefaultEmptyState {...emptyProps} />
      </Box>
    );
  }

  // Render items
  const itemElements = items.map((item, index) => renderItem(item, index));

  const content =
    layout === 'grid' ? (
      <Grid templateColumns={gridColumns} gap={spacing}>
        {itemElements}
      </Grid>
    ) : (
      <VStack spacing={spacing} align='stretch'>
        {itemElements}
      </VStack>
    );

  return (
    <Box className={className} {...containerProps}>
      {content}

      {/* Load more trigger */}
      {hasNextPage && (
        <Box ref={loadMoreRef}>
          <LoadMoreIndicator />
        </Box>
      )}

      {/* End of list indicator */}
      {!hasNextPage && items.length > 0 && (
        <Box textAlign='center' py={6}>
          <Text color='gray.500' fontSize='sm'>
            You've reached the end
          </Text>
        </Box>
      )}
    </Box>
  );
}

// Specialized component for event listings
export function EventInfiniteList<T extends ListItem & { title: string; startDate: string }>({
  items,
  renderItem,
  ...props
}: Omit<InfiniteScrollListProps<T>, 'emptyState'> & {
  emptyState?: Partial<EmptyStateProps>;
}) {
  const defaultEmptyState: EmptyStateProps = {
    title: 'No events found',
    description: 'Try adjusting your search criteria or check back later for new events.',
    ...props.emptyState,
  };

  return (
    <InfiniteScrollList
      {...props}
      items={items}
      renderItem={renderItem}
      emptyState={defaultEmptyState}
      layout='grid'
      gridColumns={{ base: 1, md: 2, lg: 3 }}
    />
  );
}

// Specialized component for artist listings
export function ArtistInfiniteList<T extends ListItem & { name: string }>({
  items,
  renderItem,
  ...props
}: Omit<InfiniteScrollListProps<T>, 'emptyState'> & {
  emptyState?: Partial<EmptyStateProps>;
}) {
  const defaultEmptyState: EmptyStateProps = {
    title: 'No artists found',
    description:
      'Discover new artists by browsing our featured section or using different search terms.',
    ...props.emptyState,
  };

  return (
    <InfiniteScrollList
      {...props}
      items={items}
      renderItem={renderItem}
      emptyState={defaultEmptyState}
      layout='grid'
      gridColumns={{ base: 2, md: 3, lg: 4, xl: 6 }}
    />
  );
}
