import Banner from "@/components/banner/Banner";
import { Box, Flex } from "@chakra-ui/react";
import BottomBanner from "@/components/bottom-banner/BottomBanner";
import TopBanner from "@/components/top-banner/TopBanner";
import Nav from "@/components/nav/Nav";
import Logo from "@/components/logo/Logo";
// import { Gallery } from "@/components/gallery/Gallery";
import { Iframe } from "@/components/iframe/Iframe";
import Carroussel from "@/components/carousel/Carousel";
import Footer from "@/components/footer/Footer";

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

        <Box minH={{ base: "25dvh", lg: "30dvh" }}>
          <BottomBanner />
        </Box>

        <Flex justifyContent={"center"} py={"2em"}>
          <Logo w="80%" color="#222" />
        </Flex>

        <Iframe />

        <Flex>
          <Carroussel />
        </Flex>

        <BottomBanner />

        <Footer />

        {/* 
      <div id="artists"></div>
      <div id="more-info"></div>
      <div id="footer"></div> */}
      </main>
    </>
  );
}
