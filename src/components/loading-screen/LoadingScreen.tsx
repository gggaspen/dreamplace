"use client";

import React from "react";
import { Box, Flex, ProgressRoot } from "@chakra-ui/react";
import { ProgressBar } from "../ui/progress";
import Logo from "../logo/Logo";

export default function LoadingScreen() {
  return (
    <Box height="100dvh" bg={"#000"}>
      <ProgressRoot w="100%" value={null}>
        <ProgressBar colorPalette="red" h={"4px"} />
      </ProgressRoot>
      <Flex
        height="90%"
        mt={"2rem"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Flex justifyContent={"center"}>
          <Logo mode="mini" w="30%" color="#aaa" enableMotion={true} />
        </Flex>
      </Flex>
    </Box>
  );
}
