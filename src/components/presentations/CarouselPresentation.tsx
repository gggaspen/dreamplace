'use client';

/**
 * Carousel Presentation Component
 * 
 * Pure presentational component that renders the image carousel.
 * Receives all necessary data and configuration through props.
 */

import React from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import '@/app/pages/carousel/Carousel.css';
import { Box, Flex } from '@chakra-ui/react';
import { ICover } from '@/interfaces/event.interface';
import MiniBanner from '@/components/mini-banner/MiniBanner';

interface CarouselPresentationProps {
  images: ICover[];
  banner_text: string;
  windowHeight: string;
  autoplayConfig: {
    delay: number;
    disableOnInteraction: boolean;
    pauseOnMouseEnter: boolean;
  };
  hasMultipleImages: boolean;
}

export const CarouselPresentation: React.FC<CarouselPresentationProps> = React.memo(({
  images,
  banner_text,
  windowHeight,
  autoplayConfig,
  hasMultipleImages
}) => {
  return (
    <>
      <MiniBanner text={banner_text} bgColor="#eee" />

      <Flex
        h={{
          base: "auto",
          lg: windowHeight,
        }}
      >
        <Box
          w="100%"
          position="relative"
          bgColor="#000"
        >
          <Swiper
            className="progress-slide-carousel"
            modules={[Autoplay, Pagination]}
            loop={hasMultipleImages}
            autoplay={autoplayConfig}
            speed={100}
          >
            {images.map((image, index) => (
              <SwiperSlide key={image.id}>
                <Flex
                  justifyContent="center"
                  h={{ base: "100%", lg: "100%" }}
                >
                  <Image
                    width={4000}
                    height={0}
                    alt={`Image ${index + 1}`}
                    src={image.formats?.large?.url}
                    style={{ objectFit: "cover" }}
                  />
                </Flex>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Flex>
    </>
  );
});