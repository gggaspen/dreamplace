import { Text, Box, Flex } from "@chakra-ui/react";
import "./Press.css";
import ButtonPrimary from "../../../components/button-primary/ButtonPrimary";
import Link from "next/link";
import Image from "next/image";
import Arrow from "../../../components/arrow/Arrow";
import BackdropParallax from "../../../components/backdrop-parallax/BackdropParallax";
import { ICover } from "@/interfaces/event.interface";
import MiniBanner from "@/components/mini-banner/MiniBanner";
import { EPlatform } from "@/enums/platform.enum";
import getPlatformUrl from "@/utils/get-platform-url";

interface IArtist {
  name: string;
  links: {
    id: number;
    platform: EPlatform;
    url: string;
  }[];
  photos: ICover[];
  labels: string;
}

interface PressProps {
  config: {
    title: string;
    artists: IArtist[];
  };
}

export default function Press({ config }: PressProps) {
  const { title, artists } = config;
  const { name, labels, links, photos } = artists[2];

  const height = "100dvh";
  const textColor = "#eee";

  return (
    <>
      <MiniBanner text={title} bgColor="#eee" />

      <Flex
        alignItems="flex-end"
        position="relative"
        overflow="hidden"
        height={{ base: height, lg: height }}
        justifyContent={{ base: "center", lg: "center" }}
      >
        <BackdropParallax
          srcUrlDesktop={photos[0]}
          srcUrlMobile={photos[0]}
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
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.url}
                target="_blank"
                style={{ maxWidth: "20px" }}
              >
                <Image
                  src={getPlatformUrl(link.platform)}
                  width={link.platform === EPlatform.BEATPORT ? 19 : 20}
                  height={20}
                  alt={link.platform}
                />
              </Link>
            ))}
          </Flex>
          <Box>
            <ButtonPrimary
              mode="dark"
              text={links[0].platform}
              download={true}
              linkUrl={links[0].url}
            >
              <Arrow color="#000" w="20px" direction="top-right"></Arrow>
            </ButtonPrimary>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
