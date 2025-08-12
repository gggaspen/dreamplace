"use client";

import { Text, Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import "./Banner.css";
import { useState } from "react";
import IEvent from "@/interfaces/event.interface";
import { dateToCustomString } from "@/utils/format-date";
// import IBannerData from "@/interfaces/banner-data.interface";
import React from "react";
import BackdropParallax from "@/components/backdrop-parallax/BackdropParallax";
// import ButtonPrimary from "@/components/button-primary/ButtonPrimary";
// import Arrow from "@/components/arrow/Arrow";
import IHeroConfig from "../interfaces/hero-config.interface";

export default function Banner({
  config,
  event,
}: {
  config: IHeroConfig;
  event: IEvent;
}) {
  const {
    title,
    subtitle,
    paragraph,
    // button,
    cover_desktop,
    cover_mobile,
  } = config;
  const { date } = event;

  const optimizedDesktopCover = React.useMemo(
    () => cover_desktop,
    [cover_desktop]
  );
  const optimizedMobileCover = React.useMemo(
    () => cover_mobile,
    [cover_mobile]
  );

  const _date: string = dateToCustomString(new Date(date));

  const textColor = "#eee";

  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <Flex
      alignItems="flex-end"
      position="relative"
      overflow="hidden"
      height={"100%"}
    >
      <BackdropParallax
        srcUrlDesktop={optimizedDesktopCover}
        srcUrlMobile={optimizedMobileCover}
        height={"100%"}
        parent={"banner"}
      ></BackdropParallax>
      <Box
        // display={"none"}
        w={"100%"}
        h={"100%"}
        bg={
          "linear-gradient(0deg, rgb(0 0 0) 0%, transparent, transparent, rgb(255 255 255 / 0%) 100%)"
        }
        position="absolute"
      />

      {/* Contenido */}
      <Flex
        flexDirection="column"
        justifyContent="flex-end"
        gap="2"
        h="100dvh"
        zIndex={1}
        paddingBottom={"10%"}
        paddingX={{ base: "2em", lg: "14em" }}
        paddingRight={{ base: "2em", lg: "40%" }}
      >
        <Box>
          <Text
            _selection={{
              backgroundColor: "#000",
            }}
            fontSize={{ base: "2em", lg: "4em" }}
            color={textColor}
          >
            {title}
            {/* <TextScramble
              phrases={["DREAMPLACE ft. Rym & Retina press."]}
              className="text-white"
            /> */}
          </Text>
        </Box>
        <Box>
          {/* Habilitar el subtitulo superior */}

          {subtitle && (
            <Text
              _selection={{
                backgroundColor: "#000",
              }}
              fontSize={".8em"}
              color={textColor}
              mb={"1em"}
            >
              <span style={{ fontWeight: 600 }}>{subtitle}</span> | {_date}
            </Text>
          )}
          <Text
            _selection={{
              backgroundColor: "#000",
            }}
            fontSize={"1em"}
            color={textColor}
            onClick={toggleExpand}
            cursor={isMobile ? "pointer" : "default"}
          >
            {paragraph}
            {/* {isMobile && !isExpanded
              ? `${_paragraph.slice(0, maxLength)}... Leer más`
              : _paragraph} */}
          </Text>
        </Box>
        {/* <Box>
          <ButtonPrimary
            // disabled={!button.link ? false : true}
            text={button.text}
            linkUrl={button.link}
            mode="dark"
          >
            <Arrow color="#eee" w="20px" direction="top-right"></Arrow>
          </ButtonPrimary>
        </Box> */}
      </Flex>
    </Flex>
  );
}
