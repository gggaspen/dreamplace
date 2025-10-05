"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCards, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "./PressCarousel.css";
import { Box, Flex } from "@chakra-ui/react";
import Press, { IArtist } from "../Press";

interface IPressCarouselProps {
  readonly artists: IArtist[];
}

export default function PressCarousel({ artists }: IPressCarouselProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [_artists, setArtists] = useState<IArtist[]>(artists);

  useEffect(() => {
    setArtists(artists);

    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handleResize = () => setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, [artists]);

  return (
    <Flex>
      <Box
        w={"100%"}
        h={{ base: "100dvh", lg: "100dvh" }}
        position={"relative"}
        bgColor={"#000"}
      >
        <Swiper
          // onUpdate={(swiper: any) => onSwiper(swiper)}
          className="progress-slide-carousel"
          modules={[Autoplay, Pagination, EffectCards]}
          pagination={{
            clickable: true,
            type: "progressbar",
            progressbarOpposite: false,
          }}
          loop={_artists.length > 1}
          autoplay={{
            delay: 2000,
            disableOnInteraction: !isDesktop,
            pauseOnMouseEnter: isDesktop,
          }}
          speed={600}
          effect={"cards"}
          cardsEffect={
            {
              // slideShadows: true,
              // rotate: true,
              // perSlideOffset: 0,
              // perGroupOffset: 0,
            }
          }
          // cubeEffect={{
          //   shadow: true,
          //   slideShadows: true,
          //   shadowOffset: 20,
          //   shadowScale: 0.94,
          // }}
          // parallax={true}
        >
          {_artists.map((artist: IArtist, index: number) => (
            <SwiperSlide key={index}>
              <Press artist={artist} />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Flex>
  );
}
