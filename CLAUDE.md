# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DreamPlace is a Next.js 14 web application for an electronic music event/artist platform. It's built with modern React patterns using TypeScript, Chakra UI, and Tailwind CSS. The application fetches content from a Strapi CMS backend and displays sections for events, carousels, Spotify integration, contact information, and artist showcases.

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Production server
npm start

# Linting
npm run lint
```

## Architecture & Key Patterns

### Data Flow Architecture
The application follows a centralized data fetching pattern:

1. **Main Data Service** (`src/services/data.service.ts:12`): The `fetchAllData()` function orchestrates all API calls using `Promise.all()` for parallel execution
2. **Strapi Integration** (`src/services/strapi.service.ts`): All CMS data comes from Strapi backend with specific field selection and population strategies
3. **Page-level State Management**: Main page (`src/app/page.tsx:18`) uses a single loading state and data fetch on mount

### Component Structure
- **Pages Directory** (`src/app/pages/`): Contains major sections (hero, carousel, contact, press, resident)
- **Components Directory** (`src/components/`): Reusable UI components including Chakra UI extensions
- **Loading Strategy**: Single loading screen until all data is fetched (`src/components/loading-screen/LoadingScreen.tsx`)

### Styling Architecture
- **Chakra UI**: Primary component library with custom provider setup (`src/components/ui/provider.tsx`)
- **Tailwind CSS**: Utility classes for layout and spacing
- **Custom Fonts**: Geist Sans/Mono and Poppins loaded locally (`src/app/layout.tsx:8-17`)

## API Integration

### Strapi CMS Backend
The application expects a Strapi backend at `NEXT_PUBLIC_API_URL` with these content types:
- Events (with active event filtering)
- Hero sections
- Carousels with image galleries
- Spotify sections
- Contact sections
- Artist sections with nested photos/links
- Footer sections

### API Call Patterns
All Strapi calls use field selection and population to minimize payload:
```javascript
// Example from strapi.service.ts:24
`${API_URL}/api/hero-sections?fields[0]=title&fields[1]=subtitle&populate[cover_mobile][fields][0]=url`
```

## Development Notes

### Environment Setup
- Uses Next.js 14 with App Router
- TypeScript configuration includes strict mode
- Images optimized through Next.js with remote patterns for external hosts
- Firebase integration for additional services

### Key Dependencies
- **@chakra-ui/react**: UI component library
- **framer-motion**: Animations and transitions
- **swiper**: Carousel functionality
- **react-scroll-parallax**: Parallax effects
- **lenis**: Smooth scrolling

### File Organization
- **Interfaces** (`src/interfaces/`): TypeScript type definitions for API responses
- **Services** (`src/services/`): API integration and data fetching logic
- **Utils** (`src/utils/`): Helper functions for formatting and URL generation
- **Assets** (`src/assets/`): Static images and SVGs not in public directory

## Image Management

The application uses both local (`public/img/`) and remote images with Next.js Image optimization disabled (`next.config.mjs:10`). Remote patterns are configured for:
- i.postimg.cc
- dreamplace.com.ar
- Railway deployment URL
- res.cloudinary.com

## SEO & Meta Tags

Extensive meta tag configuration in `layout.tsx:34-90` including:
- Open Graph tags for social sharing
- Twitter Card meta tags
- Cache control headers for Cloudflare optimization
- Security headers (X-Content-Type-Options, X-Frame-Options)