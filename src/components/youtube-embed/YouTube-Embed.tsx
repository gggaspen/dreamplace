"use client";

import { getFooterSection } from "@/services/strapi.service";
import { getYouTubeVideoId } from "@/utils/get-youtube-id";
import { Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const YouTubeEmbed = () => {
  const [embedSrc, setEmbedSrc] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _footerSection: any = await getFooterSection();
        if (!_footerSection || !_footerSection.youtube_url) {
          console.error("Datos del footer incompletos o no encontrados.");
          return;
        }
        const { youtube_url, youtube_title } = _footerSection;
        const id: string | undefined = getYouTubeVideoId(youtube_url);
        if (!id) {
          console.error("No se pudo extraer el ID del video de YouTube.");
          return;
        }

        if (id) {
          setEmbedSrc(
            `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&loop=1&controls=0`
          );
        }
        setTitle(youtube_title || "Dreamplace Video");
      } catch (error) {
        console.error("Error al obtener datos del footer:", error);
      }
    };
    fetchData();
  }, [embedSrc]);

  useEffect(() => {
    if (embedSrc) {
      // console.log("embedSrc actualizado:", embedSrc);
    }
  }, [embedSrc]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      py={{ base: "2em", lg: "4em" }}
    >
      {embedSrc && (
        <iframe
          width="100%"
          height="315"
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        ></iframe>
      )}
    </Flex>
  );
};

export default YouTubeEmbed;
