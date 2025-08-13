/**
 * Common utility types for the DreamPlace application
 * These types provide generic, reusable interfaces for components and services
 */

// Base utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type Nullable<T> = T | null;
export type Maybe<T> = T | undefined;

// Common entity identifiers
export interface BaseEntity {
  id: number;
  documentId: string;
}

// API response wrapper types
export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface ApiError {
  error: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Generic component props
export interface WithChildren {
  children?: React.ReactNode;
}

export interface WithClassName {
  className?: string;
}

export interface WithTestId {
  'data-testid'?: string;
}

// Common UI prop combinations
export type BaseComponentProps = WithChildren & WithClassName & WithTestId;

// Loading and error states
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// Generic list operations
export interface ListProps<T> {
  items: T[];
  onItemClick?: (item: T) => void;
  selectedItem?: T;
  renderItem?: (item: T, index: number) => React.ReactNode;
}

// Form field types
export interface FormField<T> {
  value: T;
  error?: string;
  touched?: boolean;
  onChange: (value: T) => void;
  onBlur?: () => void;
}

// Media types
export interface MediaFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path?: string;
  size: number;
  width?: number;
  height?: number;
}

export interface MediaFormats {
  small?: MediaFormat;
  medium?: MediaFormat;
  large?: MediaFormat;
  thumbnail?: MediaFormat;
}

export interface MediaFile {
  id: number;
  documentId?: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: MediaFormats;
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl?: string;
  provider: string;
  provider_metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Navigation types
export interface NavigationItem {
  id: number;
  text: string;
  link: string;
  isExternal?: boolean;
  target?: '_self' | '_blank' | '_parent' | '_top';
}

// Color mode types
export type ColorMode = 'light' | 'dark';
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';

// Size variants
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Direction types
export type Direction = 'up' | 'down' | 'left' | 'right';
export type Orientation = 'horizontal' | 'vertical';

// Event types
export interface EventHandler<T = Event> {
  (event: T): void;
}

export interface AsyncEventHandler<T = Event> {
  (event: T): Promise<void>;
}

// Validation types
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface Validator<T> {
  (value: T): ValidationResult;
}

// Performance monitoring types
export interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

// Configuration types
export interface EnvironmentConfig {
  apiUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  version: string;
}
