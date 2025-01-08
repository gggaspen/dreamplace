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
}

const BottomBanner: React.FC<BottomBannerProps> = ({ rows }) => {
  const container: MutableRefObject<any> = useRef(null);
  const url =
    // "https://www.passline.com/eventos/sab-3011-agustin-pietrocola-ailen-dc-naza-rv-facukid-ariel-stamile-meline-323995/lean-gorosito";
    "https://www.todopass.com.ar/inicio/355-fiesta-de-noel-xv.html";

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

  const soon: boolean = true;

  return (
    <Box>
      <Link
        href={url}
        target="_blank"
        onClick={soon ? (e) => e.preventDefault() : undefined}
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
            />
          ))}
        </Flex>
      </Link>
    </Box>
  );
};

export default BottomBanner;
