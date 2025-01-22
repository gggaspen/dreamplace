"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import "./TopBanner.css";
import Link from "next/link";
import MiniBanner from "../mini-banner/MiniBanner";

export default function TopBanner() {
  const url =
    // "https://www.passline.com/eventos/sab-3011-agustin-pietrocola-ailen-dc-naza-rv-facukid-ariel-stamile-meline-323995/lean-gorosito";
    "https://www.todopass.com.ar/inicio/355-fiesta-de-noel-xv.html";

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

  const soon: boolean = true;

  return (
    <Link
      href={url}
      target="_blank"
      onClick={soon ? (e) => e.preventDefault() : undefined}
    >
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
        <motion.div
          variants={childVariants}
          transition={{
            ease: [0.1, 0.25, 0.3, 1],
            duration: 1.2,
          }}
        >
          <MiniBanner
            text={
              soon
                ? "PRÓXIMAMENTE TICKETS A LA VENTA"
                : "COMPRA TUS TICKETS AHORA"
            }
            arrowDirection="top-right"
            delay={50}
          ></MiniBanner>
        </motion.div>
        {/* <TextScramble phrases={phrases} className="text-white" /> */}
      </motion.div>
    </Link>
  );
}
