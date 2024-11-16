import { Box, Text, Flex, Button } from "@chakra-ui/react";
import Arrow from "../arrow/Arrow";
import React from "react";
import Logo from "../logo/Logo";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const description =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.";
  const btnLabel = "Comprar Tickets";

  return (
    <>
      <Flex
        flexDirection={"column"}
        justifyContent={"space-between"}
        h={"70dvh"}
        bg={"black"}
        py={"1em"}
        px={"4em"}
      >
        <Box h={""} borderBottom={"1px solid #eee"} mb={"2em"} />

        <Flex
          color={"white"}
          w={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={"2em"}
        >
          <Text fontWeight={"bold"} fontSize={"1em"} my={"2em"}>
            2024 EDITION
          </Text>
          {/* <Text fontWeight={"bold"} fontSize={".5em"} mb={"3em"}>
            @dreamplace.ar
          </Text> */}
          {/* <Box>
            <Text fontWeight={"bold"} fontSize={".5em"} mb={"3em"}>
              2024 EDITION
            </Text>
            <Text fontSize={".8em"} mb={"1em"}>Lorem ipsum dolor sit amet.</Text>
            <Text fontSize={".8em"} mb={"1em"}>Lorem ipsum dolor sit amet.</Text>
            <Text fontSize={".8em"} mb={"1em"}>Lorem ipsum dolor sit amet.</Text>
            <Text fontSize={".8em"} mb={"1em"}>Lorem ipsum dolor sit amet.</Text>
          </Box>
          <Box>
            <Text fontWeight={"bold"} fontSize={".5em"} mb={"3em"}>
              JOIN DREAMPLACE
            </Text>
            <Text fontSize={".8em"} mb={"1em"}>Lorem ipsum dolor sit amet.</Text>
            <Text fontSize={".8em"} mb={"1em"}>Lorem ipsum dolor sit amet.</Text>
            <Text fontSize={".8em"} mb={"1em"}>Lorem ipsum dolor sit amet.</Text>
            <Text fontSize={".8em"} mb={"1em"}>Lorem ipsum dolor sit amet.</Text>
          </Box> */}
        </Flex>

        <Flex justifyContent={"center"} py={"2em"}>
          <Logo w="80%" color="#222" />
        </Flex>

        <Flex justifyContent={"center"} py={"2em"}>
          <Link
            className="flex gap-4 items-center"
            href="https://www.instagram.com/dreamplace.ar/"
            target="_blank"
          >
            <Image
              src="https://i.postimg.cc/0NM8hg7n/ig.png"
              width={30}
              height={30}
              alt="Instagram icon"
            />
            <Text>@dreamplace.ar</Text>
          </Link>
        </Flex>
      </Flex>
    </>
  );
}
