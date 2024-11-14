"use client";

import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCube, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";
import "./Carousel.css";

const images = [
  "https://i.postimg.cc/j5vtVgdF/Banner-Carrusel-1.png",
  "https://i.postimg.cc/KYPmfvXF/Banner-Carrusel-2.png",
  "https://i.postimg.cc/QCtsjQFx/Banner-Carrusel-3.png",
  "https://i.postimg.cc/TwTf4MGb/Banner-Carrusel-4.png",
  // "https://i.postimg.cc/2SFKfTPn/Runa-4.jpg",
  // "https://i.postimg.cc/7PT33YMf/AGUS4.jpg",
  // "https://i.postimg.cc/NFTRBpf1/DSC-2471.jpg",
  // "https://i.postimg.cc/4NkzBkBw/UY.jpg",
];

export default function Carroussel() {
  return (
    <>
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
    </>
  );
}
