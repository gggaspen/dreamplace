import { Flex } from "@chakra-ui/react";

export const Iframe = () => {
  return (
    <Flex
      w={"100%"}
      // h={"100%"}
      px={"2em"}
      justifyContent={"center"}
      alignItems={"center"}
      // position="absolute"
    >
      <iframe
        style={{ borderRadius: "14px" }}
        src="https://open.spotify.com/embed/artist/6dd2fVevgttSYrLvsRqdTI?utm_source=generator&theme=0"
        width="100%"
        height="152"
        // frameBorder="0"
        // allowfullscreen=""
        // allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </Flex>
  );
};
