import React from "react";
import { Box } from "@chakra-ui/react";
import Banner from "./banner/Banner";
import TopBanner from "./top-banner/TopBanner";
import Nav from "./nav/Nav";
import IBannerData from "@/interfaces/banner-data.interface";
import IEvent from "@/interfaces/event.interface";

interface HeroProps {
  bannerData: IBannerData;
  activeEvent: IEvent;
}

export default function Hero({ bannerData, activeEvent }: HeroProps) {
  return (
    <Box h={"100dvh"}>
      <Box position={"absolute"} zIndex={99} w={"100%"}>
        <TopBanner text={bannerData?.textoMiniBannerSuperior} />
        <Nav />
      </Box>

      <Banner event={activeEvent} data={bannerData} />
    </Box>
  );
}
