import { Box, Text, Flex, Button } from "@chakra-ui/react";
import React from "react";

export default function PressInfo() {
  const description =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.";
  const btnLabel = "Comprar Tickets";

  return (
    <>
      <Box bg={"lightgray"} py={"1em"} px={"4em"}>
        <Text fontSize={"3em"} py={".5em"} color={"black"}>
          Attend ADE
        </Text>
        <Flex gap={"2em"} h={"50%"} pb={"1.5em"}>
          <Text fontWeight={"bold"} fontSize={"2em"} flex={1} color={"black"}>
            ADE Pro <br /> Pass
          </Text>
          <Flex
            display={{ base: "none", lg: "flex" }}
            alignItems={"flex-end"}
            flex={2}
          >
            <Text color={"black"}>{description}</Text>
          </Flex>
          <Button
            bgColor={"yellow"}
            borderRadius={"100px"}
            p={"1em"}
            py={"1.5em"}
            color={"black"}
            fontWeight={"bold"}
          >
            {btnLabel}
          </Button>
        </Flex>
        <Text color={"black"} mb={"1em"} display={{ base: "flex", lg: "none" }}>
          {description}
        </Text>
        <Box bgColor={"black"} h={"1px"} />
      </Box>
    </>
  );
}
