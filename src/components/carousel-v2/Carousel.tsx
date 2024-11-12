"use client";

import React from "react";

const images = [
  "https://i.postimg.cc/2SFKfTPn/Runa-4.jpg",
  "https://i.postimg.cc/7PT33YMf/AGUS4.jpg",
  "https://i.postimg.cc/NFTRBpf1/DSC-2471.jpg",
  "https://i.postimg.cc/4NkzBkBw/UY.jpg",
];

export default function CarrousselV2() {
  return (
    <>
      <div
        id="default-carousel"
        className="relative w-full"
        data-carousel="slide"
      >
        {/* <!-- Carousel wrapper --> */}
        <div className="relative h-56 overflow-hidden rounded-lg md:h-96">
          {images.map((image, index) => (
            <React.Fragment key={index}>
              <div
                className="hidden duration-700 ease-in-out"
                data-carousel-item
              >
                <img
                  src={image}
                  className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                />
              </div>
            </React.Fragment>
          ))}
        </div>
        {/* <!-- Slider indicators --> */}
        <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
          <button
            type="button"
            className="w-3 h-3"
            aria-current="true"
            aria-label="Slide 1"
            data-carousel-slide-to="0"
          ></button>
          <button
            type="button"
            className="w-3 h-3"
            aria-current="false"
            aria-label="Slide 2"
            data-carousel-slide-to="1"
          ></button>
          <button
            type="button"
            className="w-3 h-3"
            aria-current="false"
            aria-label="Slide 3"
            data-carousel-slide-to="2"
          ></button>
          <button
            type="button"
            className="w-3 h-3"
            aria-current="false"
            aria-label="Slide 4"
            data-carousel-slide-to="3"
          ></button>
          <button
            type="button"
            className="w-3 h-3"
            aria-current="false"
            aria-label="Slide 5"
            data-carousel-slide-to="4"
          ></button>
        </div>
        {/* <!-- Slider controls --> */}
        <button
          type="button"
          className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-prev
        >
          <span className="inline-flex items-center justify-center w-10 h-10 bg-black/30 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              // xml:space="preserve"
              // style={{enableBackground :new 0 0 64 64"}}
              viewBox="0 0 64 64"
              id="arrow"
            >
              <path
                d="m-210.9-289-2-2 11.8-11.7-11.8-11.7 2-2 13.8 13.7-13.8 13.7"
                style={{ fill: "#fff" }}
                transform="translate(237 335)"
              ></path>
            </svg>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-next
        >
          <span className="inline-flex items-center justify-center w-10 h-10 bg-white/30 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              // xml:space="preserve"
              // style={{enableBackground :new 0 0 64 64"}}
              viewBox="0 0 64 64"
              id="arrow"
            >
              <path
                d="m-210.9-289-2-2 11.8-11.7-11.8-11.7 2-2 13.8 13.7-13.8 13.7"
                style={{ fill: "#fff" }}
                transform="translate(237 335)"
              ></path>
            </svg>
          </span>
        </button>
      </div>
    </>
  );
}
