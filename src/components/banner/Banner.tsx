"use client";

import { Text, Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import "./Banner.css";
import ButtonPrimary from "../button-primary/ButtonPrimary";
import Arrow from "../arrow/Arrow";
import BackdropParallax from "../backdrop-parallax/BackdropParallax";
import { useState } from "react";
// import TextScramble from "@/app/motions/TextScramble";

export default function Banner() {
  const height = "100dvh";
  // const textColor = "#eee";
  const textColor = "#eee";

  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const toggleExpand = () => setIsExpanded(!isExpanded);

  // const text = "Un espectáculo donde converge el arte, la música y los sueños.";
  // const text =
  //   "15 años de la fiesta más grande de Tandil. Nos recibe una co-producción en la que se presentarán el reconocido dúo local Scape From Reality, Isi Luis, quien nos visita desde Necochea, y, por primera vez en la ciudad, cerrará la noche Cristian U, reconocido artista de la ciudad de Buenos Aires, también conocido como Vasco.";
  const text =
    "Una serie de espectáculos donde converge el arte, la música y los sueños. Desconecta de la realidad... bailando.";

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
        // objectPosition="right"
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
            DREAMPLACE 2025
            {/* <TextScramble
              phrases={["DREAMPLACE ft. Rym & Retina press."]}
              className="text-white"
            /> */}
          </Text>
        </Box>
        <Box>
          {/* Habilitar el subtitulo superior */}

          {/* <Text
            _selection={{
              backgroundColor: "#000",
            }}
            fontSize={".8em"}
            color={textColor}
            mb={"1em"}
          >
            <span style={{ fontWeight: 600 }}>Estadio Ferro, Tandil</span> | 24
            Dic | Edición Navidad
          </Text> */}
          <Text
            _selection={{
              backgroundColor: "#000",
            }}
            fontSize={"1em"}
            color={textColor}
            onClick={toggleExpand}
            cursor={isMobile ? "pointer" : "default"}
          >
            {text}
            {/* {isMobile && !isExpanded
              ? `${text.slice(0, maxLength)}... Leer más`
              : text} */}
          </Text>
        </Box>
        <Box>
          <ButtonPrimary
            disabled={true}
            text="PRÓXIMAMENTE TICKETS A LA VENTA"
            mode="dark"
          >
            <Arrow color="#eee" w="20px" direction="top-right"></Arrow>
          </ButtonPrimary>
        </Box>
      </Flex>
    </Flex>
  );
}
