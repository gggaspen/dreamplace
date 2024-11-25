import { Text, Box, Flex } from "@chakra-ui/react";
import "./Press.css";
import ButtonPrimary from "../button-primary/ButtonPrimary";
import Link from "next/link";
import Image from "next/image";
import Arrow from "../arrow/Arrow";
import BackdropParallax from "../backdrop-parallax/BackdropParallax";

enum ESocial {
  INSTAGRAM = "instagram",
  YOUTUBE = "youtube",
  BEATPORT = "beatport",
  SPOTIFY = "spotify",
  SOUNDCLOUD = "soundcloud",
}

export default function Press() {
  const height = "100dvh";

  const socialLinks = [
    {
      id: ESocial.INSTAGRAM,
      href: "https://www.instagram.com/agustinpietrocola/",
      src: "/img/icon/ig.png",
      alt: "Instagram link",
    },
    {
      id: ESocial.YOUTUBE,
      href: "https://www.youtube.com/channel/UCtCL9yJkw1gggaAKXaxcgPw",
      src: "/img/icon/youtube.png",
      alt: "YouTube link",
    },
    {
      id: ESocial.BEATPORT,
      href: "https://www.beatport.com/artist/agustin-pietrocola/629328?srsltid=ESocial.BEATPORT -Tx9",
      src: "/img/icon/beatport.png",
      alt: "Beatport link",
    },
    {
      id: ESocial.SPOTIFY,
      href: "https://open.spotify.com/artist/6dd2fVevgttSYrLvsRqdTI?si=zRQQL_oJRkCH8hKjrJgBZg",
      src: "/img/icon/spotify.png",
      alt: "Spotify link",
    },
    {
      id: ESocial.SOUNDCLOUD,
      href: "https://soundcloud.com/agus-pietrocola",
      src: "/img/icon/soundcloud.png",
      alt: "SoundCloud link",
    },
  ];

  return (
    <Flex
      alignItems="flex-end"
      position="relative"
      overflow="hidden"
      height={{ base: height, lg: height }}
      justifyContent={{ base: "center", lg: "center" }}
    >
      <BackdropParallax
        srcUrl="https://i.postimg.cc/fWtDqKQB/Banner-Prensa.png"
        height={height}
      ></BackdropParallax>
      <Box
        w={"100%"}
        h={"100%"}
        bg={
          "linear-gradient(0deg, rgb(0 0 0) 0%, transparent, rgb(255 255 255 / 0%) 100%)"
        }
        position="absolute"
      />

      {/* Contenido */}
      <Flex
        flexDirection="column"
        justifyContent="flex-end"
        gap="2"
        w={"100%"}
        h={height}
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
            fontSize={{ base: "2em", lg: "3em" }}
            color={"#eee"}
            fontWeight={600}
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
            color={"#eee"}
          >
            Mango Alley | UV | Long Way Records
          </Text>
        </Box>

        <Flex w={"100%"} alignItems={"center"} gap={"1.5em"} mt={"1em"}>
          {socialLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              target="_blank"
              style={{ maxWidth: "20px" }}
            >
              <Image
                src={link.src}
                width={link.id === ESocial.BEATPORT ? 19 : 20}
                height={20}
                alt={link.alt}
              />
            </Link>
          ))}
        </Flex>
        <Box>
          <ButtonPrimary text="Presskit" download={true}>
            <Arrow color="#000" w="20px" direction="top-right"></Arrow>
          </ButtonPrimary>
        </Box>
      </Flex>
    </Flex>
  );
}
