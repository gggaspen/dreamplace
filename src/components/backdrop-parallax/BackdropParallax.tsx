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
import { ICover } from "@/interfaces/event.interface";
import "@/app/css/motions.css";

interface BackdropParallaxProps {
  rows?: { direction: "left" | "right" }[];
  objectPosition?: string;
  height?: string;
  srcUrlDesktop?: ICover;
  srcUrlMobile?: ICover;
}

const BackdropParallax: React.FC<BackdropParallaxProps> = ({
  height,
  srcUrlDesktop,
  srcUrlMobile,
}) => {
  // const container: MutableRefObject<any> = useRef(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [src, setSrc] = useState<string | null>(
    isDesktop
      ? srcUrlDesktop?.formats?.medium?.url ||
          "https://i.postimg.cc/fWtDqKQB/Banner-Prensa.png"
      : srcUrlMobile?.formats?.medium?.url ||
          "https://i.postimg.cc/fWtDqKQB/Banner-Prensa.png"
  );

  useEffect(() => {
    const updateDesktopSize = () => {
      const isDesktopView = window.matchMedia("(min-width: 768px)").matches;
      setIsDesktop(isDesktopView);

      const src = isDesktopView
        ? srcUrlDesktop?.formats?.medium?.url
        : srcUrlMobile?.formats?.medium?.url;
      setSrc(src);
    };
    updateDesktopSize();
    window.addEventListener("resize", updateDesktopSize);
    return () => window.removeEventListener("resize", updateDesktopSize);
  }, [srcUrlDesktop, srcUrlMobile]);

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
    >
      <Box
        position={"absolute"}
        display={{
          base: src ? "flex" : "block",
          lg: "flex",
        }}
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
          }}
          className="pulse-motion-2"
        ></Image>
      </Box>
    </Flex>
  );
};

export default BackdropParallax;
