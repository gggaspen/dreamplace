"use client";

import { Box } from "@chakra-ui/react";
import Image from "next/image";

export const Backdrop = () => {
  return (
    <Box>
      <Image
        sizes="10px"
        fill
        priority
        alt="background"
        src="/images/backdrop.png"
        style={{
          objectFit: "cover",
        }}
        loader={({ src }) => {
          return src;
        }}
      />
    </Box>
  );
};
