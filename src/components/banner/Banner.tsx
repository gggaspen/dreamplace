import { Text, Box, Flex } from "@chakra-ui/react";
import "./Banner.css";
import ButtonPrimary from "../button-primary/ButtonPrimary";

export default function Banner() {
  return (
    <Flex
      alignItems="flex-end"
      position="relative"
      overflow="hidden"
      height="100dvh"
    >
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
