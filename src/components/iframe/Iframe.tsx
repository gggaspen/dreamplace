import { Text, Box, Flex } from "@chakra-ui/react";
import BottomBanner from "../bottom-banner/BottomBanner";

export const Iframe = () => {
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
          // bgImage={"url(https://i.postimg.cc/fWtDqKQB/Banner-Prensa.png)"}
          // bgRepeat={"no-repeat"}
          // bgPos={"center"}
          // bgSize={"cover"}
          // bgAttachment={"fixed"}
        >
          <iframe
            style={{ borderRadius: "14px" }}
            src="https://open.spotify.com/embed/artist/6dd2fVevgttSYrLvsRqdTI?utm_source=generator"
            width="100%"
            // height="352"
            height="152"
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
              mb={"calc(152px - 2em)"}
            >
              Our Artists
            </Text>
            <Text
              fontSize={{ base: "1.5em", md: "2em" }}
              mb={"calc(152px - 2em)"}
            >
              "#$%& &% &%#/
            </Text>
          </Flex>
          <Box h={{ base: "30dvh", md: "50dvh" }} bgColor={"black"}>
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
