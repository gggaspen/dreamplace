import { Flex } from "@chakra-ui/react";

export const Iframe = () => {
  return (
    <Flex
      w={"100%"}
      h={"50dvw"}
      p={"4em"}
      justifyContent={"center"}
      alignItems={"flex-end"}
      // position="absolute"
      bgImage={"url(https://i.postimg.cc/fWtDqKQB/Banner-Prensa.png)"}
    >
      <iframe
        style={{ borderRadius: "14px" }}
        src="https://open.spotify.com/embed/album/5qU46hoQWsXz3Ciw6p3Cgt?utm_source=generator&theme=0"
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
