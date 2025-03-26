"use client";

import { Text, Box, Flex } from "@chakra-ui/react";
import BottomBanner from "../../../components/bottom-banner/BottomBanner";
import Arrow from "../../../components/arrow/Arrow";
import Link from "next/link";
import generateSpotifyEmbedSrc from "@/utils/generateSpotifySrc";

interface ResidentSection {
  config: {
    titulo: string;
    embed_url: string;
    link_url: string;
    banner_text: string;
    banner_url: string;
  };
}

export const Resident = ({ config }: ResidentSection) => {
  const height = 352;
  const { titulo, embed_url, link_url, banner_text, banner_url } = config;

  return (
    <>
      <BottomBanner
        text={banner_text}
        url={banner_url}
        rows={[{ direction: "left" }]}
      />
      <Box pos={"relative"}>
        <Flex
          flexDirection={"column"}
          justifyContent={"flex-end"}
          bgColor={"#000"}
        >
          <Flex
            h={{ base: "50dvh", md: "60dvh" }}
            bgColor={"#000"}
            px={{ base: "2em", md: "14em" }}
            pt={{ base: "3em", md: "3em" }}
            justifyContent={"space-between"}
          >
            <Text
              fontSize={{ base: "1.5em", md: "3em" }}
              fontWeight={600}
              color={"#eee"}
            >
              {titulo}
            </Text>
            <Flex
              alignItems={"flex-start"}
              zIndex={2}
              mt={{ base: "0", md: "1em" }}
            >
              <Link
                href={link_url ? link_url : "#"}
                target={link_url ? "_blank" : "_self"}
              >
                <Arrow direction={"top-right"} w={"30px"} color={"#eee"} />
              </Link>
            </Flex>
          </Flex>
          <Box>
            <Flex
              style={{
                position: "absolute",
                zIndex: 1,
              }}
              w={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
              px={{ base: "2em", md: "14em" }}
              mt={{ base: "-218px", md: "-12.5em" }}
            >
              <iframe
                style={{
                  borderRadius: "14px",
                }}
                src={generateSpotifyEmbedSrc(embed_url)}
                width="100%"
                height={height + "px"}
                loading="lazy"
              ></iframe>
            </Flex>
            <BottomBanner
              text={banner_text}
              url={banner_url}
              rows={[
                { direction: "right" },
                { direction: "left" },
                { direction: "right" },
              ]}
            />
          </Box>
        </Flex>
      </Box>
    </>
  );
};
