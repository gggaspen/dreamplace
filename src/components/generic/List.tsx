/**
 * Generic List Components with TypeScript Generics
 * 
 * Type-safe, reusable list components that can handle any data type
 * while maintaining full TypeScript support and inference.
 */

import React, { ReactNode } from 'react';
import { Box, VStack, HStack, Flex, FlexProps, StackProps } from '@chakra-ui/react';

// Generic list item interface
export interface ListItem {
  id: string | number;
}

// Generic list props
interface ListProps<T extends ListItem> extends StackProps {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T) => string | number;
  emptyComponent?: ReactNode;
  direction?: 'vertical' | 'horizontal';
  divider?: ReactNode;
  loading?: boolean;
  loadingComponent?: ReactNode;
}

export function List<T extends ListItem>({
  items,
  renderItem,
  keyExtractor = (item) => item.id,
  emptyComponent = null,
  direction = 'vertical',
  divider,
  loading = false,
  loadingComponent = null,
  ...props
}: ListProps<T>): React.ReactElement {
  if (loading && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  if (items.length === 0 && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  const StackComponent = direction === 'vertical' ? VStack : HStack;

  return (
    <StackComponent
      spacing={0}
      align="stretch"
      divider={divider}
      {...props}
    >
      {items.map((item, index) => (
        <Box key={keyExtractor(item)}>
          {renderItem(item, index)}
        </Box>
      ))}
    </StackComponent>
  );
}

// Generic grid list component
interface GridListProps<T extends ListItem> extends FlexProps {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor?: (item: T) => string | number;
  columns?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: string | number;
  emptyComponent?: ReactNode;
  loading?: boolean;
  loadingComponent?: ReactNode;
}

export function GridList<T extends ListItem>({
  items,
  renderItem,
  keyExtractor = (item) => item.id,
  columns = 1,
  gap = 4,
  emptyComponent = null,
  loading = false,
  loadingComponent = null,
  ...props
}: GridListProps<T>): React.ReactElement {
  if (loading && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  if (items.length === 0 && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  const getTemplateColumns = () => {
    if (typeof columns === 'number') {
      return `repeat(${columns}, 1fr)`;
    }

    return {
      base: columns.base ? `repeat(${columns.base}, 1fr)` : '1fr',
      sm: columns.sm ? `repeat(${columns.sm}, 1fr)` : undefined,
      md: columns.md ? `repeat(${columns.md}, 1fr)` : undefined,
      lg: columns.lg ? `repeat(${columns.lg}, 1fr)` : undefined,
      xl: columns.xl ? `repeat(${columns.xl}, 1fr)` : undefined,
    };
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={getTemplateColumns()}
      gap={gap}
      {...props}
    >
      {items.map((item, index) => (
        <Box key={keyExtractor(item)}>
          {renderItem(item, index)}
        </Box>
      ))}
    </Box>
  );
}

// Type-safe list utilities
export type ListItemRenderer<T extends ListItem> = (item: T, index: number) => ReactNode;
export type KeyExtractor<T extends ListItem> = (item: T) => string | number;

// Helper functions for common list operations
export const listUtils = {
  // Filter items with type safety
  filter: <T extends ListItem>(items: T[], predicate: (item: T) => boolean): T[] => {
    return items.filter(predicate);
  },

  // Sort items with type safety
  sort: <T extends ListItem>(items: T[], compareFn?: (a: T, b: T) => number): T[] => {
    return [...items].sort(compareFn);
  },

  // Group items by a key
  groupBy: <T extends ListItem, K extends keyof T>(
    items: T[],
    key: K
  ): Record<string, T[]> => {
    return items.reduce((groups, item) => {
      const groupKey = String(item[key]);
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  // Paginate items
  paginate: <T extends ListItem>(
    items: T[], 
    page: number, 
    pageSize: number
  ): { items: T[]; totalPages: number; hasNext: boolean; hasPrev: boolean } => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = items.slice(startIndex, endIndex);
    const totalPages = Math.ceil(items.length / pageSize);

    return {
      items: paginatedItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  },
};