import React from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Skeleton,
  SkeletonText,
  Image,
  Link,
} from '@chakra-ui/react';
import { WarningIcon, RefreshIcon, EmailIcon } from '@chakra-ui/icons';

/**
 * Generic error fallback props
 */
export interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  description?: string;
  showDetails?: boolean;
  showRetry?: boolean;
  onRetry?: () => void;
  variant?: 'minimal' | 'standard' | 'detailed';
}

/**
 * Loading fallback props
 */
export interface LoadingFallbackProps {
  title?: string;
  description?: string;
  variant?: 'spinner' | 'skeleton' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Network error fallback props
 */
export interface NetworkErrorFallbackProps extends ErrorFallbackProps {
  onRetry?: () => void;
  isRetrying?: boolean;
}

/**
 * Generic Error Fallback Component
 */
export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = 'Something went wrong',
  description = 'An unexpected error occurred. Please try again.',
  showDetails = false,
  showRetry = true,
  onRetry,
  variant = 'standard',
}) => {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else if (resetError) {
      resetError();
    }
  };

  if (variant === 'minimal') {
    return (
      <Alert status="error" rounded="md">
        <AlertIcon />
        <Box>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{description}</AlertDescription>
        </Box>
      </Alert>
    );
  }

  if (variant === 'detailed') {
    return (
      <Box
        maxW="lg"
        mx="auto"
        my={8}
        p={8}
        bg="red.50"
        border="1px solid"
        borderColor="red.200"
        rounded="lg"
        textAlign="center"
      >
        <VStack spacing={6}>
          <WarningIcon boxSize={16} color="red.500" />
          <VStack spacing={3}>
            <Heading size="lg" color="red.700">
              {title}
            </Heading>
            <Text color="red.600" fontSize="md">
              {description}
            </Text>
          </VStack>
          
          {showDetails && error && process.env.NODE_ENV === 'development' && (
            <Box
              bg="white"
              p={4}
              rounded="md"
              border="1px solid"
              borderColor="red.200"
              fontSize="sm"
              textAlign="left"
              maxW="full"
              overflow="auto"
            >
              <Text fontWeight="bold" mb={2}>Error Details:</Text>
              <Text fontFamily="mono" whiteSpace="pre-wrap" color="red.700">
                {error.message}
              </Text>
            </Box>
          )}

          {showRetry && (
            <HStack spacing={3}>
              <Button
                leftIcon={<RefreshIcon />}
                colorScheme="red"
                onClick={handleRetry}
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                colorScheme="red"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </Button>
            </HStack>
          )}
        </VStack>
      </Box>
    );
  }

  // Standard variant
  return (
    <Box
      p={6}
      bg="red.50"
      border="1px solid"
      borderColor="red.200"
      rounded="md"
      textAlign="center"
    >
      <VStack spacing={4}>
        <WarningIcon color="red.500" boxSize={8} />
        <VStack spacing={2}>
          <Heading size="md" color="red.700">
            {title}
          </Heading>
          <Text color="red.600">
            {description}
          </Text>
        </VStack>
        {showRetry && (
          <Button
            size="sm"
            colorScheme="red"
            leftIcon={<RefreshIcon />}
            onClick={handleRetry}
          >
            Try Again
          </Button>
        )}
      </VStack>
    </Box>
  );
};

/**
 * Network Error Fallback Component
 */
export const NetworkErrorFallback: React.FC<NetworkErrorFallbackProps> = ({
  error,
  resetError,
  onRetry,
  isRetrying = false,
  ...props
}) => {
  return (
    <ErrorFallback
      error={error}
      resetError={resetError}
      title="Connection Problem"
      description="Unable to connect to the server. Please check your internet connection and try again."
      onRetry={onRetry}
      showRetry={!isRetrying}
      {...props}
      variant="standard"
    >
      {isRetrying && (
        <HStack spacing={2} mt={4}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.600">
            Retrying connection...
          </Text>
        </HStack>
      )}
    </ErrorFallback>
  );
};

/**
 * Loading Fallback Component
 */
