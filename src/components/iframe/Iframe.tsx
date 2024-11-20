"use client";

import { Text, Box, Flex, useMediaQuery } from "@chakra-ui/react";
import BottomBanner from "../bottom-banner/BottomBanner";
import Arrow from "../arrow/Arrow";
import Link from "next/link";
import { useEffect, useState } from "react";

export const Iframe = () => {
  // const [isDesktop] = useMediaQuery(["(min-width: 768px)"], {
  //   ssr: true,
  // });
  // const height = isDesktop ? 352 : 152;
  const [height, setHeight] = useState(152);
  useEffect(() => {
    const updateHeight = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      setHeight(isDesktop ? 352 : 152);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <>
      <Box pos={"relative"}>
        <Flex
          flexDirection={"column"}
          justifyContent={"flex-end"}
          bgColor={"black"}
        >
          <Flex
            h={{ base: "30dvh", md: "50dvh" }}
            bgColor={"black"}
            px={{ base: "2em", md: "4em" }}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text
              fontSize={{ base: "1.5em", md: "3em" }}
              fontWeight={600}
              mb={{
                base: `calc(${height}px - 2em)`,
                md: `calc(${height}px - 1em)`,
              }}
              color={"#eee"}
            >
              Our Artists
            </Text>
            <Box
              zIndex={2}
              mb={{
                base: `calc(${height}px - 2.5em)`,
                md: `calc(${height}px - 1em)`,
              }}
            >
              <Link
                href="https://open.spotify.com/artist/6dd2fVevgttSYrLvsRqdTI"
                target="_blank"
              >
                <Arrow direction={"top-right"} w={"20px"} color={"#fff"} />
              </Link>
            </Box>
          </Flex>
          <Box bgColor={"blue"}>
            <Flex
              style={{
                position: "absolute",
                zIndex: 1,
              }}
              w={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
              px={{ base: "2em", md: "4em" }}
              mt={{ base: `-5em`, md: `-12.5em` }}
            >
              <iframe
                style={{
                  borderRadius: "14px",
                }}
                src="https://open.spotify.com/embed/artist/6dd2fVevgttSYrLvsRqdTI?utm_source=generator"
                width="100%"
                height={height + "px"}
                loading="lazy"
              ></iframe>
            </Flex>
            <BottomBanner
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
