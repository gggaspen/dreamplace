"use client";

import { Text, Flex } from "@chakra-ui/react";
import { motion, useTransform } from "framer-motion";
import Arrow from "../arrow/Arrow";
import React from "react";

const dates = [
  { text: "30 NOV 2024" },
  { text: "30 NOV 2024" },
  { text: "30 NOV 2024" },
  { text: "30 NOV 2024" },
  { text: "30 NOV 2024" },
  { text: "30 NOV 2024" },
  { text: "30 NOV 2024" },
];

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
          {dates.map((date, index) => (
            <React.Fragment key={index}>
              <Text
                _hover={{ color: "#fff" }}
                fontWeight={"bold"}
                fontSize={{ base: "2em", lg: "5em" }}
                color={"#000"}
              >
                {date.text}
              </Text>
              <Arrow direction={arrow} h={"50px"} w={"50px"} color="#000" />
            </React.Fragment>
          ))}
        </Flex>
      </Flex>
    </motion.div>
  );
};

export default Slide;
