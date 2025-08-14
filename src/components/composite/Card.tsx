/**
 * Card Composition Components
 *
 * Composable card components that can be combined to create
 * different card layouts. Each component has a specific purpose
 * and can be used independently or together.
 */

import React, { ReactNode } from 'react';
import { Box, Flex, Text, BoxProps, FlexProps, TextProps } from '@chakra-ui/react';

// Base card container
interface CardProps extends BoxProps {
  children: ReactNode;
  elevated?: boolean;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = true,
  interactive = false,
  ...props
}) => {
  return (
    <Box
      bg='white'
      borderRadius='lg'
      overflow='hidden'
      boxShadow={elevated ? 'lg' : 'none'}
      border={!elevated ? '1px solid' : 'none'}
      borderColor={!elevated ? 'gray.200' : 'transparent'}
      transition={interactive ? 'all 0.2s ease' : undefined}
      _hover={
        interactive
          ? {
              transform: 'translateY(-2px)',
              boxShadow: 'xl',
            }
          : undefined
      }
      cursor={interactive ? 'pointer' : 'default'}
      {...props}
    >
      {children}
    </Box>
  );
};

// Card header component
interface CardHeaderProps extends FlexProps {
  children: ReactNode;
  divided?: boolean;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, divided = true, ...props }) => {
  return (
    <Flex
      p={4}
      align='center'
      borderBottom={divided ? '1px solid' : 'none'}
      borderBottomColor='gray.200'
      {...props}
    >
      {children}
    </Flex>
  );
};

// Card body component
interface CardBodyProps extends BoxProps {
  children: ReactNode;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, ...props }) => {
  return (
    <Box p={4} {...props}>
      {children}
    </Box>
  );
};

// Card footer component
interface CardFooterProps extends FlexProps {
  children: ReactNode;
  divided?: boolean;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, divided = true, ...props }) => {
  return (
    <Flex
      p={4}
      align='center'
      borderTop={divided ? '1px solid' : 'none'}
      borderTopColor='gray.200'
      {...props}
    >
      {children}
    </Flex>
  );
};

// Card title component
interface CardTitleProps extends TextProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, level = 3, ...props }) => {
  const sizeMap = {
    1: 'xl',
    2: 'lg',
    3: 'md',
    4: 'sm',
    5: 'sm',
    6: 'xs',
  } as const;

  return (
    <Text
      as={`h${level}`}
      fontSize={sizeMap[level]}
      fontWeight='semibold'
      lineHeight='tight'
      {...props}
    >
      {children}
    </Text>
  );
};

// Card description component
interface CardDescriptionProps extends TextProps {
  children: ReactNode;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({ children, ...props }) => {
  return (
    <Text fontSize='sm' color='gray.600' mt={1} {...props}>
      {children}
    </Text>
  );
};
