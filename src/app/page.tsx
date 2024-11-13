import Banner from "@/components/banner/Banner";
import { Box, Flex } from "@chakra-ui/react";
import BottomBanner from "@/components/bottom-banner/BottomBanner";
import TopBanner from "@/components/top-banner/TopBanner";
import Nav from "@/components/nav/Nav";
import Logo from "@/components/logo/Logo";
// import { Gallery } from "@/components/gallery/Gallery";
import { Iframe } from "@/components/iframe/Iframe";
import CarrousselV2 from "@/components/carousel-v2/Carousel";

export default function Home() {
  return (
    <>
      <main className="">
        <Box h={"100dvh"}>
          <Box position={"absolute"} zIndex={2} w={"100%"}>
            <TopBanner></TopBanner>
            <Nav />
          </Box>

          <Banner></Banner>
        </Box>

        <BottomBanner />

        <Flex justifyContent={"center"} py={"2em"}>
          <Logo w="80%" color="#222" />
        </Flex>

        <Iframe />

        <Flex>
          <CarrousselV2></CarrousselV2>
        </Flex>

        <BottomBanner />

        <div style={{ height: "100dvh" }}></div>

        {/* <div id="bottom-banner"></div>
      <div id="pics-grid"></div>
      <div id="date-motion"></div>
      <div id="artists"></div>
      <div id="more-info"></div>
      <div id="footer"></div> */}
      </main>
    </>
  );
}
