"use client";

import Carousel from "react-spring-3d-carousel";
import { useState, useEffect } from "react";
import { config } from "react-spring";
import { Flex } from "@chakra-ui/react";

export default function Carroussel(props: any) {
  const table = props.cards.map((element: any, index: number) => {
    return { ...element, onClick: () => setGoToSlide(index) };
  });

  const [offsetRadius, setOffsetRadius] = useState(2);
  const [showArrows, setShowArrows] = useState(false);
  const [goToSlide, setGoToSlide] = useState<number | undefined>(undefined);
  const [cards] = useState(table);

  useEffect(() => {
    setOffsetRadius(props.offset);
    setShowArrows(props.showArrows);
  }, [props.offset, props.showArrows]);

  return (
    <Flex
      // bgColor={"#2d2d2d"}
      // style={{
        // backgroundImage: `url("${new HeroPattern("ff6600", 1).getPattern()}")`,
      // }}
      w={props.width}
      h={props.height}
      m={props.margin}
    >
      <Carousel
        slides={cards}
        goToSlide={goToSlide ?? 0}
        offsetRadius={offsetRadius}
        showNavigation={showArrows}
        animationConfig={config.gentle}
      />
    </Flex>
  );
}
