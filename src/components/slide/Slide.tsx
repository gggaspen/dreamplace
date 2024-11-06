"use client";

import { Text, Flex, Box } from "@chakra-ui/react";
import { motion, useTransform } from "framer-motion";
import Arrow from "../arrow/Arrow";

const Slide = ({ left, direction, progress, arrow }: any) => {
  const _direction = direction == "left" ? -1 : 1;

  const translateX = useTransform(
    progress,
    [0, 1],
    [500 * _direction, -500 * _direction]
  );
  return (
    <motion.div
      style={{ x: translateX, left }}
      className="relative flex whitespace-nowrap"
    >
      <Flex h="" alignItems={"center"}>
        <Flex h="" alignItems={"center"}>
          <Text fontSize={"5em"} color={"#000"}>
            PROGRAMA
          </Text>
          <Arrow direction={arrow} h={"50px"} w={"50px"} color="#000" />
          <Text fontSize={"5em"} color={"#000"}>
            PROGRAMA
          </Text>
          <Arrow direction={arrow} h={"50px"} w={"50px"} color="#000" />
          <Text fontSize={"5em"} color={"#000"}>
            PROGRAMA
          </Text>
          <Arrow direction={arrow} h={"50px"} w={"50px"} color="#000" />
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default Slide;
