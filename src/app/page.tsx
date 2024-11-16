import Banner from "@/components/banner/Banner";
import { Box, Flex } from "@chakra-ui/react";
import BottomBanner from "@/components/bottom-banner/BottomBanner";
import TopBanner from "@/components/top-banner/TopBanner";
import Nav from "@/components/nav/Nav";
import Logo from "@/components/logo/Logo";
// import { Gallery } from "@/components/gallery/Gallery";
import { Iframe } from "@/components/iframe/Iframe";
import Carroussel from "@/components/carousel/Carousel";
import MiniBanner from "@/components/mini-banner/MiniBanner";
import PressInfo from "@/components/press-info/PressInfo";

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

        <MiniBanner bgColor="lightgray" />

        <Carroussel />

        <BottomBanner rows={[{ direction: "left" }]} />

        <Iframe />

        <PressInfo />

        <MiniBanner bgColor="#eee" />

        {/* <Flex justifyContent={"center"} py={"2em"}>
          <Logo w="80%" color="#222" />
        </Flex> */}
      </main>
    </>
  );
}
