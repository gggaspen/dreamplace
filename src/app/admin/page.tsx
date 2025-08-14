/**
 * Admin Page
 * Protected admin-only dashboard
 */

'use client';

import React from 'react';
import { AdminGuard } from '@/infrastructure/routing/RouteGuard';
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
  Grid,
  GridItem,
  Badge,
  Alert,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

function AdminContent() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <Container maxW='container.xl' py={8}>
      <VStack spacing={8} align='stretch'>
        {/* Header */}
        <HStack justify='space-between'>
          <VStack align='start' spacing={1}>
            <Heading size='xl'>Admin Dashboard</Heading>
            <Text color='gray.600'>Manage DreamPlace platform</Text>
          </VStack>
          <Button colorScheme='blue' onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </HStack>

        {/* Admin Info */}
        <Alert status='info'>
          You are logged in as an administrator. Handle sensitive operations with care.
        </Alert>

        {/* Admin Stats */}
        <Grid templateColumns='repeat(auto-fit, minmax(250px, 1fr))' gap={6}>
          <GridItem>
            <Card>
              <CardBody>
                <VStack align='start' spacing={2}>
                  <HStack>
                    <Text fontSize='sm' color='gray.600'>
                      User Management
                    </Text>
                    <Badge colorScheme='green'>Active</Badge>
                  </HStack>
                  <Text fontSize='2xl' fontWeight='bold'>
                    1,247
                  </Text>
                  <Text fontSize='sm' color='gray.500'>
                    Total Users
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardBody>
                <VStack align='start' spacing={2}>
                  <HStack>
                    <Text fontSize='sm' color='gray.600'>
                      Events
                    </Text>
                    <Badge colorScheme='blue'>Active</Badge>
                  </HStack>
                  <Text fontSize='2xl' fontWeight='bold'>
                    23
                  </Text>
                  <Text fontSize='sm' color='gray.500'>
                    Live Events
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardBody>
                <VStack align='start' spacing={2}>
                  <HStack>
                    <Text fontSize='sm' color='gray.600'>
                      Artists
                    </Text>
                    <Badge colorScheme='purple'>Active</Badge>
                  </HStack>
                  <Text fontSize='2xl' fontWeight='bold'>
                    156
                  </Text>
                  <Text fontSize='sm' color='gray.500'>
                    Registered Artists
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card>
              <CardBody>
                <VStack align='start' spacing={2}>
                  <HStack>
                    <Text fontSize='sm' color='gray.600'>
                      System Health
                    </Text>
                    <Badge colorScheme='green'>Healthy</Badge>
                  </HStack>
                  <Text fontSize='2xl' fontWeight='bold'>
                    99.9%
                  </Text>
                  <Text fontSize='sm' color='gray.500'>
                    Uptime
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Admin Actions */}
        <Card>
          <CardBody>
            <VStack align='start' spacing={6}>
              <Heading size='md'>Administrative Actions</Heading>

              <Grid templateColumns='repeat(auto-fit, minmax(200px, 1fr))' gap={4}>
                <Button colorScheme='blue' size='lg' h='auto' p={4}>
                  <VStack spacing={2}>
                    <Text fontWeight='bold'>User Management</Text>
                    <Text fontSize='sm' opacity={0.8}>
                      Manage user accounts and permissions
                    </Text>
                  </VStack>
                </Button>

                <Button colorScheme='green' size='lg' h='auto' p={4}>
                  <VStack spacing={2}>
                    <Text fontWeight='bold'>Event Management</Text>
                    <Text fontSize='sm' opacity={0.8}>
                      Create and manage events
                    </Text>
                  </VStack>
                </Button>

                <Button colorScheme='purple' size='lg' h='auto' p={4}>
                  <VStack spacing={2}>
                    <Text fontWeight='bold'>Artist Management</Text>
                    <Text fontSize='sm' opacity={0.8}>
                      Manage artist profiles
                    </Text>
                  </VStack>
                </Button>

                <Button colorScheme='orange' size='lg' h='auto' p={4}>
                  <VStack spacing={2}>
                    <Text fontWeight='bold'>Content Management</Text>
                    <Text fontSize='sm' opacity={0.8}>
                      Manage site content
                    </Text>
                  </VStack>
                </Button>

                <Button colorScheme='red' variant='outline' size='lg' h='auto' p={4}>
                  <VStack spacing={2}>
                    <Text fontWeight='bold'>System Settings</Text>
                    <Text fontSize='sm' opacity={0.8}>
                      Configure system parameters
                    </Text>
                  </VStack>
                </Button>

                <Button colorScheme='gray' size='lg' h='auto' p={4}>
                  <VStack spacing={2}>
                    <Text fontWeight='bold'>Analytics</Text>
                    <Text fontSize='sm' opacity={0.8}>
                      View platform analytics
                    </Text>
                  </VStack>
                </Button>
              </Grid>
            </VStack>
          </CardBody>
        </Card>

        {/* Current Admin */}
        <Card>
          <CardBody>
            <VStack align='start' spacing={4}>
              <Heading size='sm'>Current Session</Heading>
              <VStack align='start' spacing={2}>
                <Text>
                  <strong>Admin:</strong> {user?.profile.displayName}
                </Text>
                <Text>
                  <strong>Email:</strong> {user?.email}
                </Text>
                <Text>
                  <strong>Roles:</strong> {user?.profile.roles.join(', ')}
                </Text>
                <Text>
                  <strong>Session Started:</strong> {new Date().toLocaleString()}
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Container>
  );
}

export default function AdminPage() {
  return (
    <AdminGuard>
      <AdminContent />
    </AdminGuard>
  );
}
