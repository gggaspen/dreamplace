/**
 * Breadcrumb Navigation Component
 * Provides hierarchical navigation for the application
 */

'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator,
  Box,
  Icon,
  Text
} from '@chakra-ui/react';
// import { ChevronRightIcon, HomeIcon } from '@chakra-ui/icons';
import { RouteHelpers, BreadcrumbItem as BreadcrumbItemType } from '@/infrastructure/routing/RouteHelpers';

export interface BreadcrumbsProps {
  customBreadcrumbs?: BreadcrumbItemType[];
  showHome?: boolean;
  separator?: React.ReactNode;
  maxItems?: number;
}

export function Breadcrumbs({ 
  customBreadcrumbs,
  showHome = true,
  separator,
  maxItems = 5
}: BreadcrumbsProps) {
  const pathname = usePathname();
  
  const breadcrumbs = customBreadcrumbs || RouteHelpers.generateBreadcrumbs(pathname);
  
  // Limit breadcrumbs if maxItems is specified
  const displayBreadcrumbs = breadcrumbs.length > maxItems 
    ? [
        breadcrumbs[0], // Always keep home
        { label: '...', path: '', isActive: false },
        ...breadcrumbs.slice(-maxItems + 2)
      ]
    : breadcrumbs;

  return (
    <Box py={2}>
      <Breadcrumb
        separator={separator || <Text color="gray.500">/</Text>}
        fontSize="sm"
        color="gray.600"
      >
        {displayBreadcrumbs.map((item, index) => (
          <BreadcrumbItem key={`${item.path}-${index}`} isCurrentPage={item.isActive}>
            {item.label === '...' ? (
              <Text color="gray.400">...</Text>
            ) : item.isActive ? (
              <Text color="gray.900" fontWeight="medium">
                {item.label}
              </Text>
            ) : (
              <BreadcrumbLink as={Link} href={item.path} _hover={{ color: 'blue.600' }}>
                {index === 0 && showHome ? (
                  <Text mr={1}>🏠</Text>
                ) : null}
                {item.label}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>
    </Box>
  );
}

// Specialized breadcrumb for admin sections
export function AdminBreadcrumbs({ 
  customBreadcrumbs,
  ...props 
}: Omit<BreadcrumbsProps, 'customBreadcrumbs'> & { customBreadcrumbs?: BreadcrumbItemType[] }) {
  const pathname = usePathname();
  
  const adminBreadcrumbs = customBreadcrumbs || [
    { label: 'Home', path: '/', isActive: false },
    { label: 'Dashboard', path: '/dashboard', isActive: false },
    ...RouteHelpers.generateBreadcrumbs(pathname).slice(1)
  ];

  return <Breadcrumbs customBreadcrumbs={adminBreadcrumbs} {...props} />;
}

// Compact breadcrumb for mobile
export function CompactBreadcrumbs({ maxItems = 2, ...props }: BreadcrumbsProps) {
  return <Breadcrumbs maxItems={maxItems} showHome={false} {...props} />;
}