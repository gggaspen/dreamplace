/**
 * Layout Composition Components
 * 
 * These components use composition over inheritance to create flexible
 * layout structures. Each component has a single responsibility and
 * can be composed together for complex layouts.
 */

import React, { ReactNode } from 'react';
import { Box, Flex, FlexProps, BoxProps } from '@chakra-ui/react';

// Base layout container
interface LayoutProps extends BoxProps {
  children: ReactNode;
  fullHeight?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  fullHeight = false,
  ...props 
}) => {
  return (
    <Box 
      minH={fullHeight ? '100vh' : 'auto'}
      display="flex"
      flexDirection="column"
      {...props}
    >
      {children}
    </Box>
  );
};

// Header composition component
interface LayoutHeaderProps extends FlexProps {
  children: ReactNode;
  sticky?: boolean;
  zIndex?: number;
}

export const LayoutHeader: React.FC<LayoutHeaderProps> = ({ 
  children, 
  sticky = false,
  zIndex = 10,
  ...props 
}) => {
  return (
    <Flex
      as="header"
      position={sticky ? 'sticky' : 'relative'}
      top={sticky ? 0 : 'auto'}
      zIndex={zIndex}
      w="full"
      flexShrink={0}
      {...props}
    >
      {children}
    </Flex>
  );
};

// Main content composition component
interface LayoutMainProps extends BoxProps {
  children: ReactNode;
  fillHeight?: boolean;
}

export const LayoutMain: React.FC<LayoutMainProps> = ({ 
  children, 
  fillHeight = true,
  ...props 
}) => {
  return (
    <Box
      as="main"
      flex={fillHeight ? 1 : 'initial'}
      w="full"
      {...props}
    >
      {children}
    </Box>
  );
};

// Footer composition component
interface LayoutFooterProps extends FlexProps {
  children: ReactNode;
  sticky?: boolean;
  zIndex?: number;
}

export const LayoutFooter: React.FC<LayoutFooterProps> = ({ 
  children,
  sticky = false,
  zIndex = 5,
  ...props 
}) => {
  return (
    <Flex
      as="footer"
      position={sticky ? 'sticky' : 'relative'}
      bottom={sticky ? 0 : 'auto'}
      zIndex={zIndex}
      w="full"
      flexShrink={0}
      {...props}
    >
      {children}
    </Flex>
  );
};

// Sidebar composition component
interface LayoutSidebarProps extends BoxProps {
  children: ReactNode;
  position?: 'left' | 'right';
  collapsible?: boolean;
  collapsed?: boolean;
}

export const LayoutSidebar: React.FC<LayoutSidebarProps> = ({ 
  children,
  position = 'left',
  collapsible = false,
  collapsed = false,
  ...props 
}) => {
  return (
    <Box
      as="aside"
      order={position === 'left' ? -1 : 1}
      w={collapsed ? '0' : 'auto'}
      overflow={collapsed ? 'hidden' : 'visible'}
      transition={collapsible ? 'width 0.3s ease' : undefined}
      {...props}
    >
      {children}
    </Box>
  );
};