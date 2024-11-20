"use client";

import Lenis from "lenis";
import React, { MutableRefObject, useEffect, useRef } from "react";
import { motion, useTransform } from "framer-motion";
// import "./BackdropParallax.css";
import { useScroll } from "framer-motion";
import { Text } from "@chakra-ui/react";
import Image from "next/image";

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

  const translateY = useTransform(
    scrollYProgress,
    [0, 1],
    [200 * 1, -200 * 1]
  );

  return (
    <motion.div
      style={{
        y: translateY,
        bottom: -100,
        position: "absolute",
        display: "flex",
        justifyContent: "center",
        width: "1800px",
        // height: "100%",
        border: "1px solid red",
      }}
    >
      <Image
        src="https://i.postimg.cc/fWtDqKQB/Banner-Prensa.png"
        width={3500}
        height={100}
        alt="Banner Prensa"
      ></Image>
    </motion.div>
  );
};

export default BackdropParallax;
