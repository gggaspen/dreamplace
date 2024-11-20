import { Box, Text, Flex } from "@chakra-ui/react";
import React from "react";
import Logo from "../logo/Logo";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const description =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet consectetur adipisicing elit.";
  const btnLabel = "Comprar Tickets";
  console.log(description, btnLabel);

  return (
    <>
      <Flex
        flexDirection={"column"}
        justifyContent={"space-between"}
        h={"100dvh"}
        bg={"#000"}
        py={"1em"}
        px={"4em"}
      >
        <Box h={""} borderBottom={"1px solid #eee"} mb={"2em"} />

        <Flex
          color={"white"}
          w={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          flexDirection={"column"}
          gap={"2em"}
        >
          <Text fontWeight={"bold"} fontSize={"1em"} my={"2em"}>
            2024 EDITION
          </Text>

          <Link href="https://www.instagram.com/dreamplace.ar/" target="_blank">
            <Text>@dreamplace.ar</Text>
          </Link>

          <Link href="https://www.instagram.com/dreamplace.ar/" target="_blank">
            <Image
              src="https://i.postimg.cc/0NM8hg7n/ig.png"
              width={30}
              height={30}
              alt="Instagram icon"
            />
          </Link>
        </Flex>

        <Flex justifyContent={"center"} mb={"4em"}>
          <Logo w="100%" color="rgb(8, 8, 8)" />
        </Flex>
      </Flex>
    </>
  );
}
