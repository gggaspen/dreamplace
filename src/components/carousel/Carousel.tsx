"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "./Carousel.css";
import { Box, Flex } from "@chakra-ui/react";

const images = [
  /**
   * Muelle:
   */
  // "https://i.postimg.cc/j5vtVgdF/Banner-Carrusel-1.png",
  // "https://i.postimg.cc/KYPmfvXF/Banner-Carrusel-2.png",
  // "https://i.postimg.cc/TwTf4MGb/Banner-Carrusel-4.png",
  // "https://i.postimg.cc/SR4Yy2Xx/MG-4644-1.jpg",
  // "https://i.postimg.cc/R03HGz54/MG-4797-1.jpg",
  // "https://i.postimg.cc/9Qg9GQkL/MG-4813.jpg",
  /**
   * Noel:
   */
  // "/img/carousel/PIC (216).jpg",
  "/img/carousel/PIC (199).jpg",
  "/img/carousel/PIC (163).jpg",
  "/img/carousel/PIC (161).jpg",
  "/img/carousel/PIC (123).jpg",
  "/img/carousel/PIC (106).jpg",
  "/img/carousel/PIC (95).jpg",
  "/img/carousel/PIC (55).jpg",
  "/img/carousel/PIC (45).jpg",
  "/img/carousel/PIC (40).jpg",
  "/img/carousel/PIC (36).jpg",

  "/img/carousel/_MG_4644 (1).jpg",
  "/img/carousel/_MG_4797 (1).jpg",
  "/img/carousel/_MG_4807.jpg",
];

export default function Carroussel() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mediaQuery.matches);

    const handleResize = () => setIsDesktop(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <Flex>
      <Box
        w={"100%"}
        h={{ base: "40dvh", lg: "100dvh" }}
        position={"relative"}
        bgColor={"#000"}
      >
        <Swiper
          className="progress-slide-carousel"
          modules={[Autoplay, Pagination]}
          pagination={{
            clickable: true,
            type: "progressbar",
            progressbarOpposite: false,
          }}
          loop={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: !isDesktop,
            pauseOnMouseEnter: isDesktop,
          }}
          speed={100}
        >
          {images.map((image, index) => (
            <React.Fragment key={index}>
              <SwiperSlide>
                <Flex
                  justifyContent={"center"}
                  h={{ base: "40dvh", lg: "100dvh" }}
                >
                  <Image
                    width={4000}
                    height={0}
                    alt={`Image ${index + 1}`}
                    src={image}
                    style={{ objectFit: "cover" }}
                  />
                </Flex>
              </SwiperSlide>
            </React.Fragment>
          ))}
        </Swiper>
      </Box>
    </Flex>
  );
}
