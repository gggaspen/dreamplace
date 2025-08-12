"use client";

import { Box, Text, Flex } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import Logo from "../../../components/logo/Logo";
import Image from "next/image";
import Link from "next/link";
import YouTubeEmbed from "@/components/youtube-embed/YouTube-Embed";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef(null); // El ref para el observador

  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true); // Cambia el estado cuando sea visible
        }
      },
      { threshold: 0.5 } // Se activa cuando el 50% del elemento es visible
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, []);

  const openAdmin = () => {
    setCounter(counter + 1);
    const isAdminOpen = counter >= 10;
    if (isAdminOpen) {
      window.open("https://dreamplace-strapi.up.railway.app/admin", "_blank");
      setCounter(0);
    }
  };

  return (
    <Flex
      flexDirection={"column"}
      justifyContent={"space-between"}
      bg={"#000"}
      py={"1em"}
      paddingX={{ base: "2em", lg: "14em" }}
    >
      <Box h={""} borderBottom={"1px solid #eee"} mb={"2em"} />

      {/* El contenedor observado siempre está presente */}
      <div ref={observerRef} style={{ visibility: "hidden" }} />

      {/* Renderiza el iframe cuando es visible */}
      {isVisible && <YouTubeEmbed />}
      {/* {isVisible && <YouTubeEmbed title={youtube_title} src={youtube_url} />} */}

      <Flex
        color={"white"}
        w={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"}
        gap={"2em"}
      >
        <Text fontWeight={"bold"} fontSize={"1em"} my={"2em"}>
          {new Date().getFullYear()} EDITION
        </Text>

        <Link href="https://www.instagram.com/dreamplace.ar/" target="_blank">
          <Text>@dreamplace.ar</Text>
        </Link>

        <Link href="https://www.instagram.com/dreamplace.ar/" target="_blank">
          <Image
            src="https://i.postimg.cc/0NM8hg7n/ig.png"
            width={30}
            height={30}
            alt="Instagram icon"
          />
        </Link>
      </Flex>

      <Flex justifyContent={"center"} my={"4em"}>
        <Box onClick={() => openAdmin()}>
          <Logo mode="full" w={"calc(100dvw - 40em)"} color="rgb(34, 34, 34)" />
        </Box>
      </Flex>
    </Flex>
  );
}
