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
}

const BackdropParallax: React.FC<BackdropParallaxProps> = ({
  srcUrl,
  objectPosition,
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
      h={"100%"}
      // h={"70dvh"}
      justifyContent={"center"}
      position={"absolute"}
      // bottom={{ base: -300, lg: -300 }}
    >
      <div
        // <motion.div
        style={{
          // y: translateY,
          // bottom: -100,
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Image
          src={srcUrl}
          width={3000}
          height={0}
          alt="Banner Prensa"
          style={{
            objectFit: "cover",
            objectPosition: objectPosition ?? "center",
          }}
        ></Image>
      </div>
      {/* </motion.div> */}
    </Flex>
  );
};

export default BackdropParallax;
