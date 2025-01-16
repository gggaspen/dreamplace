"use client";

import { Text, Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import "./Banner.css";
import ButtonPrimary from "../button-primary/ButtonPrimary";
import Arrow from "../arrow/Arrow";
import BackdropParallax from "../backdrop-parallax/BackdropParallax";
import { useState } from "react";
import IEvent from "@/interfaces/event.interface";
import { dateToCustomString } from "@/utils/format-date";
import IBannerData from "@/interfaces/banner-data.interface";
import React from "react";
// import TextScramble from "@/app/motions/TextScramble";

export default function Banner({
  event,
  data,
}: {
  event: IEvent;
  data: IBannerData;
}) {
  /**
   * EVENTS
   */
  const { name, location, description, date, cover_desktop, cover_mobile } =
    event;

  const optimizedDesktopCover = React.useMemo(
    () => cover_desktop,
    [cover_desktop]
  );
  const optimizedMobileCover = React.useMemo(
    () => cover_mobile[0],
    [cover_mobile]
  );

  const _description = description[0].children[0].text;
  const _location: string =
    location.includes("http") || location.includes("maps.app")
      ? location + "__"
      : location;
  const _date: string = dateToCustomString(new Date(date));

  /**
   * DATA
   */
  const { textoBotonPrincipal, linkBotonPrincipal } = data;

  const moreInfo = false;
  const height = "100dvh";
  // const textColor = "#eee";
  const textColor = "#eee";

  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // Calcula la longitud del texto a mostrar en modo contraído
  // const maxLength = Math.floor(text.length / 2);

  return (
    <Flex
      alignItems="flex-end"
      position="relative"
      overflow="hidden"
      height={height}
    >
      <BackdropParallax
        srcUrlDesktop={optimizedDesktopCover}
        srcUrlMobile={optimizedMobileCover}
        height={height}
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
            {name}
            {/* <TextScramble
              phrases={["DREAMPLACE ft. Rym & Retina press."]}
              className="text-white"
            /> */}
          </Text>
        </Box>
        <Box>
          {/* Habilitar el subtitulo superior */}

          <Text
            _selection={{
              backgroundColor: "#000",
            }}
            fontSize={".8em"}
            color={textColor}
            mb={"1em"}
          >
            <span style={{ fontWeight: 600 }}>{_location}</span> | {_date}{" "}
            {moreInfo ? "Edición Navidad" : null}
          </Text>
          <Text
            _selection={{
              backgroundColor: "#000",
            }}
            fontSize={"1em"}
            color={textColor}
            onClick={toggleExpand}
            cursor={isMobile ? "pointer" : "default"}
          >
            {_description}
            {/* {isMobile && !isExpanded
              ? `${_description.slice(0, maxLength)}... Leer más`
              : _description} */}
          </Text>
        </Box>
        <Box>
          <ButtonPrimary
            disabled={linkBotonPrincipal ? false : true}
            text={textoBotonPrincipal}
            linkUrl={linkBotonPrincipal}
            mode="dark"
          >
            <Arrow color="#eee" w="20px" direction="top-right"></Arrow>
          </ButtonPrimary>
        </Box>
      </Flex>
    </Flex>
  );
}
