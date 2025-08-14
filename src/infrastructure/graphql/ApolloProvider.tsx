/**
 * Apollo GraphQL Provider
 * 
 * Provider component that wraps the application with Apollo Client
 * and provides GraphQL functionality throughout the component tree.
 */

'use client';

import React from 'react';
import { ApolloProvider as BaseApolloProvider, ApolloError } from '@apollo/client';
import { useToast } from '@chakra-ui/react';
import { apolloClient } from './client';

interface ApolloProviderProps {
  children: React.ReactNode;
}

// Error boundary for GraphQL errors
class GraphQLErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('GraphQL Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong with the data connection.</h2>
          <p>Please refresh the page or try again later.</p>
          <button
            onClick={() => this.setState({ hasError: false, error: undefined })}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  const toast = useToast();

  const handleGraphQLError = (error: Error) => {
    if (error instanceof ApolloError) {
      // Handle Apollo-specific errors
      if (error.networkError) {
        toast({
          title: 'Network Error',
          description: 'Unable to connect to the server. Please check your internet connection.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } else if (error.graphQLErrors?.length > 0) {
        // Handle GraphQL errors
        error.graphQLErrors.forEach((gqlError) => {
          toast({
            title: 'Data Error',
            description: gqlError.message,
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        });
      }
    } else {
      // Handle generic errors
      toast({
        title: 'Unexpected Error',
        description: 'An unexpected error occurred. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <BaseApolloProvider client={apolloClient}>
      <GraphQLErrorBoundary onError={handleGraphQLError}>
        {children}
      </GraphQLErrorBoundary>
    </BaseApolloProvider>
  );
}

export default ApolloProvider;