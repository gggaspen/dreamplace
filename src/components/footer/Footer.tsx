import { Text, Flex, Button } from "@chakra-ui/react";
import Arrow from "../arrow/Arrow";
import React from "react";

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
      <Flex alignItems={"center"} overflow={"hidden"}>
        {textsList.map(({ text }, index) => (
          <React.Fragment key={index}>
            <Flex alignItems={"center"} py={"1em"}>
              <Text whiteSpace={"nowrap"}>{text}</Text>
              <Arrow direction={"bottom"} color={"#fff"} w={"20px"}></Arrow>
            </Flex>
          </React.Fragment>
        ))}
      </Flex>
      <Flex h={"100dvh"} justifyContent={"center"} alignItems={"center"}>
        <Button
          backgroundColor={"#eee"}
          color={"#111"}
          fontWeight={"600"}
          border={"none"}
          cursor={"pointer"}
          padding={"10px 20px"}
          marginTop={"1em"}
          borderRadius={"none"}
          transition={"background-color 0.2s ease-out, color 0.2s ease-out"}
          _hover={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            color: "#eee",
            boxShadow: "inset 0 0 0px 1px #eee",
          }}
        >
          CONSEGUÍ AHORA TUS ENTRADAS
        </Button>
      </Flex>
    </>
  );
}
