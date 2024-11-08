// "use client";

import { Text, Box, Flex, Button } from "@chakra-ui/react";
import "./Banner.css";

export default function Banner() {
  return (
    <Flex
      alignItems="flex-end"
      position="relative"
      overflow="hidden"
      height="100vh"
    >
      {/* Pseudo-elemento con fondo fijo */}
      <Box
        className="op-motion"
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
          // backgroundImage: "url(https://i.postimg.cc/cJRCSK23/MG-4797-1.jpg)",
          // backgroundImage: `url(https://i.postimg.cc/cJRCSK23/MG-4797-1.jpg)`,
          backgroundImage: `url(https://i.postimg.cc/2SFKfTPn/Runa-4.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          // transform: "scaleX(-1)",
          zIndex: 0,
        }}
      />

      {/* Contenido */}
      <Flex
        flexDirection="column"
        justifyContent="flex-end"
        gap="2"
        h="100vh"
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
            "El muelle" | 30 NOV 2024
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
          <Button
            w={"100%"}
            backgroundColor={"#eee"}
            color={"#111"}
            fontWeight={"600"}
            border={"none"}
            cursor={"pointer"}
            padding={"10px 20px"}
            marginTop={"1em"}
            borderRadius={"none"}
            transition={"background-color 0.2s ease-out, color 0.2s ease-out"}
            _hover={{
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              color: "#eee",
              boxShadow: "inset 0 0 0px 1px #eee",
            }}
          >
            CONSEGUÍ AHORA TUS ENTRADAS
          </Button>
        </Box>
      </Flex>
    </Flex>
  );
}
