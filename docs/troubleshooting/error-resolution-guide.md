# DreamPlace Error Resolution and Troubleshooting Guide

**Last Updated**: 2025-08-14  
**Version**: 2.0  
**Context**: Post Phase 5.2 Advanced Design Patterns Implementation  

## Overview

This guide provides systematic approaches to diagnosing and resolving common issues in the DreamPlace Next.js application, based on lessons learned during the comprehensive error resolution process.

---

## 🚨 Critical Error Categories

### 1. Export/Import Resolution Failures

#### Symptoms
- `Module not found` errors during build
- `Cannot find function/class` runtime errors
- `undefined is not a function` errors
- Circular dependency warnings

#### Common Causes
```bash
# Missing default exports
Error: Module "src/config/AppConfig" has no default export

# Inconsistent export patterns  
Error: Named export 'Logger' not found in module

# Circular dependencies
Warn: Circular dependency detected between modules
```

#### Diagnostic Process
```bash
# 1. Check export statement in source file
grep -n "export" src/path/to/file.ts

# 2. Check import statement in consuming file  
grep -n "import.*FileName" src/path/to/consumer.ts

# 3. Verify file exists and is accessible
ls -la src/path/to/file.ts

# 4. Check for circular dependencies
npm run build 2>&1 | grep -i "circular"
```

#### Resolution Strategy
```typescript
// 1. Standardize export patterns
// For services and utilities
export class ServiceName { }
export default ServiceName;
export const serviceInstance = new ServiceName();

// For React components  
const ComponentName: React.FC = () => { };
export default ComponentName;
export { ComponentName }; // Named export for explicit imports

// 2. Fix import statements to match exports
import ServiceName from '@/services/ServiceName'; // Default import
import { ServiceName } from '@/services/ServiceName'; // Named import
import { serviceInstance } from '@/services/ServiceName'; // Instance import
```

#### Prevention
- Establish consistent export patterns across the codebase
- Use TypeScript strict mode to catch export issues early
- Implement import linting rules
- Regular circular dependency analysis

### 2. Chakra UI Component Issues

#### Symptoms
- `Component 'AlertIcon' not found` errors
- Deprecated import warnings
- UI components not rendering correctly
- Form component failures

#### Common Causes
```bash
# Using deprecated v2 components in v3
Error: export 'AlertIcon' was not found in '@chakra-ui/react'

# Outdated form patterns
Error: export 'FormControl' was not found in '@chakra-ui/react'

# Incorrect provider setup
Error: useChakra must be used within a ChakraProvider
```

#### Diagnostic Process
```bash
# 1. Check Chakra UI version
npm list @chakra-ui/react

# 2. Find all Chakra UI imports
grep -r "from '@chakra-ui" src/

# 3. Check for deprecated components
grep -r "AlertIcon\|FormControl\|FormLabel" src/

# 4. Verify provider setup
grep -r "ChakraProvider\|Provider" src/
```

#### Resolution Strategy
```typescript
// 1. Update deprecated components
// Before (v2 - deprecated)
import { AlertIcon, FormControl, FormLabel } from '@chakra-ui/react';

// After (v3 - modern)
import { Icon, InfoIcon, Field } from '@chakra-ui/react';

// 2. Modernize form patterns
// Before (v2)
<FormControl>
  <FormLabel>Email</FormLabel>
  <Input type="email" />
</FormControl>

// After (v3)
<Field.Root>
  <Field.Label>Email</Field.Label>
  <Field.Input type="email" />
  <Field.ErrorMessage />
</Field.Root>

// 3. Update provider setup
import { Provider } from '@/components/ui/provider';
// Use modern Provider component with proper configuration
```

#### Prevention
- Keep Chakra UI dependencies up to date
- Use official migration guides for major version updates
- Implement component usage linting
- Regular component audit for deprecated patterns

### 3. Bundle Size and Performance Issues

#### Symptoms
- Build warnings about large bundle sizes
- Slow application loading
- Development server startup delays
- "Entrypoint exceeds size limit" warnings

#### Common Causes
```bash
# Large bundle chunks
Warning: entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB).

# Inefficient imports
Warning: Large chunk detected: 773.js (1.07 MiB)

# Unused dependencies
Warning: Dependency not tree-shakeable
```

#### Diagnostic Process
```bash
# 1. Analyze bundle composition
npm run analyze

# 2. Check for large dependencies
npm run build -- --analyze

# 3. Identify import patterns
grep -r "import \*" src/
grep -r "import.*from 'lodash'" src/

# 4. Check for unused dependencies
npx depcheck
```

#### Resolution Strategy
```javascript
// 1. Implement code splitting
import dynamic from 'next/dynamic';

const LazyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingScreen />,
  ssr: false
});

// 2. Optimize imports
// Before (heavy barrel import)
import * as _ from 'lodash';

// After (selective or native replacement)
import { debounce } from '@/utils/debounce'; // Custom implementation

// 3. Configure webpack optimization
// next.config.mjs
experimental: {
  optimizePackageImports: [
    '@chakra-ui/react',
    'react-icons'
  ]
}

// 4. Implement performance budgets
webpack: (config) => {
  config.performance = {
    maxEntrypointSize: 400000, // 400KB
    maxAssetSize: 500000       // 500KB
  };
}
```

#### Prevention
- Regular bundle analysis (weekly/bi-weekly)
- Performance budgets in CI/CD
- Import pattern linting
- Dependency usage audits

---

