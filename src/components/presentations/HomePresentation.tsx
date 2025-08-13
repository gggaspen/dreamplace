'use client';

/**
 * Home Presentation Component
 * 
 * Pure presentational component that handles only rendering.
 * Receives all data through props and has no business logic.
 */

import React, { Suspense } from 'react';
import Hero from '@/app/pages/hero/Hero';
import { HomeData } from '@/components/containers/HomeContainer';
import { 
  LazyCarousel, 
  LazyContact, 
  LazyFooter, 
  LazyPressCarousel, 
  LazyResident 
} from '@/components/lazy';
import LoadingScreen from '@/components/loading-screen/LoadingScreen';

interface HomePresentationProps {
  data: HomeData;
}

export const HomePresentation: React.FC<HomePresentationProps> = React.memo(({ data }) => {
  const { heroSections, activeEvent, artists, contactInfo, carousel, spotifySection } = data;

  return (
    <main className='pulse-motion'>
      <Hero config={heroSections} activeEvent={activeEvent} />

      <Suspense fallback={<LoadingScreen />}>
        <div style={{ zIndex: 888 }}>
          <LazyCarousel fotos={carousel?.fotos || []} banner_text={carousel?.banner_text || ''} />
        </div>

        <div style={{ zIndex: 999 }}>
          <LazyResident config={spotifySection} />
        </div>

        <LazyContact config={contactInfo} />

        <LazyPressCarousel artists={artists} />

        <LazyFooter />
      </Suspense>
    </main>
  );
});