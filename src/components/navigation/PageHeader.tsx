/**
 * Page Header Component
 * Provides consistent page headers with breadcrumbs and actions
 */

'use client';

import React, { ReactNode } from 'react';
import { Box, Flex, Heading, Text, HStack, VStack, useBreakpointValue } from '@chakra-ui/react';
import { Breadcrumbs, CompactBreadcrumbs } from './Breadcrumbs';
import { BreadcrumbItem } from '@/infrastructure/routing/RouteHelpers';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  showBreadcrumbs?: boolean;
  background?: string;
}

export function PageHeader({
  title,
  subtitle,
  description,
  breadcrumbs,
  actions,
  showBreadcrumbs = true,
  background = 'white',
}: PageHeaderProps) {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const BreadcrumbComponent = isMobile ? CompactBreadcrumbs : Breadcrumbs;

  return (
    <Box bg={background} borderBottom='1px' borderColor='gray.200'>
      <Box maxW='container.xl' mx='auto' px={4} py={6}>
        <VStack spacing={4} align='stretch'>
          {/* Breadcrumbs */}
          {showBreadcrumbs && <BreadcrumbComponent customBreadcrumbs={breadcrumbs} />}

          {/* Header Content */}
          <Flex
            justify='space-between'
            align='flex-start'
            direction={{ base: 'column', md: 'row' }}
            gap={4}
          >
            <VStack align='flex-start' spacing={2} flex={1}>
              <Heading size='lg' color='gray.900'>
                {title}
              </Heading>
              {subtitle && (
                <Text fontSize='md' color='blue.600' fontWeight='medium'>
                  {subtitle}
                </Text>
              )}
              {description && (
                <Text fontSize='sm' color='gray.600' maxW='2xl'>
                  {description}
                </Text>
              )}
            </VStack>

            {/* Actions */}
            {actions && (
              <HStack spacing={2} flexShrink={0}>
                {actions}
              </HStack>
            )}
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
}

// Specialized headers for different sections
export function DashboardHeader({
  actions,
  ...props
}: Omit<PageHeaderProps, 'title'> & { actions?: ReactNode }) {
  return (
    <PageHeader
      title='Dashboard'
      subtitle='Welcome back'
      description='Manage your account and explore DreamPlace features'
      actions={actions}
      {...props}
    />
  );
}

export function AdminHeader({
  actions,
  ...props
}: Omit<PageHeaderProps, 'title'> & { actions?: ReactNode }) {
  return (
    <PageHeader
      title='Admin Panel'
      subtitle='Platform Management'
      description='Administrative tools and platform oversight'
      background='gray.50'
      actions={actions}
      {...props}
    />
  );
}

export function ArtistHeader({
  actions,
  ...props
}: Omit<PageHeaderProps, 'title'> & { actions?: ReactNode }) {
  return (
    <PageHeader
      title='Artist Dashboard'
      subtitle='Your Creative Space'
      description='Manage your profile, events, and connect with fans'
      background='purple.50'
      actions={actions}
      {...props}
    />
  );
}
