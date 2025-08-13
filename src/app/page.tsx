'use client';

/**
 * Home Page
 * 
 * This page now follows the container/presentational pattern.
 * All business logic has been moved to HomeContainer, 
 * and this page serves as the entry point.
 */

import React from 'react';
import { HomeContainer } from '@/components/containers/HomeContainer';
import '@/app/css/motions.css';

export default function Home() {
  return <HomeContainer />;
}
