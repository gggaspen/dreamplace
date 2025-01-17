import { Text, Box, Flex } from "@chakra-ui/react";
import "./Press.css";
import ButtonPrimary from "../../../components/button-primary/ButtonPrimary";
import Link from "next/link";
import Image from "next/image";
import Arrow from "../../../components/arrow/Arrow";
import BackdropParallax from "../../../components/backdrop-parallax/BackdropParallax";
import { ICover } from "@/interfaces/event.interface";
import MiniBanner from "@/components/mini-banner/MiniBanner";

enum ESocial {
  INSTAGRAM = "instagram",
  YOUTUBE = "youtube",
  BEATPORT = "beatport",
  SPOTIFY = "spotify",
  SOUNDCLOUD = "soundcloud",
}

interface IArtistPress {
  text_banner: string;
  name: string;
  labels: string;
  links: string[];
  photo: ICover;
  text_button: string;
  link_button: string;
}

interface PressProps {
  config: IArtistPress[];
  text_artists_banner: string;
}

export default function Press({ config, text_artists_banner }: PressProps) {
  const height = "100dvh";
  const textColor = "#eee";

  const { name, labels, links, photo, text_button, link_button } = config[0];

  console.log(links);

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
    <>
      <MiniBanner text={text_artists_banner} bgColor="#eee" />

      <Flex
        alignItems="flex-end"
        position="relative"
        overflow="hidden"
        height={{ base: height, lg: height }}
        justifyContent={{ base: "center", lg: "center" }}
      >
        <BackdropParallax
          srcUrlDesktop={photo}
          srcUrlMobile={photo}
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
              color={textColor}
              fontWeight={600}
            >
              {name}
            </Text>
          </Box>
          <Box>
            <Text
              _selection={{
                backgroundColor: "#000",
              }}
              fontSize={"1em"}
              color={textColor}
            >
              {labels}
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
            <ButtonPrimary
              mode="dark"
              text={text_button}
              download={true}
              linkUrl={link_button}
            >
              <Arrow color="#000" w="20px" direction="top-right"></Arrow>
            </ButtonPrimary>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
