/**
 * GraphQL TypeScript Type Definitions
 * 
 * TypeScript interfaces and types generated from GraphQL schema.
 * These provide type safety for GraphQL operations.
 */

// Scalar types
export type DateTime = string;
export type Upload = File;

// Enums
export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  SOLD_OUT = 'SOLD_OUT',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum UserRole {
  USER = 'USER',
  ARTIST = 'ARTIST',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum NotificationType {
  EVENT_REMINDER = 'EVENT_REMINDER',
  NEW_EVENT = 'NEW_EVENT',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  ARTIST_UPDATE = 'ARTIST_UPDATE',
  SYSTEM = 'SYSTEM',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// Core entity interfaces
export interface Event {
  id: string;
  title: string;
  slug: string;
  description?: string;
  longDescription?: string;
  status: EventStatus;
  startDate: DateTime;
  endDate: DateTime;
  location?: Location;
  coverImage?: Image;
  gallery: Image[];
  artists: Artist[];
  tickets: Ticket[];
  tags: Tag[];
  attendees?: User[];
  reviews?: Review[];
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Artist {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  longBio?: string;
  profileImage?: Image;
  gallery: Image[];
  socialMedia?: SocialMedia;
  genres: Genre[];
  stats?: ArtistStats;
  upcomingEvents?: Event[];
  pastEvents?: Event[];
  followers?: User[];
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  profileImage?: Image;
  role: UserRole;
  isVerified: boolean;
  preferences?: UserPreferences;
  bookmarks?: UserBookmarks;
  attendedEvents?: Event[];
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

export interface Image {
  id: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface Ticket {
  id: string;
  type: string;
  name: string;
  price: number;
  currency: string;
  available: number;
  sold: number;
  maxPerUser: number;
}

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

export interface Genre {
  id: string;
  name: string;
  color?: string;
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  soundcloud?: string;
  spotify?: string;
  website?: string;
}

export interface ArtistStats {
  followers: number;
  totalEvents: number;
  totalPlays: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  emailNotifications: boolean;
  pushNotifications: boolean;
  language: string;
}

export interface UserBookmarks {
  events: Event[];
  artists: Artist[];
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  user: User;
  event: Event;
  createdAt: DateTime;
}

export interface Booking {
  id: string;
  event: Event;
  user: User;
  ticketType: string;
  quantity: number;
  totalPrice: number;
  status: BookingStatus;
  qrCode?: string;
  createdAt: DateTime;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  user: User;
  createdAt: DateTime;
}

// Pagination types
export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
  totalCount: number;
}

export interface Edge<T> {
  node: T;
  cursor: string;
}

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
}

export interface EventConnection extends Connection<Event> {}
export interface ArtistConnection extends Connection<Artist> {}
export interface UserConnection extends Connection<User> {}

// Input types for mutations
export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  termsAccepted: boolean;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  profileImage?: Upload;
  preferences?: UserPreferencesInput;
}

export interface UserPreferencesInput {
  theme?: 'light' | 'dark' | 'auto';
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  language?: string;
}

export interface ContactFormInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NewsletterPreferencesInput {
  events?: boolean;
  artists?: boolean;
  promotions?: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

// Filter and sorting input types
export interface EventWhereInput {
  status?: EventStatus;
  artistIds?: string[];
  locationIds?: string[];
  tagIds?: string[];
  startDate?: {
    gte?: DateTime;
    lte?: DateTime;
  };
  endDate?: {
    gte?: DateTime;
    lte?: DateTime;
  };
  search?: string;
}

export interface ArtistWhereInput {
  genreIds?: string[];
  search?: string;
  hasUpcomingEvents?: boolean;
}

export interface EventOrderByInput {
  field: 'startDate' | 'createdAt' | 'title' | 'popularity';
  direction: SortOrder;
}

export interface ArtistOrderByInput {
  field: 'name' | 'createdAt' | 'popularity' | 'followers';
  direction: SortOrder;
}

export interface SearchFiltersInput {
  type?: ('event' | 'artist')[];
  location?: string;
  dateRange?: {
    start?: DateTime;
    end?: DateTime;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  genres?: string[];
}

// Response types
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface SearchResults {
  events: EventConnection;
  artists: ArtistConnection;
  totalResults: number;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
}

export interface NewsletterResponse {
  success: boolean;
  message: string;
}

// Query variables types
export interface GetEventsVariables {
  first?: number;
  after?: string;
  where?: EventWhereInput;
  orderBy?: EventOrderByInput;
}

export interface GetEventVariables {
  slug: string;
}

export interface GetArtistsVariables {
  first?: number;
  after?: string;
  where?: ArtistWhereInput;
  orderBy?: ArtistOrderByInput;
}

export interface GetArtistVariables {
  slug: string;
}

export interface SearchVariables {
  query: string;
  first?: number;
  after?: string;
  filters?: SearchFiltersInput;
}

export interface LoginVariables {
  email: string;
  password: string;
}

export interface RegisterVariables {
  input: RegisterInput;
}

export interface BookEventVariables {
  eventId: string;
  ticketType: string;
  quantity: number;
}

export interface UpdateProfileVariables {
  input: UpdateProfileInput;
}

export interface FollowArtistVariables {
  artistId: string;
}

export interface BookmarkEventVariables {
  eventId: string;
}

export interface SubmitContactFormVariables {
  input: ContactFormInput;
}

export interface SubmitReviewVariables {
  eventId: string;
  rating: number;
  comment?: string;
}

export interface SubscribeNewsletterVariables {
  email: string;
  preferences?: NewsletterPreferencesInput;
}

// Apollo Client result types
export interface QueryResult<T> {
  data?: T;
  loading: boolean;
  error?: any;
  refetch: () => Promise<any>;
  fetchMore: (options: any) => Promise<any>;
}

export interface MutationResult<T> {
  data?: T;
  loading: boolean;
  error?: any;
}

export interface SubscriptionResult<T> {
  data?: T;
  loading: boolean;
  error?: any;
}