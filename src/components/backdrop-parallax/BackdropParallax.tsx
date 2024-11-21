"use client";

import Lenis from "lenis";
import React, { MutableRefObject, useEffect, useRef } from "react";
import { motion, useTransform } from "framer-motion";
import { useScroll } from "framer-motion";
import Image from "next/image";
import { Flex } from "@chakra-ui/react";

interface BackdropParallaxProps {
  rows?: { direction: "left" | "right" }[];
}

const BackdropParallax: React.FC<BackdropParallaxProps> = () => {
  const container: MutableRefObject<any> = useRef(null);

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [500 * 1, -500 * 1]);

  return (
    <Flex
      w={{ base: "1800px", lg: "100%" }}
      h={"100%"}
      justifyContent={"center"}
      position={"absolute"}
      bottom={{ base: -300, lg: -300 }}
    >
      <motion.div
        style={{
          y: translateY,
          bottom: -100,
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Image
          src="https://i.postimg.cc/fWtDqKQB/Banner-Prensa.png"
          width={3000}
          height={0}
          alt="Banner Prensa"
        ></Image>
      </motion.div>
    </Flex>
  );
};

export default BackdropParallax;
