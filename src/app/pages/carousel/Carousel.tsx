"use client";

import Image from "next/image";
import React, { useEffect, useState, useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "./Carousel.css";
import { Box, Flex } from "@chakra-ui/react";
import { ICover } from "@/interfaces/event.interface";
import MiniBanner from "@/components/mini-banner/MiniBanner";

interface ICarouselProps {
  readonly fotos: ICover[];
  readonly banner_text: string;
}

export default function Carousel({ fotos, banner_text }: ICarouselProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [images, setImages] = useState<ICover[]>([]);
  const [activeImage, setActiveImage] = useState<ICover | null>(null);
  const [containerHeight, setContainerHeight] = useState<string>("auto");
  const [isVisible, setIsVisible] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    setImages(fotos);
    if (fotos.length > 0) {
      setActiveImage(fotos[0]);
    }

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handleResize = () => setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, [fotos]);

  const calculateImageHeight = (image: ICover) => {
    if (!image?.formats?.large) return "auto";

    const screenWidth = window.innerWidth;
    const imageWidth = image.formats.large.width || 1;
    const imageHeight = image.formats.large.height || 1;

    const aspectRatio = imageHeight / imageWidth;
    const calculatedHeight = screenWidth * aspectRatio;

    return `${calculatedHeight}px`;
  };

  const handleSlideChange = (swiper: any) => {
    const currentImage = images[swiper.realIndex];
    if (currentImage) {
      setActiveImage(currentImage);
      const newHeight = calculateImageHeight(currentImage);
      setContainerHeight(newHeight);
    }
  };

  useEffect(() => {
    if (activeImage) {
      const newHeight = calculateImageHeight(activeImage);
      setContainerHeight(newHeight);
    }
  }, [activeImage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const newVisibility = entry.isIntersecting;
        setIsVisible(newVisibility);

        if (swiperRef.current && swiperRef.current.autoplay) {
          if (newVisibility) {
            swiperRef.current.autoplay.start();
          } else {
            swiperRef.current.autoplay.stop();
          }
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px",
      }
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, []);

  return (
    <>
      <MiniBanner text={banner_text} bgColor="#eee" />

      <Flex
        ref={carouselRef}
        h={{
          base: containerHeight,
          lg: containerHeight,
        }}
      >
        <Box w={"100%"} position={"relative"} bgColor={"#000"}>
          <Swiper
            className="progress-slide-carousel"
            modules={[Autoplay, Pagination]}
            loop={images.length > 1}
            autoplay={{
              delay: 2000,
              disableOnInteraction: !isDesktop,
              pauseOnMouseEnter: isDesktop,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            speed={100}
            onSlideChange={handleSlideChange}
          >
            {images.map((image, index) => (
              <SwiperSlide key={image.id}>
                <Flex
                  justifyContent={"center"}
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
}
