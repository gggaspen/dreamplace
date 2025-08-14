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

# Code formatting
npm run format
npm run format:check

# Testing
npm run test
npm run test:watch
npm run test:coverage

# Bundle analysis
npm run analyze
npm run analyze:server
npm run analyze:browser
npm run perf

# API types generation
npm run generate:api-types
```

## Architecture & Key Patterns

### Data Flow Architecture
The application follows a centralized data fetching pattern:

1. **Main Data Service** (`src/services/data.service.ts:12`): The `fetchAllData()` function orchestrates all API calls using `Promise.all()` for parallel execution
2. **Strapi Integration** (`src/services/strapi.service.ts`): All CMS data comes from Strapi backend with specific field selection and population strategies
3. **Page-level State Management**: Main page (`src/app/page.tsx:18`) uses a single loading state and data fetch on mount

### Component Structure
- **Pages Directory** (`src/app/`): Next.js 14 App Router pages with dynamic imports for code splitting
- **Components Directory** (`src/components/`): Reusable UI components including Chakra UI extensions
- **Loading Strategy**: Dynamic imports with Suspense boundaries for optimal performance
- **Container/Presentational Pattern**: Pages use container components (e.g., `AdminContent.tsx`, `LoginForm.tsx`, `DashboardContent.tsx`) for better code splitting

### Code Splitting & Performance
- **Dynamic Imports**: All major page components use Next.js `dynamic()` for code splitting
- **Lazy Loading**: Infrastructure components use lazy loading patterns with fallbacks
- **Bundle Optimization**: Webpack configuration optimized for tree shaking and chunk splitting
- **Performance Budgets**: Entrypoints limited to 400KB for optimal loading performance

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
- **@chakra-ui/react v3.1.0+**: UI component library (migrated to v3 with updated import patterns)
- **framer-motion**: Animations and transitions
- **swiper**: Carousel functionality
- **react-scroll-parallax**: Parallax effects
- **lenis**: Smooth scrolling
- **@tanstack/react-query**: Data fetching and caching
- **@sentry/nextjs**: Error monitoring and performance tracking
- **zod**: Runtime type validation
- **react-hook-form**: Form management with validation

### Removed Dependencies
- **lodash**: Replaced with native implementations for better tree shaking
- **react-spring**: Removed unused carousel library

### File Organization
- **Interfaces** (`src/interfaces/`): TypeScript type definitions for API responses
- **Services** (`src/services/`): API integration and data fetching logic
- **Utils** (`src/utils/`): Helper functions including native debounce/throttle implementations
- **Assets** (`src/assets/`): Static images and SVGs not in public directory
- **Infrastructure** (`src/infrastructure/`): Core application infrastructure
  - **API** (`src/infrastructure/api/`): Generated API clients and types
  - **Auth** (`src/infrastructure/auth/`): Authentication context and guards
  - **Config** (`src/infrastructure/config/`): Application configuration service
  - **DI** (`src/infrastructure/di/`): Dependency injection container
  - **Error Handling** (`src/infrastructure/error-handling/`): Error boundaries and logging
  - **Routing** (`src/infrastructure/routing/`): Dynamic routing and lazy loading
- **Patterns** (`src/patterns/`): Design pattern implementations
  - **Observer** (`src/patterns/observer/`): Event management system
  - **Strategy** (`src/patterns/strategy/`): Rendering engine strategies
  - **Decorator** (`src/patterns/decorator/`): Component decoration patterns

## Image Management

The application uses both local (`public/img/`) and remote images with Next.js Image optimization disabled (`next.config.mjs:10`). Remote patterns are configured for:
- i.postimg.cc
- dreamplace.com.ar
- Railway deployment URL
- res.cloudinary.com

## SEO & Meta Tags

Extensive meta tag configuration using Next.js 14 Metadata API in `layout.tsx` including:
- Open Graph tags for social sharing
- Twitter Card meta tags
- Cache control headers for Cloudflare optimization
- Security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection)
- Font preconnect links for performance optimization

## Build & Performance

### Bundle Analysis
The application includes comprehensive bundle analysis tools:
- Bundle size monitoring with detailed reports
- Webpack optimization for tree shaking
- Code splitting strategies for optimal loading
- Performance budgets to prevent bundle bloat

### Font Loading Optimization
- Google Fonts with `display: 'swap'` and proper fallbacks
- Local fonts (Geist Sans/Mono) with system fallbacks
- Preconnect links for faster font loading
- CSS font-display optimization

## Troubleshooting

### Common Issues
1. **Import/Export Errors**: Ensure proper default and named exports, especially for infrastructure components
2. **Chakra UI v3 Migration**: Use `@chakra-ui/react` v3+ import patterns, avoid deprecated components like `AlertIcon`
3. **Bundle Size Issues**: Run `npm run analyze` to identify large dependencies and optimize imports
4. **SSR Issues**: Use `export const dynamic = 'force-dynamic'` for auth-dependent pages
5. **Font Loading**: Ensure proper fallback chains and preconnect links for external fonts

### Development Server
- Expected startup time: 1.4-2.7 seconds
- Hot reload works with Next.js built-in functionality
- Code splitting loads dynamically in development mode

### Build Process
- Production builds complete successfully with expected bundle size warnings
- Tree shaking optimizations reduce final bundle size
- All routes generate properly with dynamic imports