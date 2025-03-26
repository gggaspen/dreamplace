"use client";

import Lenis from "lenis";
import React, { MutableRefObject, useEffect, useRef } from "react";
import "./BottomBanner.css";
import Slide from "../slide/Slide";
import { useScroll } from "framer-motion";
import { Box, Flex } from "@chakra-ui/react";
import Link from "next/link";

interface BottomBannerProps {
  rows?: { direction: "left" | "right" }[];
  text: string;
  url?: string;
}

const BottomBanner: React.FC<BottomBannerProps> = ({
  rows,
  text,
  url,
}: BottomBannerProps) => {
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

  return (
    <Box>
      <Link
        href={url ? url : "#"}
        target={url ? "_blank" : "_self"}
        onClick={url === null ? (e) => e.preventDefault() : undefined}
      >
        <Flex
          ref={container}
          flexDirection={"column"}
          gap={"1em"}
          py={".5em"}
          overflow={"hidden"}
          className="bg-gradient"
          cursor={"pointer"}
          justifyContent={"center"}
          h={"100%"}
        >
          {rows.map((row, index) => (
            <Slide
              key={index}
              left={"-100%"}
              direction={row.direction}
              progress={scrollYProgress}
              arrow={row.direction === "left" ? "right" : "left"}
              text={text}
            />
          ))}
        </Flex>
      </Link>
    </Box>
  );
};

export default BottomBanner;
