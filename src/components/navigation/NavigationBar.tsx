/**
 * Main Navigation Bar Component
 * Provides primary navigation with breadcrumbs and user menu
 */

'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Flex,
  HStack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Avatar,
  Text,
  IconButton,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { RouteHelpers, NavigationItem } from '@/infrastructure/routing/RouteHelpers';
import { Breadcrumbs } from './Breadcrumbs';
import Logo from '@/components/logo/Logo';

export function NavigationBar() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const isMobile = useBreakpointValue({ base: true, md: false });
  const showBreadcrumbs = useBreakpointValue({ base: false, lg: true });

  const navigationItems = RouteHelpers.getNavigationItems(user?.profile.roles || []);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <Box
      bg='white'
      borderBottom='1px'
      borderColor='gray.200'
      position='sticky'
      top={0}
      zIndex={1000}
    >
      <Flex maxW='container.xl' mx='auto' px={4} py={3} align='center' justify='space-between'>
        {/* Logo */}
        <Link href='/'>
          <Logo w='120px' mode='full' />
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <HStack spacing={6} flex={1} justify='center'>
            {navigationItems.map(item => (
              <Button
                key={item.path}
                as={Link}
                href={item.path}
                variant={RouteHelpers.matchesRoute(pathname, item.path) ? 'solid' : 'ghost'}
                colorScheme={RouteHelpers.matchesRoute(pathname, item.path) ? 'blue' : 'gray'}
                size='sm'
              >
                {item.label}
              </Button>
            ))}
          </HStack>
        )}

        {/* User Menu or Auth Buttons */}
        <HStack spacing={4}>
          {isAuthenticated && user ? (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant='ghost' size='sm'>
                <HStack spacing={2}>
                  <Avatar size='sm' name={user.profile.displayName} src={user.profile.photoURL} />
                  {!isMobile && <Text>{user.profile.displayName}</Text>}
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => router.push('/dashboard')}>Dashboard</MenuItem>
                <MenuItem onClick={() => router.push('/profile')}>Profile</MenuItem>
                <MenuItem onClick={() => router.push('/settings')}>Settings</MenuItem>
                {user.hasRole('admin') && (
                  <>
                    <MenuDivider />
                    <MenuItem onClick={() => router.push('/admin')}>Admin Panel</MenuItem>
                  </>
                )}
                <MenuDivider />
                <MenuItem onClick={handleLogout} color='red.500'>
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack spacing={2}>
              <Button as={Link} href='/login' variant='ghost' size='sm'>
                Sign In
              </Button>
              <Button as={Link} href='/register' colorScheme='blue' size='sm'>
                Sign Up
              </Button>
            </HStack>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              aria-label='Open menu'
              icon={<HamburgerIcon />}
              variant='ghost'
              onClick={onOpen}
            />
          )}
        </HStack>
      </Flex>

      {/* Breadcrumbs */}
      {showBreadcrumbs && pathname !== '/' && (
        <Box bg='gray.50' borderBottom='1px' borderColor='gray.100'>
          <Box maxW='container.xl' mx='auto' px={4}>
            <Breadcrumbs />
          </Box>
        </Box>
      )}

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Navigation</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4} align='stretch'>
              {navigationItems.map(item => (
                <Button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  variant={RouteHelpers.matchesRoute(pathname, item.path) ? 'solid' : 'ghost'}
                  colorScheme={RouteHelpers.matchesRoute(pathname, item.path) ? 'blue' : 'gray'}
                  justifyContent='flex-start'
                >
                  {item.label}
                </Button>
              ))}

              {isAuthenticated && (
                <>
                  <MenuDivider />
                  <Button
                    onClick={() => handleNavigation('/profile')}
                    variant='ghost'
                    justifyContent='flex-start'
                  >
                    Profile
                  </Button>
                  <Button
                    onClick={() => handleNavigation('/settings')}
                    variant='ghost'
                    justifyContent='flex-start'
                  >
                    Settings
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant='ghost'
                    justifyContent='flex-start'
                    color='red.500'
                  >
                    Sign Out
                  </Button>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
