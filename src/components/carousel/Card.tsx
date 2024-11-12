"use client";

import { Button } from "@chakra-ui/react/button";
import Styles from "./Card.module.css";
import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import Image from "next/image";
import { HeroPattern } from "@/app/ui/patterns";
// import Button from "./Button";

export default function Card({ imgSrc }: any) {
  const [show, setShown] = useState(false);

  const props3 = useSpring({
    transform: show ? "scale(1.03)" : "scale(1)",
    boxShadow: show
      ? "0 20px 25px rgb(0 0 0 / 25%)"
      : "0 2px 10px rgb(0 0 0 / 8%)",
    // backgroundColor: `red`,
    backgroundImage: `url("${new HeroPattern("#ff0000", 1).getPattern()}")`,
  });
  return (
    <animated.div
      className={Styles.card}
      style={props3}
      onMouseEnter={() => setShown(true)}
      onMouseLeave={() => setShown(false)}
    >
      <Image width={300} height={300} src={imgSrc} alt="" />
      {/* <h2>Title</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
        nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
        volutpat.
      </p>
      <div className={Styles.btnn}>
        <Button />
        <Button />
      </div> */}
    </animated.div>
  );
}
