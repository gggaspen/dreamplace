'use client';

import React from 'react';
import { Box, Heading, Text, Button } from '@chakra-ui/react';

interface DIErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export const DIErrorFallback: React.FC<DIErrorFallbackProps> = ({ 
  error, 
  resetErrorBoundary 
}) => {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={8}
      bg="gray.50"
    >
      <Box textAlign="center" maxW="md">
        <Heading mb={4} color="red.500">
          Application Error
        </Heading>
        <Text mb={6} color="gray.700">
          The application failed to initialize properly. This usually happens when:
          <br />
          • The API server is not accessible
          <br />
          • Environment variables are missing
          <br />
          • Network connectivity issues
        </Text>
        
        {error && (
          <Text fontSize="sm" color="gray.500" mb={6}>
            Error: {error.message}
          </Text>
        )}
        
        <Button 
          colorScheme="blue" 
          onClick={() => window.location.reload()}
          mb={4}
        >
          Reload Page
        </Button>
        
        {resetErrorBoundary && (
          <Button 
            variant="outline" 
            onClick={resetErrorBoundary}
            ml={4}
          >
            Try Again
          </Button>
        )}
        
        <Text fontSize="xs" color="gray.400" mt={6}>
          If this error persists, please check the console for more details.
        </Text>
      </Box>
    </Box>
  );
};