/**
 * Generic DataTable Component with TypeScript Generics
 *
 * Fully type-safe data table that can handle any data structure
 * while providing sorting, filtering, and pagination capabilities.
 */

import React, { ReactNode, useState, useMemo } from 'react';
import { Box, Button, Input, Flex, Text, Select } from '@chakra-ui/react';

// Create a simple table implementation since Table components aren't available
const Table = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  variant?: string;
  size?: string;
}) => (
  <table {...props} style={{ width: '100%', borderCollapse: 'collapse' }}>
    {children}
  </table>
);

const TableContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{ overflowX: 'auto' }}>{children}</div>
);

const Thead = ({ children }: { children: React.ReactNode }) => <thead>{children}</thead>;
const Tbody = ({ children }: { children: React.ReactNode }) => <tbody>{children}</tbody>;
const Tr = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  cursor?: string;
  _hover?: any;
  onClick?: () => void;
}) => (
  <tr {...props} style={{ ...(props._hover ? {} : {}), cursor: props.cursor }}>
    {children}
  </tr>
);
const Th = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  width?: string | number;
  textAlign?: string;
  cursor?: string;
  onClick?: () => void;
  _hover?: any;
}) => (
  <th
    {...props}
    style={{
      padding: '8px',
      borderBottom: '1px solid #e2e8f0',
      textAlign: (props.textAlign as any) || 'left',
      width: props.width,
      cursor: props.cursor,
    }}
  >
    {children}
  </th>
);
const Td = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  colSpan?: number;
  textAlign?: string;
}) => (
  <td
    {...props}
    style={{
      padding: '8px',
      borderBottom: '1px solid #e2e8f0',
      textAlign: (props.textAlign as any) || 'left',
    }}
  >
    {children}
  </td>
);

// Generic column definition
export interface TableColumn<T> {
  key: keyof T | string;
  header: ReactNode;
  accessor?: (item: T) => ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

// Sort configuration
interface SortConfig<T> {
  key: keyof T | null;
  direction: 'asc' | 'desc';
}

// Generic data table props
interface DataTableProps<T extends Record<string, any>> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor?: (item: T) => string | number;
  pageSize?: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyComponent?: ReactNode;
  loading?: boolean;
  loadingComponent?: ReactNode;
  onRowClick?: (item: T, index: number) => void;
  striped?: boolean;
  hoverable?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  keyExtractor = (item, index) => item.id || index,
  pageSize = 10,
  searchable = true,
  searchPlaceholder = 'Search...',
  emptyComponent = <Text>No data available</Text>,
  loading = false,
  loadingComponent = <Text>Loading...</Text>,
  onRowClick,
  striped = true,
  hoverable = true,
}: DataTableProps<T>): React.ReactElement {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: null,
    direction: 'asc',
  });

  // Handle sorting
  const handleSort = (key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Process data: filter, sort, paginate
  const processedData = useMemo(() => {
    let result = [...data];

    // Search/filter
    if (searchTerm && searchable) {
      result = result.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof T];
        const bValue = b[sortConfig.key as keyof T];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    // Paginate
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedItems = result.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / pageSize),
    };
  }, [data, searchTerm, sortConfig, currentPage, pageSize, searchable]);

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (column.accessor) {
      return column.accessor(item);
    }
    return String(item[column.key as keyof T] || '');
  };

  const getSortIcon = (columnKey: keyof T | string) => {
    if (sortConfig.key !== columnKey) return ' ⇅';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (loading && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  return (
    <Box>
      {/* Search Bar */}
      {searchable && (
        <Box mb={4}>
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            maxW='300px'
          />
        </Box>
      )}

      {/* Table */}
      <TableContainer>
        <Table variant={striped ? 'striped' : 'simple'} size='sm'>
          <Thead>
            <Tr>
              {columns.map((column, index) => (
                <Th
                  key={String(column.key) + index}
                  width={column.width}
                  textAlign={column.align || 'left'}
                  cursor={column.sortable ? 'pointer' : 'default'}
                  onClick={() => column.sortable && handleSort(column.key as keyof T)}
                  _hover={column.sortable ? { bg: 'gray.50' } : undefined}
                >
                  {column.header}
                  {column.sortable && getSortIcon(column.key)}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {processedData.items.length === 0 ? (
              <Tr>
                <Td colSpan={columns.length} textAlign='center'>
                  {emptyComponent}
                </Td>
              </Tr>
            ) : (
              processedData.items.map((item, index) => (
                <Tr
                  key={keyExtractor(item, index)}
                  cursor={onRowClick ? 'pointer' : 'default'}
                  _hover={hoverable ? { bg: 'gray.50' } : undefined}
                  onClick={() => onRowClick?.(item, index)}
                >
                  {columns.map((column, columnIndex) => (
                    <Td key={String(column.key) + columnIndex} textAlign={column.align || 'left'}>
                      {renderCell(item, column)}
                    </Td>
                  ))}
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {processedData.totalPages > 1 && (
        <Flex justify='space-between' align='center' mt={4}>
          <Text fontSize='sm' color='gray.600'>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, processedData.totalItems)} of{' '}
            {processedData.totalItems} items
          </Text>
          <Flex gap={2}>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Text fontSize='sm' px={2} py={1}>
              Page {currentPage} of {processedData.totalPages}
            </Text>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === processedData.totalPages}
            >
              Next
            </Button>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}

// Type-safe column helper functions
export const createColumn = <T extends Record<string, any>>(
  column: TableColumn<T>
): TableColumn<T> => column;

export const createColumns = <T extends Record<string, any>>(
  columns: TableColumn<T>[]
): TableColumn<T>[] => columns;
