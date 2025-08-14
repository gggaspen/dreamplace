/**
 * GraphQL Schema Definitions
 *
 * Type definitions and schemas for GraphQL operations.
 * These define the structure of data that can be queried and mutated.
 */

import { gql } from '@apollo/client';

// Fragment definitions for reusable field sets
export const FRAGMENTS = {
  // Basic Event Fields
  EVENT_BASIC: gql`
    fragment EventBasic on Event {
      id
      title
      slug
      description
      status
      startDate
      endDate
      createdAt
      updatedAt
    }
  `,

  // Full Event Fields
  EVENT_FULL: gql`
    fragment EventFull on Event {
      id
      title
      slug
      description
      longDescription
      status
      startDate
      endDate
      location {
        id
        name
        address
        city
        country
        latitude
        longitude
      }
      coverImage {
        id
        url
        alt
        width
        height
      }
      gallery {
        id
        url
        alt
        width
        height
      }
      artists {
        id
        name
        slug
        bio
        profileImage {
          id
          url
          alt
        }
        socialMedia {
          instagram
          facebook
          soundcloud
          spotify
        }
      }
      tickets {
        id
        type
        name
        price
        currency
        available
        maxPerUser
      }
      tags {
        id
        name
        color
      }
      createdAt
      updatedAt
    }
  `,

  // Basic Artist Fields
  ARTIST_BASIC: gql`
    fragment ArtistBasic on Artist {
      id
      name
      slug
      bio
      profileImage {
        id
        url
        alt
      }
      createdAt
      updatedAt
    }
  `,

  // Full Artist Fields
  ARTIST_FULL: gql`
    fragment ArtistFull on Artist {
      id
      name
      slug
      bio
      longBio
      profileImage {
        id
        url
        alt
        width
        height
      }
      gallery {
        id
        url
        alt
        width
        height
      }
      socialMedia {
        instagram
        facebook
        twitter
        soundcloud
        spotify
        website
      }
      genres {
        id
        name
        color
      }
      stats {
        followers
        totalEvents
        totalPlays
      }
      upcomingEvents {
        id
        title
        slug
        startDate
        location {
          name
          city
        }
      }
      createdAt
      updatedAt
    }
  `,

  // User Fields
  USER_BASIC: gql`
    fragment UserBasic on User {
      id
      email
      firstName
      lastName
      username
      profileImage {
        id
        url
        alt
      }
      role
      isVerified
      createdAt
    }
  `,

  // Pagination Info
  PAGE_INFO: gql`
    fragment PageInfo on PageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
      totalCount
    }
  `,
};

// Query definitions
export const QUERIES = {
  // Get all events with pagination
  GET_EVENTS: gql`
    query GetEvents(
      $first: Int
      $after: String
      $where: EventWhereInput
      $orderBy: EventOrderByInput
    ) {
      events(first: $first, after: $after, where: $where, orderBy: $orderBy) {
        edges {
          node {
            ...EventFull
          }
          cursor
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
    ${FRAGMENTS.EVENT_FULL}
    ${FRAGMENTS.PAGE_INFO}
  `,

  // Get single event by slug
  GET_EVENT: gql`
    query GetEvent($slug: String!) {
      event(slug: $slug) {
        ...EventFull
        attendees {
          id
          firstName
          lastName
          profileImage {
            url
            alt
          }
        }
        reviews {
          id
          rating
          comment
          user {
            ...UserBasic
          }
          createdAt
        }
      }
    }
    ${FRAGMENTS.EVENT_FULL}
    ${FRAGMENTS.USER_BASIC}
  `,

  // Get all artists with pagination
  GET_ARTISTS: gql`
    query GetArtists(
      $first: Int
      $after: String
      $where: ArtistWhereInput
      $orderBy: ArtistOrderByInput
    ) {
      artists(first: $first, after: $after, where: $where, orderBy: $orderBy) {
        edges {
          node {
            ...ArtistFull
          }
          cursor
        }
        pageInfo {
          ...PageInfo
        }
      }
    }
    ${FRAGMENTS.ARTIST_FULL}
    ${FRAGMENTS.PAGE_INFO}
  `,

  // Get single artist by slug
  GET_ARTIST: gql`
    query GetArtist($slug: String!) {
      artist(slug: $slug) {
        ...ArtistFull
        followers {
          id
          firstName
          lastName
          profileImage {
            url
            alt
          }
        }
        pastEvents {
          id
          title
          slug
          startDate
          coverImage {
            url
            alt
          }
          location {
            name
            city
          }
        }
      }
    }
    ${FRAGMENTS.ARTIST_FULL}
  `,

  // Search functionality
  SEARCH: gql`
    query Search($query: String!, $first: Int, $after: String, $filters: SearchFiltersInput) {
      search(query: $query, first: $first, after: $after, filters: $filters) {
        events {
          edges {
            node {
              ...EventBasic
              coverImage {
                url
                alt
              }
              location {
                name
                city
              }
            }
          }
          pageInfo {
            ...PageInfo
          }
        }
        artists {
          edges {
            node {
              ...ArtistBasic
            }
          }
          pageInfo {
            ...PageInfo
          }
        }
        totalResults
      }
    }
    ${FRAGMENTS.EVENT_BASIC}
    ${FRAGMENTS.ARTIST_BASIC}
    ${FRAGMENTS.PAGE_INFO}
  `,

  // Get current user
  GET_CURRENT_USER: gql`
    query GetCurrentUser {
      me {
        ...UserBasic
        preferences {
          theme
          emailNotifications
          pushNotifications
          language
        }
        bookmarks {
          events {
            ...EventBasic
          }
          artists {
            ...ArtistBasic
          }
        }
        attendedEvents {
          ...EventBasic
        }
      }
    }
    ${FRAGMENTS.USER_BASIC}
    ${FRAGMENTS.EVENT_BASIC}
    ${FRAGMENTS.ARTIST_BASIC}
  `,

  // Get featured content
  GET_FEATURED_CONTENT: gql`
    query GetFeaturedContent {
      featuredEvents {
        ...EventFull
      }
      featuredArtists {
        ...ArtistFull
      }
      upcomingEvents(first: 6) {
        ...EventBasic
        coverImage {
          url
          alt
        }
      }
      popularArtists(first: 6) {
        ...ArtistBasic
      }
    }
    ${FRAGMENTS.EVENT_FULL}
    ${FRAGMENTS.EVENT_BASIC}
    ${FRAGMENTS.ARTIST_FULL}
    ${FRAGMENTS.ARTIST_BASIC}
  `,
};

