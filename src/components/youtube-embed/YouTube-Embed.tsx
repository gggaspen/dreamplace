"use client";

import { getFooterSection } from "@/services/strapi.service";
import { getYouTubeVideoId } from "@/utils/get-youtube-id";
import { Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
const YouTubeEmbed = () => {
  const [footerSection, setFooterSection] = useState<any>({});

  const [embedSrc, setEmbedSrc] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _footerSection: any = await getFooterSection();
        setFooterSection(_footerSection);
      } catch (error) {
        console.error("Error: ", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (footerSection) {
      console.log("footerSection actualizado:", footerSection);
      const { youtube_url, youtube_title } = footerSection;
      const id = getYouTubeVideoId(youtube_url);
      setEmbedSrc(
        `https://www.youtube.com/embed/${id}&autoplay=1&mute=0&loop=1&controls=0`
      );
      setTitle(youtube_title);
    }
  }, [footerSection]);

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      py={{ base: "2em", lg: "4em" }}
    >
      <iframe
        width="100%"
        height="315"
        src={embedSrc}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    </Flex>
  );
};

export default YouTubeEmbed;
