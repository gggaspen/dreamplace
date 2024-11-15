"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import "./TopBanner.css";
import Link from "next/link";

export default function TopBanner() {
  const url =
    "https://www.passline.com/eventos/sab-3011-agustin-pietrocola-ailen-dc-naza-rv-facukid-ariel-stamile-meline-323995/lean-gorosito";

  // const phrases = [
  //   "BUY TICKETS NOW",
  //   "COMPRA TUS TICKETS AHORA",
  //   "VAGAR MORGULIS",
  //   "AHORA O NEVER",
  // ];

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
    hidden: { opacity: 0, y: "-2rem" },
  };

  return (
    <Link href={url} target="_blank">
      <motion.div
        variants={parentVariants}
        animate={hidden ? "hidden" : "visible"}
        transition={{
          ease: [0.1, 0.25, 0.3, 1],
          duration: 0.6,
          staggerChildren: 0.05,
        }}
        className="text-container"
      >
        <motion.p
          variants={childVariants}
          transition={{
            ease: [0.1, 0.25, 0.3, 1],
            duration: 0.6,
          }}
        >
          BUY TICKETS NOW
        </motion.p>
        {/* <TextScramble phrases={phrases} className="text-white" /> */}
      </motion.div>
    </Link>
  );
}
