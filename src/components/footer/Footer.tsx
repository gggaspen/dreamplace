import { Box, Text, Flex, Button } from "@chakra-ui/react";
import Arrow from "../arrow/Arrow";
import React from "react";
import "./Footer.css";
import ButtonPrimary from "../button-primary/ButtonPrimary";

export default function Banner() {
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
    <>
      <Box position={"relative"} overflow={"hidden"} py={"1em"}>
        <Flex
          animation={"scrollText 50s infinite linear"}
          whiteSpace={"nowrap"}
        >
          {textsList.map(({ text }, index) => (
            <React.Fragment key={index}>
              <Flex w={"100%"}>
                <Text display={"flex"} fontSize={{ base: "1em", lg: "2em" }}>
                  <Text whiteSpace={"nowrap"}>{text}</Text>
                  <Arrow direction={"bottom"} color={"#fff"} w={"20px"}></Arrow>
                </Text>
              </Flex>
            </React.Fragment>
          ))}
        </Flex>
      </Box>
      {/* </Flex> */}
      <Flex h={"100dvh"} justifyContent={"center"} alignItems={"center"}>
        <ButtonPrimary />
      </Flex>
    </>
  );
}
