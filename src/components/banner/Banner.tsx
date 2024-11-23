import { Text, Box, Flex } from "@chakra-ui/react";
import "./Banner.css";
import ButtonPrimary from "../button-primary/ButtonPrimary";
import Arrow from "../arrow/Arrow";
import BackdropParallax from "../backdrop-parallax/BackdropParallax";
// import TextScramble from "@/app/motions/TextScramble";

export default function Banner({ bgSourceUrl, forPress }: any) {
  return (
    <Flex
      alignItems="center"
      position="relative"
      overflow="hidden"
      height={forPress ? "70dvh" : "100dvh"}
      flexDirection={"column"}
    >
      {/* <Box
        className="op-motion bg-banner"
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        // filter={{
        //   base: "blur(10px)",
        //   lg: "blur(0px)",
        // }}
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      /> */}

      {/* <Flex
        display={{ base: "flex", lg: "none" }}
        justifyContent={"center"}
        alignItems={"center"}
        w={"100%"}
        h={"100%"}
        position="absolute"
      >
        <Box
          w={"60dvw"}
          h={"60dvw"}
          bgSize={"cover"}
          bgPos={"center"}
          className="minicover"
          mb={"6em"}
        />
      </Flex> */}

      {/* {!forPress ? (
        <>
          <BackdropParallax
            srcUrl={bgSourceUrl}
            objectPosition="right"
          ></BackdropParallax>
          <Box
            w={"100%"}
            h={"100%"}
            bg={
              "linear-gradient(0deg, rgb(0 0 0) 0%, transparent, rgb(255 255 255 / 0%) 100%)"
            }
            position="absolute"
          />
        </>
      ) : null} */}
      <BackdropParallax
        srcUrl={bgSourceUrl}
        objectPosition="right"
        forPress={forPress}
      ></BackdropParallax>
      <Box
        w={"100%"}
        h={"100%"}
        bg={
          "linear-gradient(0deg, rgb(0 0 0) 0%, transparent, rgb(255 255 255 / 0%) 100%)"
        }
        position="absolute"
        zIndex={1}
      />

      {/* Contenido */}
      <Flex
        flexDirection="column"
        justifyContent="flex-end"
        gap="2"
        // h="100dvh"
        h={forPress ? "70dvh" : "100dvh"}
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
            fontSize={{ base: "1.5em", lg: "3em" }}
            color={"#eee"}
          >
            DREAMPLACE ft. Rym & Retina press.
            {/* <TextScramble
              phrases={["DREAMPLACE ft. Rym & Retina press."]}
              className="text-white"
            /> */}
          </Text>
        </Box>
        <Box>
          <Text
            _selection={{
              backgroundColor: "#000",
            }}
            fontSize={".8em"}
            color={"#eee"}
            mb={"1em"}
          >
            <span style={{ fontWeight: 600 }}>El Muelle</span> | 30 NOV 2024
          </Text>
          <Text
            _selection={{
              backgroundColor: "#000",
            }}
            fontSize={".8em"}
            color={"#eee"}
          >
            Un espectáculo donde converge el arte, la música y los sueños.
          </Text>
        </Box>
        <Box>
          <ButtonPrimary>
            <Arrow color="#000" w="20px" direction="top-right"></Arrow>
          </ButtonPrimary>
        </Box>
      </Flex>
      {/* 
      {forPress ? (
        <>
          <BackdropParallax
            srcUrl={bgSourceUrl}
            objectPosition="right"
          ></BackdropParallax>
          <Box
            w={"100%"}
            h={"100%"}
            bg={
              "linear-gradient(0deg, rgb(0 0 0) 0%, transparent, rgb(255 255 255 / 0%) 100%)"
            }
            position="absolute"
          />
        </>
      ) : null} */}
    </Flex>
  );
}
