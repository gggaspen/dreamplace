// Error Boundary Components
export { ErrorBoundary } from './ErrorBoundary';
export type { ErrorBoundaryProps, ErrorBoundaryState } from './ErrorBoundary';

// Higher-Order Components and Hooks
export {
  withPageErrorBoundary,
  withSectionErrorBoundary,
  withComponentErrorBoundary,
  withAsyncErrorBoundary,
  useErrorBoundary,
  SuspenseErrorBoundary,
} from './ErrorBoundaryHOCs';

// Error Handling Service
export {
  ErrorHandlingService,
  errorHandlingService,
  ErrorHandlers,
  ErrorSeverity,
  ErrorCategory,
} from './ErrorHandlingService';
export type { ErrorReport, ErrorHandler, RecoveryStrategy } from './ErrorHandlingService';
