import React from "react";
import { Box } from "@chakra-ui/react";
import Banner from "./banner/Banner";
import TopBanner from "./top-banner/TopBanner";
import Nav from "./nav/Nav";
import IEvent from "@/interfaces/event.interface";
import IHeroConfig from "./interfaces/hero-config.interface";
import NavigatorConfig from "./interfaces/navigator-config.interface";

interface HeroProps {
  config: IHeroConfig;
  activeEvent: IEvent;
}

export default function Hero({ config, activeEvent }: HeroProps) {
  const { navigator } = config;
  const nav: NavigatorConfig = { ...navigator };

  return (
    <Box h={"100dvh"}>
      <Box position={"absolute"} zIndex={99} w={"100%"}>
        <TopBanner
          banner_link={nav.banner_link}
          banner_text={nav.banner_text}
        />
        <Nav />
      </Box>

      <Banner config={config} event={activeEvent} />
    </Box>
  );
}
