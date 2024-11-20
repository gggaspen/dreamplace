import { Box, Text, Flex, Button, Link } from "@chakra-ui/react";
import React from "react";
import "./PressInfo.css";

export default function PressInfo() {
  const description =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.";
  const btnLabel = "Comprar Tickets";

  return (
    <>
      <Box bg={"black"} py={"1em"} px={"4em"}>
        <Text fontSize={{ base: "2em", md: "3em" }} py={".5em"} color={"#eee"}>
          Attend ADE
        </Text>
        <Flex gap={"2em"} h={"50%"} pb={"1.5em"}>
          <Text
            fontWeight={"bold"}
            fontSize={{ base: "1em", md: "2em" }}
            flex={1}
            color={"#eee"}
          >
            ADE Pro <br /> Pass
          </Text>
          <Flex
            display={{ base: "none", lg: "flex" }}
            alignItems={"flex-end"}
            flex={2}
          >
            <Text color={"#eee"}>{description}</Text>
          </Flex>
          <Button
            bgColor={"yellow"}
            borderRadius={"0"}
            p={"1em"}
            py={"1.5em"}
            color={"#eee"}
            fontWeight={"bold"}
            fontSize={"1em"}
            className="btn-buy"
          >
            <Link
              href="https://www.passline.com/eventos/sab-3011-agustin-pietrocola-ailen-dc-naza-rv-facukid-ariel-stamile-meline-323995/lean-gorosito"
              target="_blank"
            >
              {btnLabel}
            </Link>
          </Button>
        </Flex>
        <Text
          color={"#eee"}
          mb={"1em"}
          display={{ base: "flex", lg: "none" }}
          fontSize={{ base: ".5em", md: "1em" }}
        >
          {description}
        </Text>
        <Box bgColor={"#eee"} h={"1px"} />
      </Box>
    </>
  );
}
