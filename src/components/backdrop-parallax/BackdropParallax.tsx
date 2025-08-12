"use client";

// import Lenis from "lenis";
import React, { CSSProperties, useEffect, useState, useCallback } from "react";
import {
  motion,
  useTransform,
  useScroll,
  AnimatePresence,
} from "framer-motion";
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

interface ImageUrls {
  lowQuality: string;
  highQuality: string;
}

const AUX_IMG_BG: string = "https://i.postimg.cc/fWtDqKQB/Banner-Prensa.png";

const BackdropParallax: React.FC<BackdropParallaxProps> = ({
  height,
  srcUrlDesktop,
  srcUrlMobile,
  parent,
}) => {
  const [imageUrls, setImageUrls] = useState<ImageUrls>({
    lowQuality: AUX_IMG_BG,
    highQuality: AUX_IMG_BG,
  });
  const [isHighQualityLoaded, setIsHighQualityLoaded] =
    useState<boolean>(false);
  const [outputRange, setOutputRange] = useState<number[]>([0, 0]);
  const [inputRange, setInputRange] = useState<InputRange>([0, 0]);

  const getImageUrls = useCallback(
    (isDesktopView: boolean): ImageUrls => {
      const coverData = isDesktopView ? srcUrlDesktop : srcUrlMobile;

      const lowQuality = coverData?.formats?.large?.url || AUX_IMG_BG;
      const highQuality = coverData?.url || AUX_IMG_BG;

      return { lowQuality, highQuality };
    },
    [srcUrlDesktop, srcUrlMobile]
  );

  const preloadHighQualityImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }, []);

  useEffect(() => {
    const updateDesktopSize = async () => {
      const isDesktopView = window.matchMedia("(min-width: 768px)").matches;

      const urls = getImageUrls(isDesktopView);
      setImageUrls(urls);
      setIsHighQualityLoaded(false);

      if (urls.lowQuality !== urls.highQuality) {
        try {
          await preloadHighQualityImage(urls.highQuality);
          setIsHighQualityLoaded(true);
        } catch (error) {
          console.warn("Failed to preload high quality image:", error);
        }
      } else {
        setIsHighQualityLoaded(true);
      }
    };

    updateDesktopSize();
    window.addEventListener("resize", updateDesktopSize);
    return () => window.removeEventListener("resize", updateDesktopSize);
  }, [srcUrlDesktop, srcUrlMobile, getImageUrls, preloadHighQualityImage]);

  useEffect(() => {
    setInputRange([0, 800]);
    setOutputRange(parent === "banner" ? [0, 200] : [0, 0]);
  }, [parent]);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, inputRange, outputRange);

  const imageTransitionVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
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
          base: imageUrls.lowQuality ? "flex" : "block",
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

        <Box position="relative" width="100%" height="100%">
          {!isHighQualityLoaded && (
            <motion.div
              key="low-quality"
              initial="visible"
              animate="visible"
              exit="exit"
              variants={imageTransitionVariants}
              transition={{ duration: 0.3 }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                zIndex: 1,
              }}
            >
              <Image
                src={imageUrls.lowQuality}
                width={3000}
                height={0}
                alt="Banner Prensa - Low Quality"
                priority
                style={{
                  objectFit: "cover",
                  height: "100%",
                  filter: "blur(2px)",
                }}
                className={parent === "banner" ? "" : "pulse-motion"}
              />
            </motion.div>
          )}

          <AnimatePresence>
            {isHighQualityLoaded && (
              <motion.div
                key="high-quality"
                initial="hidden"
                animate="visible"
                variants={imageTransitionVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  zIndex: 2,
                }}
              >
                <Image
                  src={imageUrls.highQuality}
                  width={3000}
                  height={0}
                  alt="Banner Prensa - High Quality"
                  style={{
                    objectFit: "cover",
                    height: "100%",
                  }}
                  className={parent === "banner" ? "" : "pulse-motion"}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </Box>
    </motion.div>
  );
};

export default BackdropParallax;
