// "use client";

import { Text, Box, Flex, Button, Link } from "@chakra-ui/react";
import "./Banner.css";
import ButtonPrimary from "../button-primary/ButtonPrimary";
// import TextScramble from "@/app/motions/TextScramble";

export default function Banner() {
  const url =
    "https://www.passline.com/eventos/sab-3011-agustin-pietrocola-ailen-dc-naza-rv-facukid-ariel-stamile-meline-323995/lean-gorosito";

  return (
    <Flex
      alignItems="flex-end"
      position="relative"
      overflow="hidden"
      height="100dvh"
    >
      {/* Pseudo-elemento con fondo fijo */}
      <Box
        className="op-motion bg-banner"
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          // backgroundImage:
          //   "url(https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExc3h6eWo5Z3VtZHl0OWxseWkxaTl3NjB3emt6MmoxYXg2b3d2aDJ1OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/88Fu8MtnSXI6j3ywN8/giphy.gif)",
          // backgroundImage: `url(https://i.postimg.cc/2SFKfTPn/Runa-4.jpg)`,
          // backgroundSize: "cover",
          // backgroundPosition: "center",
          // backgroundAttachment: "fixed",
          // transform: "scaleX(-1)",
          zIndex: 0,
        }}
      />

      {/* Contenido */}
      <Flex
        flexDirection="column"
        justifyContent="flex-end"
        gap="2"
        h="100dvh"
        zIndex={1}
        paddingBottom={"10%"}
        paddingLeft={"10%"}
        paddingRight={{ base: "10%", lg: "40%" }}
      >
        <Box>
          <Text
            _selection={{
              backgroundColor: "#000",
            }}
            fontSize={{ base: "2em", lg: "3em" }}
          >
            {/* <TextScramble phrases={["DREAMPLACE ft. Rym & Retina press."]} /> */}
            DREAMPLACE ft. Rym & Retina press.
          </Text>
        </Box>
        <Box>
          <Text
            _selection={{
              backgroundColor: "#000",
            }}
            fontSize={"1em"}
          >
            &quot;El muelle&quot; | 30 NOV 2024
          </Text>
          <Text
            _selection={{
              backgroundColor: "#000",
            }}
            fontSize={"1em"}
          >
            Un espectáculo donde converge el arte, la música y los sueños.
          </Text>
        </Box>
        <Box>
          <ButtonPrimary />
        </Box>
      </Flex>
    </Flex>
  );
}
