"use client";

import Lenis from "lenis";
import React, { MutableRefObject, useEffect, useRef } from "react";
import "./BottomBanner.css";
import Slide from "../slide/Slide";
import { useScroll } from "framer-motion";
import { Flex } from "@chakra-ui/react";
import Link from "next/link";

const BottomBanner: React.FC = () => {
  const container: MutableRefObject<any> = useRef(null);
  const url =
    "https://www.passline.com/eventos/sab-3011-agustin-pietrocola-ailen-dc-naza-rv-facukid-ariel-stamile-meline-323995/lean-gorosito";

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
    <Link href={url} target="_blank">
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
    </Link>
  );
};

export default BottomBanner;
