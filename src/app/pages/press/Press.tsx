// #region imports

import React, { CSSProperties, useEffect, useState } from "react";
import { Text, Box, Flex } from "@chakra-ui/react";
import "./Press.css";
import ButtonPrimary from "../../../components/button-primary/ButtonPrimary";
import Link from "next/link";
import Image from "next/image";
import Arrow from "../../../components/arrow/Arrow";
import BackdropParallax from "../../../components/backdrop-parallax/BackdropParallax";
import { ICover } from "@/interfaces/event.interface";
import { EPlatform } from "@/enums/platform.enum";
import getPlatformUrl from "@/utils/get-platform-url";

// #endregion imports

export interface IArtist {
  name: string;
  links: {
    id: number;
    platform: EPlatform;
    url: string;
    primary?: boolean;
  }[];
  photos: ICover[];
  labels: { name: string; url?: string; logo?: string }[];
}

interface PressProps {
  artist: IArtist;
  // config: {
  //   title: string;
  //   artists: IArtist[];
  // };
}

export default function Press({ artist }: PressProps) {
  const { name, labels, links, photos } = artist;

  // const height = "100dvh";
  const textColor = "#eee";

  const [windowHeight, setWindowHeight] = useState<CSSProperties["height"]>(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight + "px");
  }, []);

  const styles: CSSProperties = {
    height: windowHeight,
  };

  return (
    <Flex
      alignItems="flex-end"
      position="relative"
      overflow="hidden"
      // height={{ base: height, lg: height }}
      justifyContent={{ base: "center", lg: "center" }}
      h={styles.height}
    >
      <BackdropParallax
        srcUrlDesktop={photos[0]}
        srcUrlMobile={photos[0]}
        height={styles.height}
        parent={"press"}
      ></BackdropParallax>

      {/* Gradient */}

      <Box
        w={"100%"}
        h={"100%"}
        bg={
          "linear-gradient(0deg, rgb(0 0 0) 0%, transparent, rgb(255 255 255 / 0%) 100%)"
        }
        position="absolute"
        zIndex={3}
      />

      {/* Contenido */}
      <Flex
        flexDirection="column"
        justifyContent="flex-end"
        gap="2"
        w={"100%"}
        h={"100%"}
        paddingBottom={"10%"}
        paddingX={{ base: "2em", lg: "14em" }}
        paddingRight={{ base: "2em", lg: "40%" }}
        zIndex={3}
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
            {labels.map((l, i) => (
              <React.Fragment key={i}>
                <span>{l.name}</span>
                <span>{i !== labels.length - 1 ? " | " : ""}</span>
              </React.Fragment>
            ))}
          </Text>
        </Box>

        <Flex w={"100%"} alignItems={"center"} gap={"1.5em"} mt={"1em"}>
          {links.map((link, index) => {
            if (link.platform !== EPlatform.PRESSKIT) {
              return (
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
                    style={{ height: "auto" }}
                    alt={link.platform}
                  />
                </Link>
              );
            }
          })}
        </Flex>
        <Box>
          <ButtonPrimary
            mode="dark"
            text={links.find((l) => l.primary)?.platform.toUpperCase()}
            download={true}
            linkUrl={links.find((l) => l.primary)?.url}
          >
            <Arrow color="#000" w="20px" direction="top-right"></Arrow>
          </ButtonPrimary>
        </Box>
      </Flex>
    </Flex>
  );
}
