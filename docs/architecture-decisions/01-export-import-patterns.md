# Architecture Decision Record: Export/Import Pattern Standardization

**Date**: 2025-08-14  
**Status**: Accepted  
**Context**: Phase 6.2 - DreamPlace Error Resolution  

## Decision

Standardize export/import patterns across the codebase to prevent module resolution failures and improve maintainability.

## Context

During the Phase 5.2 Advanced Design Patterns refactoring, multiple export/import mismatches caused critical build failures:
- Missing default exports (`AppConfig`, `Logger`)
- Inconsistent named vs default export patterns
- Circular dependencies in routing modules
- Module resolution failures affecting core functionality

## Decision Details

### 1. Export Pattern Standards

#### Infrastructure Services (Config, Logging, DI)
```typescript
// Pattern: Default export with named alternatives
class AppConfigService { /* implementation */ }
export default AppConfigService;
export { AppConfigService };
export const configService = new AppConfigService();
```

#### React Components
```typescript
// Pattern: Default export for components, named for utilities
const LoadingScreen: React.FC = () => { /* implementation */ };
export default LoadingScreen;
export { LoadingScreen }; // Named export for explicit imports
```

#### Utility Functions and Classes
```typescript
// Pattern: Named exports for utilities, default for main export
export class Logger { /* implementation */ }
export const createLazyComponent = () => { /* implementation */ };
export default Logger; // If there's a primary class
```

### 2. Import Pattern Standards

#### Infrastructure Dependencies
```typescript
// Use named imports for clarity and tree shaking
import { configService } from '@/infrastructure/config/AppConfig';
import { Logger } from '@/infrastructure/logging/Logger';
```

#### React Components
```typescript
// Default imports for components
import LoadingScreen from '@/components/loading-screen/LoadingScreen';
// Or named imports when needed explicitly
import { LoadingScreen } from '@/components/loading-screen/LoadingScreen';
```

#### Next.js Dynamic Imports
```typescript
// Standardized pattern for code splitting
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('@/components/Component'), {
  loading: () => <LoadingScreen />,
  ssr: false // or true based on SSR requirements
});
```

### 3. Circular Dependency Prevention

#### Before (Problematic)
```typescript
// LazyLoader.tsx importing from LazyRoutes.tsx
// LazyRoutes.tsx importing from LazyLoader.tsx
// Creates circular dependency
```

#### After (Resolved)
```typescript
// Clear dependency hierarchy:
// LazyLoader.tsx -> Standalone utility
// LazyRoutes.tsx -> Uses LazyLoader utilities
// No reverse dependencies
```

#### Dependency Injection Pattern
```typescript
// Use DI container to break circular dependencies
// Register services in container
container.registerSingleton('logger', () => new Logger());
// Inject dependencies without direct imports
const logger = container.resolve<Logger>('logger');
```

### 4. Module Resolution Strategy

#### Path Aliases
```typescript
// Consistent use of @ alias for src directory
import { Component } from '@/components/Component';
import { service } from '@/services/service';
```

#### Barrel Exports (Selective Use)
```typescript
// Only for closely related utilities
// /utils/index.ts
export { debounce } from './debounce';
export { throttle } from './throttle';

// Avoid for large modules to prevent bundle bloat
```

## Consequences

### Positive
- **Build Reliability**: Eliminates module resolution failures
- **Development Experience**: Clear patterns reduce confusion
- **Maintainability**: Consistent patterns easier to follow
- **Tree Shaking**: Better optimization with explicit imports
- **Debugging**: Clearer import chains for troubleshooting

### Negative
- **Migration Effort**: Existing code requires updates
- **Verbosity**: Some imports become more explicit
- **Learning Curve**: Developers need to follow patterns

## Implementation Strategy

### Phase 1: Critical Infrastructure
1. Fix core service exports (AppConfig, Logger, DI Container)
2. Standardize component exports (LoadingScreen, ErrorBoundary)
3. Resolve circular dependencies in routing

### Phase 2: Component Layer
1. Update all React component export patterns
2. Standardize utility function exports
3. Implement consistent import patterns

### Phase 3: Verification
1. Build system verification
2. Runtime testing
3. Import graph analysis

## Monitoring

- Build success rate
- Bundle size impact
- Developer feedback on patterns
- Runtime error frequency

## Related Decisions

- [Bundle Optimization Strategy](./03-bundle-optimization-decisions.md)
- [Chakra UI Migration Strategy](./02-chakra-ui-migration.md)

---

*This ADR addresses the export/import pattern standardization decisions made during the DreamPlace error resolution process.*