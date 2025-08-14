'use client';

/**
 * Home Presentation Component
 *
 * Pure presentational component that handles only rendering.
 * Receives all data through props and has no business logic.
 */

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { HomeData } from '@/components/containers/HomeContainer';
import {
  LazyCarousel,
  LazyContact,
  LazyFooter,
  LazyPressCarousel,
  LazyResident,
} from '@/components/lazy';
import LoadingScreen from '@/components/loading-screen/LoadingScreen';

// Lazy load Hero component for better code splitting
const LazyHero = dynamic(() => import('@/app/pages/hero/Hero'), {
  ssr: true,
  loading: () => <LoadingScreen />,
});

interface HomePresentationProps {
  data: HomeData;
}

const HomePresentationComponent: React.FC<HomePresentationProps> = React.memo(({ data }) => {
  const { heroSections, activeEvent, artists, contactInfo, carousel, spotifySection } = data;

  return (
    <main className='pulse-motion'>
      <Suspense fallback={<LoadingScreen />}>
        <LazyHero config={heroSections} activeEvent={activeEvent} />
      </Suspense>

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

HomePresentationComponent.displayName = 'HomePresentation';

export const HomePresentation = HomePresentationComponent;
