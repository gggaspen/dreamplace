import { Box, Text, Flex } from "@chakra-ui/react";
import Arrow from "../arrow/Arrow";
import React from "react";
import "./MiniBanner.css";

export default function MiniBanner({ bgColor }: any) {
  const textsList = [
    { text: "NUESTROS ARTISTAS" },
    { text: "NUESTROS ARTISTAS" },
    { text: "NUESTROS ARTISTAS" },
    { text: "NUESTROS ARTISTAS" },
    { text: "NUESTROS ARTISTAS" },
    { text: "NUESTROS ARTISTAS" },
    { text: "NUESTROS ARTISTAS" },
  ];

  return (
    <Box bg={bgColor} position={"relative"} overflow={"hidden"} py={"1em"}>
      <Flex animation={"scrollText 50s infinite linear"} whiteSpace={"nowrap"}>
        {textsList.map(({ text }, index) => (
          <React.Fragment key={index}>
            <Flex w={"100%"}>
              <Text
                color={bgColor === "#eee" ? "#000" : "#eee"}
                display={"flex"}
                fontSize={{ base: "1em", lg: "2em" }}
              >
                <Text whiteSpace={"nowrap"}>{text}</Text>
                <Arrow
                  direction={"bottom"}
                  color={bgColor === "#eee" ? "#000" : "#eee"}
                  w={"20px"}
                ></Arrow>
              </Text>
            </Flex>
          </React.Fragment>
        ))}
      </Flex>
    </Box>
  );
}
