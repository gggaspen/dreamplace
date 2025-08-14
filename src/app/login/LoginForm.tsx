/**
 * Login Form Component
 * Heavy login form content split from main login page for better code splitting
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import {
  Box,
  Container,
  Heading,
  VStack,
  Field,
  Input,
  Button,
  Alert,
  Text,
  Link,
} from '@chakra-ui/react';

export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = await login(formData);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Container maxW='md' centerContent py={10}>
      <Box w='full' p={8} borderWidth={1} borderRadius='lg' boxShadow='lg'>
        <VStack spacing={6}>
          <Heading size='lg' textAlign='center'>
            Sign In to DreamPlace
          </Heading>

          {error && (
            <Alert.Root status='error'>
              <Alert.Indicator />
              <Alert.Title>{error}</Alert.Title>
            </Alert.Root>
          )}

          <Box as='form' w='full' onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Field.Root required>
                <Field.Label>Email</Field.Label>
                <Input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  placeholder='Enter your email'
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Password</Field.Label>
                <Input
                  type='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  placeholder='Enter your password'
                />
              </Field.Root>

              <Button
                type='submit'
                colorScheme='blue'
                size='lg'
                w='full'
                isLoading={isLoading}
                loadingText='Signing in...'
              >
                Sign In
              </Button>
            </VStack>
          </Box>

          <VStack spacing={2}>
            <Text fontSize='sm' color='gray.600'>
              Don't have an account?{' '}
              <Link color='blue.500' href='/register'>
                Sign up here
              </Link>
            </Text>
            <Link color='blue.500' fontSize='sm' href='/forgot-password'>
              Forgot your password?
            </Link>
          </VStack>
        </VStack>
      </Box>
    </Container>
  );
}