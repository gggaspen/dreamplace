"use client";

import { Flex } from "@chakra-ui/react";
import "./Nav.css";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import Logo from "@/components/logo/Logo";

export default function Nav({ show_banner }: { show_banner: boolean }) {
  const linkList: string[] = ["Events", "Artists"];
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [prev, setPrev] = useState(0);
  const [desktopSize, setDesktopSize] = useState(152);

  useEffect(() => {
    const updateDesktopSize = () => {
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      setDesktopSize(isDesktop ? 352 : 152);
    };
    updateDesktopSize();
    window.addEventListener("resize", updateDesktopSize);
    return () => window.removeEventListener("resize", updateDesktopSize);
  }, []);

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
        duration: 0.6,
        staggerChildren: 0.05,
      }}
      className={show_banner ? "mt-40-nav" : null}
    >
      <Flex>
        <Logo
          w={desktopSize ? "100px" : "50px"}
          mode={desktopSize ? "full" : "mini"}
        />
      </Flex>

      <Flex gap="8" alignItems={"center"} justifyContent={"space-between"}>
        {linkList.map((item, i) => (
          <motion.div
            key={i}
            variants={childVariants}
            transition={{
              ease: [0.1, 0.25, 0.3, 1],
              duration: 0.6,
            }}
          >
            {/* <Link>{item}</Link> */}
          </motion.div>
        ))}
      </Flex>
    </motion.nav>
  );
}
