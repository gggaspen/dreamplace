import { Text, Box, Flex } from "@chakra-ui/react";
import "./Press.css";
import ButtonPrimary from "../button-primary/ButtonPrimary";
import Link from "next/link";
import Image from "next/image";

export default function Press() {
  return (
    <Flex
      alignItems="flex-end"
      position="relative"
      overflow="hidden"
      height="70dvh"
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
          backgroundImage:
            "url(https://i.postimg.cc/fWtDqKQB/Banner-Prensa.png)",
          backgroundPositionY: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
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
            Agustin Pietrocola
          </Text>
        </Box>
        <Box>
          <Text
            _selection={{
              backgroundColor: "#000",
            }}
            fontSize={"1em"}
          >
            todos los labels | todos los labels | importantes
          </Text>
        </Box>

        <Flex w={"100%"} alignItems={"center"} gap={"1em"} mt={"1em"}>
          {/* <Text fontWeight={"bold"} fontSize={".5em"} mb={"3em"}>
            2024 EDITION
          </Text> */}
          <Link
            href="https://www.instagram.com/agustinpietrocola/"
            target="_blank"
          >
            <Image
              src="https://i.postimg.cc/0NM8hg7n/ig.png"
              width={20}
              height={20}
              alt="Instagram icon"
            />
          </Link>
          <Link
            href="https://open.spotify.com/artist/6dd2fVevgttSYrLvsRqdTI?si=zRQQL_oJRkCH8hKjrJgBZg"
            target="_blank"
          >
            <Image
              src="https://i.postimg.cc/fLQhFVzW/spotify.png"
              width={20}
              height={20}
              alt="Spotify icon"
            />
          </Link>
          <Link href="https://soundcloud.com/agus-pietrocola" target="_blank">
            <Image
              src="https://i.postimg.cc/SQrpTQwq/soundcloud.png"
              width={20}
              height={20}
              alt="SoundCloud icon"
            />
          </Link>
        </Flex>

        <Box>
          <ButtonPrimary />
        </Box>
      </Flex>
    </Flex>
  );
}