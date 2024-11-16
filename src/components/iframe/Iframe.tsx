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
          position={"absolute"}
          w={"100%"}
          h={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
          zIndex={1}
          px={{ base: "2em", md: "4em" }}
        >
          <iframe
            style={{ borderRadius: "14px", marginTop: "-2em" }}
            src="https://open.spotify.com/embed/artist/6dd2fVevgttSYrLvsRqdTI?utm_source=generator"
            width="100%"
            height={height + "px"}
            loading="lazy"
          ></iframe>
        </Flex>
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
            alignItems={"flex-end"}
          >
            <Text
              fontSize={{ base: "1.5em", md: "2em" }}
              fontWeight={600}
              mb={`calc(${height}px - 2em)`}
            >
              Our Artists
            </Text>
            <Box mb={`calc(${height}px - 3em)`} zIndex={2}>
              <Link
                // style={{ marginBottom: `calc(${height}px - 2em)` }}
                href="https://open.spotify.com/artist/6dd2fVevgttSYrLvsRqdTI"
                target="_blank"
              >
                <Arrow direction={"top-right"} w={"20px"} color={"#fff"} />
              </Link>
            </Box>
          </Flex>
          <Box bgColor={"black"}>
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