## 🔧 Systematic Debugging Process

### Step 1: Error Classification
```bash
# Identify error category
npm run build 2>&1 | head -20

# Common patterns to look for:
# - "Module not found" → Import/Export issue
# - "not found in" → Component/dependency issue  
# - "exceeds the recommended limit" → Bundle size issue
# - "Circular dependency" → Architecture issue
```

### Step 2: Isolation Testing
```bash
# Test specific components/modules
npm run build -- --debug
npm run dev # Check if dev server starts

# Test individual pages
# Navigate to each route and check console
```

### Step 3: Dependency Verification
```bash
# Check dependencies
npm ls --depth=0
npm outdated

# Verify peer dependencies
npm ls --depth=1 | grep -E "(UNMET|missing)"
```

### Step 4: Build Analysis
```bash
# Full build with analysis
npm run analyze

# Check specific bundle chunks
npm run build && ls -la .next/static/chunks/
```

---

## 📋 Quick Resolution Checklists

### Import/Export Issues Checklist
- [ ] Verify file exists at expected path
- [ ] Check export statement matches import statement
- [ ] Ensure default vs named export consistency
- [ ] Look for circular dependency chains
- [ ] Verify TypeScript compilation
- [ ] Test import in isolation

### Component Issues Checklist
- [ ] Verify component library version compatibility
- [ ] Check for deprecated component usage
- [ ] Ensure provider setup is correct
- [ ] Test component in isolation
- [ ] Verify prop types and interfaces
- [ ] Check for missing peer dependencies

### Performance Issues Checklist
- [ ] Run bundle analysis
- [ ] Check for large dependencies
- [ ] Verify tree shaking effectiveness
- [ ] Review import patterns
- [ ] Test code splitting implementation
- [ ] Monitor build output sizes

### Build Process Checklist
- [ ] Clear Next.js cache (`.next` directory)
- [ ] Clear node_modules and reinstall
- [ ] Check Node.js version compatibility
- [ ] Verify package.json integrity
- [ ] Test with clean environment
- [ ] Check for file system permissions

---

## 🛠 Development Tools and Commands

### Diagnostic Commands
```bash
# Build with detailed output
npm run build -- --debug

# Development with enhanced logging
npm run dev -- --experimental-debug

# Bundle analysis
npm run analyze
npm run analyze:browser
npm run analyze:server

# Dependency analysis
npx depcheck
npm audit
npm ls --depth=0
```

### Debugging Utilities
```bash
# Find import/export patterns
grep -r "export.*default" src/
grep -r "import.*from" src/ | grep -v node_modules

# Find large files
find src/ -name "*.ts" -o -name "*.tsx" | xargs wc -l | sort -n | tail -10

# Check circular dependencies  
npm run build 2>&1 | grep -i circular | head -10
```

### Performance Monitoring
```bash
# Bundle size tracking
npm run build && du -sh .next/static/chunks/*

# Build time measurement
time npm run build

# Development server startup time
time npm run dev
```

---

## 📚 Reference Materials

### Official Documentation
- [Next.js Error Messages](https://nextjs.org/docs/messages)
- [Chakra UI Migration Guide](https://chakra-ui.com/docs/migration)
- [Webpack Bundle Analysis](https://webpack.js.org/guides/bundle-analysis/)

### Common Error Patterns
- [Module Resolution Issues](https://nextjs.org/docs/messages/module-not-found)
- [React Component Errors](https://reactjs.org/docs/error-boundaries.html)
- [TypeScript Configuration](https://nextjs.org/docs/basic-features/typescript)

### Performance Resources  
- [Web.dev Performance](https://web.dev/performance/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Bundle Optimization](https://webpack.js.org/guides/tree-shaking/)

---

## 🚀 Emergency Recovery Procedures

### Complete Build Failure Recovery
```bash
# 1. Clear all caches
rm -rf .next node_modules package-lock.json
npm install

# 2. Rollback to known working state
git stash
git checkout main  # or last known working branch

# 3. Incremental restoration
git cherry-pick <working-commit>
npm run build  # Test after each change
```

### Development Server Won't Start
```bash
# 1. Port conflict resolution
lsof -ti:3000 | xargs kill -9

# 2. Clear Next.js cache
rm -rf .next

# 3. Clean dependency installation
rm -rf node_modules package-lock.json
npm install

# 4. Start with verbose logging
npm run dev -- --experimental-debug
```

### Critical Component Failures
```bash
# 1. Isolate component
# Create minimal test file with just the failing component

# 2. Check dependencies
npm ls <component-library>

# 3. Verify import paths
# Use absolute paths for testing

# 4. Fallback implementation
# Create temporary placeholder component
```

---

## ⚡ Performance Optimization Quick Wins

### Immediate Improvements
```bash
# 1. Enable tree shaking
# Add to next.config.mjs:
experimental: {
  optimizePackageImports: ['@chakra-ui/react', 'react-icons']
}

# 2. Implement dynamic imports
# Convert heavy components to lazy loading

# 3. Optimize images
# Use next/image for all images

# 4. Remove unused dependencies
npx depcheck
npm uninstall <unused-package>
```

### Long-term Optimizations
- Implement comprehensive code splitting strategy
- Set up performance budgets in CI/CD
- Regular bundle analysis and optimization
- Progressive web app (PWA) features

---

*This troubleshooting guide is based on real-world error resolution experience from the DreamPlace application. Keep this document updated as new issues and solutions are discovered.*