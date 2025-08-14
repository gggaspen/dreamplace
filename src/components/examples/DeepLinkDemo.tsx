/**
 * Deep Link Demo Component
 * Demonstrates URL state synchronization with various controls
 */

'use client';

import React from 'react';
import { Box, VStack, HStack, Heading, Text, Badge, Code } from '@chakra-ui/react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert } from '@/components/ui/alert';
import { Field } from '@/components/ui/field';
import { Card, CardHeader, CardBody } from '@/components/composite/Card';
import { Input, Select } from '@chakra-ui/react';
import {
  useURLString,
  useURLNumber,
  useURLBoolean,
  useURLArray,
  useURLPagination,
  useURLFilters,
  useURLSearch,
  useURLDate,
} from '@/hooks/useURLState';
import { URLStateConfigs } from '@/infrastructure/routing/URLStateManager';

export function DeepLinkDemo() {
  // Simple state examples
  const [searchQuery, setSearchQuery] = useURLSearch('query', '', 500);
  const [selectedCategory, setSelectedCategory] = useURLString('category', 'all');
  const [minPrice, setMinPrice] = useURLNumber('minPrice', 0);
  const [showOnlyAvailable, setShowOnlyAvailable] = useURLBoolean('available', false);
  const [selectedTags, setSelectedTags] = useURLArray('tags', [], String, String);
  const [selectedDate, setSelectedDate] = useURLDate('date', new Date());

  // Pagination example
  const [pagination, setPagination] = useURLPagination({
    page: 1,
    limit: 10,
    sortBy: 'name',
    sortOrder: 'asc',
  });

  // Complex filters example
  const [eventFilters, setEventFilters, clearEventFilters] = useURLFilters({
    venue: URLStateConfigs.string('venue', ''),
    genre: URLStateConfigs.string('genre', ''),
    priceRange: URLStateConfigs.array('priceRange', [], String, String),
    dateRange: URLStateConfigs.string('dateRange', ''),
  });

  // Current URL display
  const currentURL = typeof window !== 'undefined' ? window.location.href : '';

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  return (
    <Box maxW='container.xl' mx='auto' p={6}>
      <VStack spacing={8} align='stretch'>
        <Box>
          <Heading size='lg' mb={2}>
            Deep Linking Demo
          </Heading>
          <Text color='gray.600'>
            All form controls below are synchronized with URL parameters. Try changing values and
            notice how the URL updates, then refresh the page or share the link.
          </Text>
        </Box>

        <Alert status='info' title='Current URL'>
          <Text fontSize='sm'>
            <Code fontSize='xs'>{currentURL}</Code>
          </Text>
        </Alert>

        {/* Basic Controls */}
        <Card>
          <CardHeader>
            <Heading size='md'>Basic URL State Controls</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align='stretch'>
              <Field label='Search Query (debounced 500ms)'>
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder='Search for something...'
                />
              </Field>

              <Field label='Category'>
                <Select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  <option value='all'>All Categories</option>
                  <option value='events'>Events</option>
                  <option value='artists'>Artists</option>
                  <option value='venues'>Venues</option>
                </Select>
              </Field>

              <Field label='Minimum Price'>
                <Input
                  type='number'
                  value={minPrice}
                  onChange={e => setMinPrice(Number(e.target.value))}
                  min={0}
                />
              </Field>

              <Field label='Date'>
                <Input
                  type='date'
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={e => setSelectedDate(new Date(e.target.value))}
                />
              </Field>

              <HStack alignItems='center'>
                <Switch checked={showOnlyAvailable} onCheckedChange={setShowOnlyAvailable}>
                  Show only available items
                </Switch>
              </HStack>

              <Field label='Tags'>
                <HStack spacing={2} mb={2}>
                  {selectedTags.map(tag => (
                    <Badge
                      key={tag}
                      colorScheme='blue'
                      cursor='pointer'
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </HStack>
                <HStack spacing={2}>
                  <Button size='sm' onClick={() => addTag('electronic')}>
                    + Electronic
                  </Button>
                  <Button size='sm' onClick={() => addTag('house')}>
                    + House
                  </Button>
                  <Button size='sm' onClick={() => addTag('techno')}>
                    + Techno
                  </Button>
                  <Button size='sm' onClick={() => addTag('ambient')}>
                    + Ambient
                  </Button>
                </HStack>
              </Field>
            </VStack>
          </CardBody>
        </Card>

        {/* Pagination */}
        <Card>
          <CardHeader>
            <Heading size='md'>Pagination State</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align='stretch'>
              <HStack spacing={4}>
                <Field label='Page'>
                  <Input
                    type='number'
                    value={pagination.page}
                    onChange={e => setPagination({ page: Number(e.target.value) })}
                    min={1}
                  />
                </Field>

                <Field label='Items per page'>
                  <Select
                    value={pagination.limit}
                    onChange={e => setPagination({ limit: Number(e.target.value) })}
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </Select>
                </Field>

                <Field label='Sort by'>
                  <Select
                    value={pagination.sortBy}
                    onChange={e => setPagination({ sortBy: e.target.value })}
                  >
                    <option value='name'>Name</option>
                    <option value='date'>Date</option>
                    <option value='price'>Price</option>
                    <option value='popularity'>Popularity</option>
                  </Select>
                </Field>

                <Field label='Order'>
                  <Select
                    value={pagination.sortOrder}
                    onChange={e => setPagination({ sortOrder: e.target.value as 'asc' | 'desc' })}
                  >
                    <option value='asc'>Ascending</option>
                    <option value='desc'>Descending</option>
                  </Select>
                </Field>
              </HStack>

              <HStack spacing={2}>
                <Button
                  size='sm'
                  onClick={() => setPagination({ page: Math.max(1, pagination.page - 1) })}
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <Text>Page {pagination.page}</Text>
                <Button size='sm' onClick={() => setPagination({ page: pagination.page + 1 })}>
                  Next
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Event Filters */}
        <Card>
          <CardHeader>
            <HStack justify='space-between'>
              <Heading size='md'>Event Filters</Heading>
              <Button size='sm' onClick={clearEventFilters} colorScheme='red' variant='outline'>
                Clear Filters
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align='stretch'>
              <HStack spacing={4}>
                <Field label='Venue'>
                  <Input
                    value={eventFilters.venue}
                    onChange={e => setEventFilters({ venue: e.target.value })}
                    placeholder='Enter venue name'
                  />
                </Field>

                <Field label='Genre'>
                  <Select
                    value={eventFilters.genre}
                    onChange={e => setEventFilters({ genre: e.target.value })}
                  >
                    <option value=''>All Genres</option>
                    <option value='electronic'>Electronic</option>
                    <option value='house'>House</option>
                    <option value='techno'>Techno</option>
                    <option value='trance'>Trance</option>
                  </Select>
                </Field>

                <Field label='Date Range'>
                  <Select
                    value={eventFilters.dateRange}
                    onChange={e => setEventFilters({ dateRange: e.target.value })}
                  >
                    <option value=''>All Dates</option>
                    <option value='today'>Today</option>
                    <option value='week'>This Week</option>
                    <option value='month'>This Month</option>
                    <option value='year'>This Year</option>
                  </Select>
                </Field>
              </HStack>

              <Box>
                <Text fontWeight='medium' mb={2}>
                  Price Range
                </Text>
                <HStack spacing={2}>
                  {['0-25', '25-50', '50-100', '100+'].map(range => (
                    <Button
                      key={range}
                      size='sm'
                      variant={eventFilters.priceRange.includes(range) ? 'solid' : 'outline'}
                      colorScheme={eventFilters.priceRange.includes(range) ? 'blue' : 'gray'}
                      onClick={() => {
                        const newRange = eventFilters.priceRange.includes(range)
                          ? eventFilters.priceRange.filter(r => r !== range)
                          : [...eventFilters.priceRange, range];
                        setEventFilters({ priceRange: newRange });
                      }}
                    >
                      ${range}
                    </Button>
                  ))}
                </HStack>
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Current State Display */}
        <Card>
          <CardHeader>
            <Heading size='md'>Current State (JSON)</Heading>
          </CardHeader>
          <CardBody>
            <Code display='block' whiteSpace='pre' fontSize='sm' p={4}>
              {JSON.stringify(
                {
                  search: searchQuery,
                  category: selectedCategory,
                  minPrice,
                  showOnlyAvailable,
                  tags: selectedTags,
                  date: selectedDate.toISOString().split('T')[0],
                  pagination,
                  eventFilters,
                },
                null,
                2
              )}
            </Code>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
