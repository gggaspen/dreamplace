'use client';

// #region imports

import React from 'react';
import { Resident } from '@/app/pages/resident/Resident';
import Carousel from '@/app/pages/carousel/Carousel';
import Contact from '@/app/pages/contact/Contact';
import Footer from '@/app/pages/footer/Footer';
import LoadingScreen from '@/components/loading-screen/LoadingScreen';
import Hero from './pages/hero/Hero';
import './css/motions.css';
import PressCarousel from './pages/press/carousel/PressCarousel';
import { useAppData, useLoadingState, useGlobalError } from '@/infrastructure/state/hooks';

// #endregion imports

export default function Home() {
  // Use the new state management hooks
  const { data, isLoading, error, isError } = useAppData();
  const isAppLoading = useLoadingState();
  const globalError = useGlobalError();

  // Show loading screen while data is being fetched
  if (isLoading || isAppLoading || !data) {
    return <LoadingScreen />;
  }

  // Show error state if there's an error
  if (isError || globalError) {
    return (
      <div style={{ padding: '2rem', maxWidth: '28rem', margin: '2.5rem auto' }}>
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fed7d7', 
          color: '#c53030',
          borderRadius: '0.375rem',
          border: '1px solid #feb2b2'
        }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Error loading application!</h3>
          <p>
            {globalError || error?.message || 'An unexpected error occurred. Please try again later.'}
          </p>
        </div>
      </div>
    );
  }

  // Extract data from the new structure
  const { heroSections, activeEvent, events, artists, contactInfo } = data;

  return (
    <main className='pulse-motion'>
      <Hero config={heroSections} activeEvent={activeEvent} />

      <div style={{ zIndex: 888 }}>
        <Carousel fotos={data.carousel?.fotos} banner_text={data.carousel?.banner_text} />
      </div>

      <div style={{ zIndex: 999 }}>
        <Resident config={data.spotifySection} />
      </div>

      <Contact config={contactInfo} />

      <PressCarousel artists={artists} />

      <Footer />
    </main>
  );
}