export const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  title = 'Loading...',
  description,
  variant = 'spinner',
  size = 'md',
}) => {
  const spinnerSize = size === 'sm' ? 'sm' : size === 'lg' ? 'xl' : 'lg';
  
  if (variant === 'skeleton') {
    return (
      <Box p={6}>
        <VStack spacing={4} align="stretch">
          <Skeleton height="40px" />
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
          <HStack spacing={4}>
            <Skeleton height="20px" flex={1} />
            <Skeleton height="20px" flex={1} />
          </HStack>
        </VStack>
      </Box>
    );
  }

  if (variant === 'pulse') {
    return (
      <Box
        p={8}
        textAlign="center"
        bg="gray.50"
        rounded="md"
        animation="pulse 2s infinite"
      >
        <VStack spacing={4}>
          <Box
            w={16}
            h={16}
            bg="gray.300"
            rounded="full"
            animation="pulse 1.5s infinite"
          />
          <VStack spacing={2}>
            <Box h={4} w={32} bg="gray.300" rounded="md" />
            {description && <Box h={3} w={48} bg="gray.200" rounded="md" />}
          </VStack>
        </VStack>
      </Box>
    );
  }

  // Spinner variant
  return (
    <Box p={8} textAlign="center">
      <VStack spacing={4}>
        <Spinner size={spinnerSize} color="blue.500" />
        <VStack spacing={2}>
          <Text fontSize={size === 'sm' ? 'sm' : 'md'} fontWeight="medium">
            {title}
          </Text>
          {description && (
            <Text fontSize="sm" color="gray.600">
              {description}
            </Text>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

/**
 * Data Not Found Fallback Component
 */
export const NotFoundFallback: React.FC<{
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
}> = ({
  title = 'No Data Found',
  description = 'We couldn\'t find any data to display.',
  actionText = 'Try Again',
  onAction,
}) => (
  <Box p={8} textAlign="center">
    <VStack spacing={4}>
      <Box fontSize="6xl">🔍</Box>
      <VStack spacing={2}>
        <Heading size="md" color="gray.700">
          {title}
        </Heading>
        <Text color="gray.600">
          {description}
        </Text>
      </VStack>
      {onAction && (
        <Button variant="outline" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </VStack>
  </Box>
);

/**
 * Permission Denied Fallback Component
 */
export const PermissionDeniedFallback: React.FC<{
  title?: string;
  description?: string;
  contactEmail?: string;
}> = ({
  title = 'Access Denied',
  description = 'You don\'t have permission to view this content.',
  contactEmail = 'support@dreamplace.com.ar',
}) => (
  <Box
    maxW="md"
    mx="auto"
    my={8}
    p={8}
    bg="orange.50"
    border="1px solid"
    borderColor="orange.200"
    rounded="lg"
    textAlign="center"
  >
    <VStack spacing={6}>
      <Box fontSize="6xl">🔒</Box>
      <VStack spacing={3}>
        <Heading size="lg" color="orange.700">
          {title}
        </Heading>
        <Text color="orange.600">
          {description}
        </Text>
      </VStack>
      
      <VStack spacing={3}>
        <Button
          variant="outline"
          colorScheme="orange"
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
        {contactEmail && (
          <Link href={`mailto:${contactEmail}`}>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<EmailIcon />}
              colorScheme="orange"
            >
              Contact Support
            </Button>
          </Link>
        )}
      </VStack>
    </VStack>
  </Box>
);

/**
 * Maintenance Mode Fallback Component
 */
export const MaintenanceFallback: React.FC<{
  title?: string;
  description?: string;
  estimatedTime?: string;
  contactInfo?: string;
}> = ({
  title = 'Under Maintenance',
  description = 'We\'re currently performing maintenance to improve your experience.',
  estimatedTime,
  contactInfo = 'support@dreamplace.com.ar',
}) => (
  <Box
    minH="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    bg="blue.50"
    p={8}
  >
    <VStack spacing={8} textAlign="center" maxW="md">
      <Box fontSize="8xl">🔧</Box>
      <VStack spacing={4}>
        <Heading size="xl" color="blue.700">
          {title}
        </Heading>
        <Text color="blue.600" fontSize="lg">
          {description}
        </Text>
        {estimatedTime && (
          <Text color="blue.500" fontSize="sm">
            Estimated time: {estimatedTime}
          </Text>
        )}
      </VStack>
      
      <VStack spacing={3}>
        <Button
          colorScheme="blue"
          onClick={() => window.location.reload()}
          leftIcon={<RefreshIcon />}
        >
          Check Again
        </Button>
        {contactInfo && (
          <Link href={`mailto:${contactInfo}`}>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<EmailIcon />}
              colorScheme="blue"
            >
              Contact Support
            </Button>
          </Link>
        )}
      </VStack>
    </VStack>
  </Box>
);

/**
 * Image Fallback Component
 */
export const ImageFallback: React.FC<{
  width?: number | string;
  height?: number | string;
  alt?: string;
}> = ({ width = '100%', height = '200px', alt = 'Image not available' }) => (
  <Box
    width={width}
    height={height}
    bg="gray.100"
    display="flex"
    alignItems="center"
    justifyContent="center"
    color="gray.500"
    fontSize="sm"
    rounded="md"
    border="1px dashed"
    borderColor="gray.300"
  >
    <VStack spacing={2}>
      <Box fontSize="2xl">🖼️</Box>
      <Text>{alt}</Text>
    </VStack>
  </Box>
);

/**
 * Retry with exponential backoff fallback
 */
export const RetryFallback: React.FC<{
  onRetry: () => Promise<void>;
  maxRetries?: number;
  title?: string;
  description?: string;
}> = ({
  onRetry,
  maxRetries = 3,
  title = 'Loading failed',
  description = 'We\'re having trouble loading this content.',
}) => {
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);

  const handleRetry = async () => {
    if (retryCount >= maxRetries) return;

    setIsRetrying(true);
    try {
      await onRetry();
    } catch (error) {
      setRetryCount(prev => prev + 1);
    } finally {
      setIsRetrying(false);
    }
  };

  if (retryCount >= maxRetries) {
    return (
      <ErrorFallback
        title="Unable to Load"
        description="We've tried multiple times but couldn't load this content. Please refresh the page or try again later."
        showRetry={false}
      />
    );
  }

  return (
    <Box p={6} textAlign="center" bg="orange.50" rounded="md">
      <VStack spacing={4}>
        <WarningIcon color="orange.500" boxSize={8} />
        <VStack spacing={2}>
          <Heading size="sm" color="orange.700">
            {title}
          </Heading>
          <Text color="orange.600" fontSize="sm">
            {description}
          </Text>
          {retryCount > 0 && (
            <Text fontSize="xs" color="orange.500">
              Attempt {retryCount + 1} of {maxRetries}
            </Text>
          )}
        </VStack>
        <Button
          size="sm"
          colorScheme="orange"
          onClick={handleRetry}
          isLoading={isRetrying}
          loadingText="Retrying..."
          disabled={isRetrying}
        >
          Retry
        </Button>
      </VStack>
    </Box>
  );
};