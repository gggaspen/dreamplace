import { Flex } from "@chakra-ui/react";
import React from "react";
const YouTubeEmbed = ({
  // videoId = "_jrc-gAcAswzO9ZVbD6b56MTI2A",
  videoId = "AOgVRaNa_UM?si=I6awtst76bApQvKP",
  title = 'Agustin Pietrocola Playing "On My Mind" @Dreamplace [ 03/02/2024 ]',
}) => {
  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      py={{ base: "2em", lg: "4em" }}
    >
      <iframe
        width="100%"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}&autoplay=1&mute=0&loop=1&controls=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe>
    </Flex>
  );
};

export default YouTubeEmbed;
