"use client";

import Lenis from "lenis";
import React, { MutableRefObject, useEffect, useRef } from "react";
import "./BottomBanner.css";
import Slide from "../slide/Slide";
import { useScroll } from "framer-motion";
import { Flex } from "@chakra-ui/react";

const BottomBanner: React.FC = () => {
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
    <Flex
      ref={container}
      flexDirection={"column"}
      gap={"1em"}
      py={"1em"}
      overflow={"hidden"}
      className="bg-gradient"
      cursor={"pointer"}
      justifyContent={"center"}
      h={"100%"}
    >
      {/* <Box overflow={"hidden"} bgColor={"#fff"} h={"50dvh"}> */}
      <Slide left={"-100%"} direction={"left"} progress={scrollYProgress} />
      <Slide
        left={"-100%"}
        direction={"right"}
        progress={scrollYProgress}
        arrow={"left"}
      />
    </Flex>
  );
};

export default BottomBanner;
