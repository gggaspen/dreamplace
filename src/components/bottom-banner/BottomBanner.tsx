"use client";

import Lenis from "lenis";
import React, { useEffect, useRef } from "react";
import "./BottomBanner.css";
import Slide from "../slide/Slide";
import { useScroll } from "framer-motion";
import { Box } from "@chakra-ui/react";

const BottomBanner: React.FC = () => {
  useEffect(() => {
    const lenis = new Lenis();
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  const container: any = useRef();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  return (
    <Box overflow={"hidden"} bgColor={"#fff"}>
      {/* <Box overflow={"hidden"} bgColor={"#fff"} h={"50dvh"}> */}
      <Slide left={"-10%"} direction={"left"} progress={scrollYProgress} />
      <Slide
        left={"-20%"}
        direction={"right"}
        progress={scrollYProgress}
        arrow={"left"}
      />
    </Box>
  );
};

export default BottomBanner;
