/**
 * Dashboard Page
 * Protected user dashboard
 */

'use client';

import React from 'react';
import { AuthGuard } from '@/infrastructure/routing/RouteGuard';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { 
  Box, 
  Container, 
  Heading, 
  VStack, 
  HStack, 
  Text, 
  Button, 
  Card, 
  CardBody,
  Avatar,
  Flex,
  Spacer
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Header */}
        <Flex align="center">
          <HStack spacing={4}>
            <Avatar 
              size="lg" 
              name={user?.profile.displayName} 
              src={user?.profile.photoURL}
            />
            <VStack align="start" spacing={1}>
              <Heading size="lg">Welcome back, {user?.profile.displayName}</Heading>
              <Text color="gray.600">{user?.email}</Text>
            </VStack>
          </HStack>
          <Spacer />
          <Button colorScheme="red" variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </Flex>

        {/* Dashboard Stats */}
        <VStack spacing={6} align="stretch">
          <Heading size="md">Your Dashboard</Heading>
          
          <HStack spacing={6} align="stretch">
            <Card flex={1}>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">Account Status</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    {user?.isActive ? 'Active' : 'Inactive'}
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card flex={1}>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">Email Verified</Text>
                  <Text fontSize="2xl" fontWeight="bold" color={user?.emailVerified ? 'green.500' : 'orange.500'}>
                    {user?.emailVerified ? 'Yes' : 'No'}
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card flex={1}>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">User Role</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                    {user?.profile.roles.join(', ')}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </HStack>

          {/* User Actions */}
          <Card>
            <CardBody>
              <VStack align="start" spacing={4}>
                <Heading size="sm">Quick Actions</Heading>
                <HStack spacing={4}>
                  <Button colorScheme="blue" size="sm">
                    Update Profile
                  </Button>
                  <Button colorScheme="green" size="sm">
                    View Events
                  </Button>
                  <Button colorScheme="purple" size="sm">
                    Manage Preferences
                  </Button>
                  {user?.hasRole('admin') && (
                    <Button 
                      colorScheme="orange" 
                      size="sm"
                      onClick={() => router.push('/admin')}
                    >
                      Admin Panel
                    </Button>
                  )}
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardBody>
              <VStack align="start" spacing={4}>
                <Heading size="sm">Recent Activity</Heading>
                <Text color="gray.600">
                  Last login: {user?.lastLoginAt.toLocaleString()}
                </Text>
                <Text color="gray.600">
                  Account created: {user?.createdAt.toLocaleString()}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </VStack>
    </Container>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}