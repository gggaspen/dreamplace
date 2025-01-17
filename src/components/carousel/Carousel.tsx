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
import { ICover } from "@/interfaces/event.interface";

export default function Carroussel({ fotos }: { fotos: ICover[] }) {
  console.log(fotos);

  const [isDesktop, setIsDesktop] = useState(false);
  const [images, setImages] = useState<ICover[]>([]);

  useEffect(() => {
    setImages(fotos);

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
                    src={image.formats?.large?.url}
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
