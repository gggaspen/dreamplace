"use client";

import Lenis from "lenis";
import React, {
  // MutableRefObject,
  useEffect,
  // useRef,
} from "react";
// import { motion, useTransform } from "framer-motion";
// import { useScroll } from "framer-motion";
import Image from "next/image";
import { Flex } from "@chakra-ui/react";

interface BackdropParallaxProps {
  rows?: { direction: "left" | "right" }[];
  srcUrl: string;
  objectPosition?: string;
  forPress?: boolean;
}

const BackdropParallax: React.FC<BackdropParallaxProps> = ({
  srcUrl,
  // objectPosition,
  forPress,
}) => {
  // const container: MutableRefObject<any> = useRef(null);

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  // const { scrollYProgress } = useScroll({
  //   target: container,
  //   offset: ["start end", "end start"],
  //   layoutEffect: false,
  // });

  // const translateY = useTransform(scrollYProgress, [0, 1], [500 * 1, -500 * 1]);

  return (
    <Flex
      w={{ base: "800px", lg: "100%" }}
      justifyContent={"center"}
      pos={forPress ? "absolute" : "relative"}
      h={forPress ? "inherit" : "auto"}
    >
      <div
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          width: "100dvw",
          height: forPress ? "inherit" : "auto",
          zIndex: 0,
        }}
      >
        <Image
          src={srcUrl}
          width={3000}
          height={0}
          alt="Banner Prensa"
          style={{
            objectFit: "cover",
            position: "fixed",
            // position: forPress ? "relative" : "fixed",
            width: "100%",
            height: "100%",
          }}
        ></Image>
      </div>
    </Flex>
  );
};

export default BackdropParallax;
