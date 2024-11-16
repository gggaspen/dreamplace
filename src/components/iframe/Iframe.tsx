import { Text, Box, Flex } from "@chakra-ui/react";
import BottomBanner from "../bottom-banner/BottomBanner";
import Arrow from "../arrow/Arrow";
import Link from "next/link";

export const Iframe = () => {
  const height = 152;
  // const height = 352;

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
                marginTop: "-5em",
              }}
              w={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
              px={{ base: "2em", md: "4em" }}
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
