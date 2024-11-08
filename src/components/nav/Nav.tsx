"use client";

import { Flex, Link } from "@chakra-ui/react";
import "./Nav.css";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import Logo from "../logo/Logo";

export default function Nav() {
  const linkList: string[] = ["Events", "Artists"];
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [prev, setPrev] = useState(0);

  function update(latest: number, prev: number): void {
    if (latest < prev) {
      setHidden(false);
    } else if (latest > 100 && latest > prev) {
      setHidden(true);
    }
  }

  useMotionValueEvent(scrollY, "change", (latest: number) => {
    update(latest, prev);
    setPrev(latest);
  });

  const parentVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: "-4rem" },
  };

  const childVariants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: "0rem" },
  };

  return (
    <motion.nav
      variants={parentVariants}
      animate={hidden ? "hidden" : "visible"}
      transition={{
        ease: [0.1, 0.25, 0.3, 1],
        duration: 1,
        staggerChildren: 0.05,
      }}
    >
      <Flex>
        <Logo w="100px" />
      </Flex>

      <Flex gap="8" alignItems={"center"} justifyContent={"space-between"}>
        {linkList.map((item, i) => (
          <motion.div
            key={i}
            variants={childVariants}
            transition={{
              ease: [0.1, 0.25, 0.3, 1],
              duration: 0.4,
            }}
          >
            <Link>{item}</Link>
          </motion.div>
        ))}
      </Flex>
    </motion.nav>
  );
}