// Mutation definitions
export const MUTATIONS = {
  // Authentication
  LOGIN: gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          ...UserBasic
        }
        token
        refreshToken
      }
    }
    ${FRAGMENTS.USER_BASIC}
  `,

  REGISTER: gql`
    mutation Register($input: RegisterInput!) {
      register(input: $input) {
        user {
          ...UserBasic
        }
        token
        refreshToken
      }
    }
    ${FRAGMENTS.USER_BASIC}
  `,

  LOGOUT: gql`
    mutation Logout {
      logout
    }
  `,

  // Event operations
  BOOK_EVENT: gql`
    mutation BookEvent($eventId: ID!, $ticketType: String!, $quantity: Int!) {
      bookEvent(eventId: $eventId, ticketType: $ticketType, quantity: $quantity) {
        id
        event {
          ...EventBasic
        }
        ticketType
        quantity
        totalPrice
        status
        qrCode
        createdAt
      }
    }
    ${FRAGMENTS.EVENT_BASIC}
  `,

  CANCEL_BOOKING: gql`
    mutation CancelBooking($bookingId: ID!) {
      cancelBooking(bookingId: $bookingId) {
        id
        status
      }
    }
  `,

  // User operations
  UPDATE_PROFILE: gql`
    mutation UpdateProfile($input: UpdateProfileInput!) {
      updateProfile(input: $input) {
        ...UserBasic
      }
    }
    ${FRAGMENTS.USER_BASIC}
  `,

  FOLLOW_ARTIST: gql`
    mutation FollowArtist($artistId: ID!) {
      followArtist(artistId: $artistId) {
        id
        isFollowing
      }
    }
  `,

  UNFOLLOW_ARTIST: gql`
    mutation UnfollowArtist($artistId: ID!) {
      unfollowArtist(artistId: $artistId) {
        id
        isFollowing
      }
    }
  `,

  BOOKMARK_EVENT: gql`
    mutation BookmarkEvent($eventId: ID!) {
      bookmarkEvent(eventId: $eventId) {
        id
        isBookmarked
      }
    }
  `,

  REMOVE_BOOKMARK: gql`
    mutation RemoveBookmark($eventId: ID!) {
      removeBookmark(eventId: $eventId) {
        id
        isBookmarked
      }
    }
  `,

  // Contact and feedback
  SUBMIT_CONTACT_FORM: gql`
    mutation SubmitContactForm($input: ContactFormInput!) {
      submitContactForm(input: $input) {
        success
        message
      }
    }
  `,

  SUBMIT_REVIEW: gql`
    mutation SubmitReview($eventId: ID!, $rating: Int!, $comment: String) {
      submitReview(eventId: $eventId, rating: $rating, comment: $comment) {
        id
        rating
        comment
        user {
          ...UserBasic
        }
        createdAt
      }
    }
    ${FRAGMENTS.USER_BASIC}
  `,

  // Newsletter subscription
  SUBSCRIBE_NEWSLETTER: gql`
    mutation SubscribeNewsletter($email: String!, $preferences: NewsletterPreferencesInput) {
      subscribeNewsletter(email: $email, preferences: $preferences) {
        success
        message
      }
    }
  `,
};

// Subscription definitions
export const SUBSCRIPTIONS = {
  // Real-time event updates
  EVENT_UPDATED: gql`
    subscription EventUpdated($eventId: ID!) {
      eventUpdated(eventId: $eventId) {
        ...EventFull
      }
    }
    ${FRAGMENTS.EVENT_FULL}
  `,

  // Real-time ticket availability updates
  TICKET_AVAILABILITY_CHANGED: gql`
    subscription TicketAvailabilityChanged($eventId: ID!) {
      ticketAvailabilityChanged(eventId: $eventId) {
        id
        type
        available
        sold
      }
    }
  `,

  // New events notification
  NEW_EVENT_CREATED: gql`
    subscription NewEventCreated($artistIds: [ID!]) {
      newEventCreated(artistIds: $artistIds) {
        ...EventBasic
        artists {
          ...ArtistBasic
        }
      }
    }
    ${FRAGMENTS.EVENT_BASIC}
    ${FRAGMENTS.ARTIST_BASIC}
  `,

  // Artist updates
  ARTIST_UPDATED: gql`
    subscription ArtistUpdated($artistId: ID!) {
      artistUpdated(artistId: $artistId) {
        ...ArtistFull
      }
    }
    ${FRAGMENTS.ARTIST_FULL}
  `,

  // User notifications
  USER_NOTIFICATION: gql`
    subscription UserNotification($userId: ID!) {
      userNotification(userId: $userId) {
        id
        type
        title
        message
        data
        isRead
        createdAt
      }
    }
  `,
};
