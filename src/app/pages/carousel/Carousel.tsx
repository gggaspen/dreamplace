"use client";

/**
 * Carousel Component (Legacy Wrapper)
 * 
 * This component now serves as a wrapper that delegates to CarouselContainer.
 * Maintained for backward compatibility while transitioning to container/presentational pattern.
 */

import React from "react";
import { ICover } from "@/interfaces/event.interface";
import { CarouselContainer } from "@/components/containers/CarouselContainer";

interface ICarouselProps {
  fotos: ICover[];
  banner_text: string;
}

export default function Carousel({ fotos, banner_text }: ICarouselProps) {
  return <CarouselContainer fotos={fotos} banner_text={banner_text} />;
}
