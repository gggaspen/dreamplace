"use client";

// import Lenis from "lenis";
import React, { CSSProperties, useEffect, useState } from "react";
import { motion, useTransform, useScroll } from "framer-motion";
import Image from "next/image";
import { Box } from "@chakra-ui/react";
import { ICover } from "@/interfaces/event.interface";
import "@/app/css/motions.css";

type InputRange = number[];

interface BackdropParallaxProps {
  rows?: { direction: "left" | "right" }[];
  objectPosition?: string;
  height?: CSSProperties["height"];
  srcUrlDesktop?: ICover;
  srcUrlMobile?: ICover;
  parent: "banner" | "press";
}

const AUX_IMG_BG: string = "https://i.postimg.cc/fWtDqKQB/Banner-Prensa.png";

const BackdropParallax: React.FC<BackdropParallaxProps> = ({
  height,
  srcUrlDesktop,
  srcUrlMobile,
  parent,
}) => {
  // const container: MutableRefObject<any> = useRef(null);
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [src, setSrc] = useState<string | null>(
    isDesktop
      ? srcUrlDesktop?.formats?.large?.url || AUX_IMG_BG
      : srcUrlMobile?.formats?.large?.url || AUX_IMG_BG
  );
  const [outputRange, setOutputRange] = useState<number[]>([0, 0]);
  const [inputRange, setInputRange] = useState<InputRange>([0, 0]);

  useEffect(() => {
    const updateDesktopSize = () => {
      const isDesktopView = window.matchMedia("(min-width: 768px)").matches;
      setIsDesktop(isDesktopView);

      const src = isDesktopView
        ? srcUrlDesktop?.formats?.large?.url
        : srcUrlMobile?.formats?.large?.url;
      setSrc(src);
    };
    updateDesktopSize();
    window.addEventListener("resize", updateDesktopSize);
    return () => window.removeEventListener("resize", updateDesktopSize);
  }, [srcUrlDesktop, srcUrlMobile]);

  // useEffect(() => {
  //   const lenis = new Lenis();
  //   function raf(time: number) {
  //     lenis.raf(time);
  //     requestAnimationFrame(raf);
  //   }
  //   requestAnimationFrame(raf);
  // }, []);

  useEffect(() => {
    setInputRange(parent === "banner" ? [0, 800] : [0, 800]);
    setOutputRange(parent === "banner" ? [0, 200] : [0, 0]);
  }, [parent]);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, inputRange, outputRange);
  // const { scrollYProgress } = useScroll({
  //   target: container,
  //   offset: ["start end", "end start"],
  //   layoutEffect: false,
  // });

  // const translateY = useTransform(scrollYProgress, [0, 1], [500 * 1, -500 * 1]);
  // const [ref, inView, entry] = useInView({
  //   /* Optional options */
  //   threshold: 0.5,
  //   triggerOnce: false,
  // });

  // console.log(entry);

  // const variants = {
  //   visible: { opacity: 1, scale: 1, y: 0 },
  //   hidden: {
  //     opacity: 0,
  //     scale: 0.65,
  //     y: 50,
  //   },
  // };

  return (
    <motion.div
      // style={{ y: y1, position: "fixed", top: "0", left: "0", width: "100%" }}
      style={{
        y: y1,
        position: "absolute",
        width: "100%",
        height,
        justifyContent: "center",
      }}
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
          className={parent === "banner" ? "pulse-motion-2" : "pulse-motion"}
        ></Image>
      </Box>
    </motion.div>
  );
};

export default BackdropParallax;
