"use client";

import Lenis from "lenis";
import React, {
  // MutableRefObject,
  useEffect,
  useState,
  // useRef,
} from "react";
// import { motion, useTransform } from "framer-motion";
// import { useScroll } from "framer-motion";
import Image from "next/image";
import { Box, Flex } from "@chakra-ui/react";

interface BackdropParallaxProps {
  rows?: { direction: "left" | "right" }[];
  objectPosition?: string;
  height?: string;
  srcUrl?: string;
}

const BackdropParallax: React.FC<BackdropParallaxProps> = ({
  height,
  srcUrl,
}) => {
  // const container: MutableRefObject<any> = useRef(null);
  // const srcDefault = "noel";
  const srcDefault = "main";

  const [src, setSrc] = useState(
    srcUrl ? srcUrl : `/img/banners/${srcDefault}.jpg?cache=${Date.now()}`
  );

  useEffect(() => {
    const updateDesktopSize = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      setSrc(
        srcUrl
          ? srcUrl
          : `${
              isDesktop
                ? "https://i.postimg.cc/rFD9yc6r/main.jpg"
                : "https://i.postimg.cc/8kKHVcYG/main-mobile.jpg"
            }`
      );
      // setSrc(
      //   srcUrl
      //     ? srcUrl
      //     : `/img/banners/noel${
      //         isDesktop ? "" : "-mobile"
      //       }.png?cache=${Date.now()}`
      // );
    };
    updateDesktopSize();
    window.addEventListener("resize", updateDesktopSize);
    return () => window.removeEventListener("resize", updateDesktopSize);
  }, []);

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
      w={{ base: "100%", lg: "100%" }}
      h={height}
      justifyContent={"center"}
      position={"absolute"}
      // bottom={{ base: -300, lg: -300 }}
    >
      <Box
        position={"absolute"}
        display={{ base: srcUrl ? "flex" : "block", lg: "flex" }}
        justifyContent={"center"}
        width={"100%"}
        height={{ base: "100%", lg: "100%" }}
      >
        <Box
          position={"absolute"}
          width={"100%"}
          height={"100%"}
          backgroundGradient={"linear(to-t, rgba(0, 0, 0, 1), transparent"}
        ></Box>
        <Image
          src={src}
          width={3000}
          height={0}
          alt="Banner Prensa"
          style={{
            objectFit: "cover",
            height: "100%",
            // objectPosition: objectPosition ?? "center",
            // objectPosition: "center",
          }}
        ></Image>
      </Box>
    </Flex>
  );
};

export default BackdropParallax;
