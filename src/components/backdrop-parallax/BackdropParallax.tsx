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
import { Flex } from "@chakra-ui/react";

interface BackdropParallaxProps {
  rows?: { direction: "left" | "right" }[];
  objectPosition?: string;
  height?: string;
}

const BackdropParallax: React.FC<BackdropParallaxProps> = ({
  objectPosition,
  height,
}) => {
  // const container: MutableRefObject<any> = useRef(null);
  const srcDefault = "noel";

  const [src, setSrc] = useState(
    `/img/banners/${srcDefault}.png?cache=${Date.now()}`
  );

  useEffect(() => {
    const updateDesktopSize = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      setSrc(
        `/img/banners/noel${isDesktop ? "" : "-mobile"}.png?cache=${Date.now()}`
      );
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
      w={{ base: "800px", lg: "100%" }}
      h={height}
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
          src={src}
          width={3000}
          height={0}
          alt="Banner Prensa"
          style={{
            objectFit: "cover",
            // objectPosition: objectPosition ?? "center",
            // objectPosition: "center",
          }}
        ></Image>
      </div>
      {/* </motion.div> */}
    </Flex>
  );
};

export default BackdropParallax;
