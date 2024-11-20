"use client";

import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Autoplay,
  // EffectCube
  Pagination,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "./Carousel.css";
import { Flex } from "@chakra-ui/react";

const images = [
  "https://i.postimg.cc/j5vtVgdF/Banner-Carrusel-1.png",
  "https://i.postimg.cc/KYPmfvXF/Banner-Carrusel-2.png",
  "https://i.postimg.cc/QCtsjQFx/Banner-Carrusel-3.png",
  "https://i.postimg.cc/TwTf4MGb/Banner-Carrusel-4.png",

  // "https://i.postimg.cc/7YDS4c7n/DSC-2471.jpg",
  // "https://i.postimg.cc/15Hw3Hrh/DSC-2571.jpg",
  // "https://i.postimg.cc/2SSvbZ0q/DSC-2574.jpg",
  // "https://i.postimg.cc/GpZs5SdY/DSC-2932.jpg",
  // "https://i.postimg.cc/2jdB0wJb/DSC-8416.jpg",
  // "https://i.postimg.cc/ZKVvSqJJ/DSC-8417.jpg",
  "https://i.postimg.cc/XqgGXjFc/IMG-3406.jpg",
  "https://i.postimg.cc/SR4Yy2Xx/MG-4644-1.jpg",
  "https://i.postimg.cc/QxXKw7G6/MG-4729.jpg",
  "https://i.postimg.cc/R03HGz54/MG-4797-1.jpg",
  "https://i.postimg.cc/9Qg9GQkL/MG-4813.jpg",
];

export default function Carroussel() {
  return (
    <Flex>
      <div className="w-full relative">
        <Swiper
          className="progress-slide-carousel"
          modules={[Autoplay, Pagination]}
          pagination={{
            clickable: true,
            type: "progressbar",
          }}
          loop={true}
          autoplay={{
            delay: 1200,
            disableOnInteraction: false,
          }}
          speed={500}
        >
          {images.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="flex justify-center">
                {/* <div className="bg-indigo-50 rounded-2xl h-96 flex justify-center items-center"> */}
                <Image
                  width={4000}
                  height={300}
                  alt={`Image ${index + 1}`}
                  src={image}
                  className=""
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Flex>
  );
}
