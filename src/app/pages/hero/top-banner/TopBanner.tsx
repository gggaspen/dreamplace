"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import "./TopBanner.css";
import Link from "next/link";
import MiniBanner from "@/components/mini-banner/MiniBanner";

interface NavigatorProps {
  banner_link: string;
  banner_text: string;
}

export default function TopBanner({
  banner_text,
  banner_link,
}: NavigatorProps) {
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

  const blockAction: boolean = banner_link ? false : true;

  return (
    <Link
      href={banner_link}
      target="_blank"
      onClick={blockAction ? (e) => e.preventDefault() : undefined}
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
            text={banner_text}
            arrowDirection="top-right"
            delay={50}
          ></MiniBanner>
        </motion.div>
        {/* <TextScramble phrases={phrases} className="text-white" /> */}
      </motion.div>
    </Link>
  );
}
