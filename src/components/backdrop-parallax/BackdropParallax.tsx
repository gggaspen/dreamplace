"use client";

// import Lenis from "lenis";
import React, { CSSProperties, useEffect, useState } from "react";
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
import navHeight from "@/app/constants/nav-height";

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
  objectPosition = "center",
}) => {
  const [imageUrls, setImageUrls] = useState<ImageUrls>({
    lowQuality: AUX_IMG_BG,
    highQuality: AUX_IMG_BG,
  });
  const [isHighQualityLoaded, setIsHighQualityLoaded] =
    useState<boolean>(false);
  const [outputRange, setOutputRange] = useState<number[]>([0, 0]);
  const [inputRange, setInputRange] = useState<InputRange>([0, 0]);
  const [isDesktopViewState, setIsDesktopViewState] = useState<boolean>(false);


  useEffect(() => {
    const updateDesktopSize = async () => {
      const isDesktopView = window.matchMedia("(min-width: 768px)").matches;
      setIsDesktopViewState(isDesktopView);
      const coverData = isDesktopView ? srcUrlDesktop : srcUrlMobile;

      const lowQuality = coverData?.formats?.large?.url || AUX_IMG_BG;
      const highQuality = coverData?.url || AUX_IMG_BG;

      const urls = { lowQuality, highQuality };

      // Solo actualizar si las URLs han cambiado realmente
      let urlsChanged = false;
      setImageUrls((prevUrls) => {
        if (
          prevUrls.lowQuality === urls.lowQuality &&
          prevUrls.highQuality === urls.highQuality
        ) {
          return prevUrls;
        }
        urlsChanged = true;
        return urls;
      });

      // Solo resetear la carga si las URLs han cambiado
      if (urlsChanged) {
        setIsHighQualityLoaded(false);
      } else {
        return; // No hacer nada si las URLs no cambiaron
      }

      if (urls.lowQuality !== urls.highQuality) {
        try {
          const img = new window.Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () =>
              reject(new Error(`Failed to load image: ${urls.highQuality}`));
            img.src = urls.highQuality;
          });
          setIsHighQualityLoaded(true);
        } catch (error) {
          console.warn("Failed to preload high quality image:", error);
          setIsHighQualityLoaded(false);
        }
      } else {
        setIsHighQualityLoaded(true);
      }
    };

    updateDesktopSize();
    window.addEventListener("resize", updateDesktopSize);
    return () => window.removeEventListener("resize", updateDesktopSize);
  }, [srcUrlDesktop, srcUrlMobile]);

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
          lg: imageUrls.lowQuality ? "flex" : "block",
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
        />

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
                  objectPosition: objectPosition,
                  height: "100%",
                  filter: "blur(2px)",
                }}
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
                  marginTop: parent === "banner" && !isDesktopViewState ? navHeight : 0,
                }}
              >
                <Image
                  src={imageUrls.highQuality}
                  width={3000}
                  height={0}
                  alt="Banner Prensa - High Quality"
                  style={{
                    objectFit: "cover",
                    objectPosition: objectPosition,
                    height: "100%",
                  }}
                  className={
                    // parent === "banner" ? "pulse-motion-2" : "pulse-motion"
                    ""
                  }
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
