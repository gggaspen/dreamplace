import Banner from "@/components/banner/Banner";
import { Box, Flex } from "@chakra-ui/react";
import BottomBanner from "@/components/bottom-banner/BottomBanner";
import TopBanner from "@/components/top-banner/TopBanner";
import Nav from "@/components/nav/Nav";
import Logo from "@/components/logo/Logo";
// import { Gallery } from "@/components/gallery/Gallery";
import { Iframe } from "@/components/iframe/Iframe";
import Carousel from "@/components/carousel/Carousel";
import { v4 as uuidv4 } from "uuid";
import Card from "@/components/carousel/Card";
import CarrousselV2 from "@/components/carousel-v2/Carousel";

export default function Home() {
  return (
    <>
      <main className="poppins-medium">
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

        <Flex
          // justifyContent={"center"}
          // alignItems={"center"}
          // py={"3em"}
          // mt={"2em"}
        >
          <CarrousselV2></CarrousselV2>
        </Flex>
        {/* <Flex justifyContent={"center"} alignItems={"center"} py={"3em"} mt={"2em"}>
          <Carousel
            cards={[
              {
                key: uuidv4(),
                content: (
                  <Card imgSrc="https://i.postimg.cc/2SFKfTPn/Runa-4.jpg" />
                ),
              },
              {
                key: uuidv4(),
                content: (
                  <Card imgSrc="https://i.postimg.cc/7PT33YMf/AGUS4.jpg" />
                ),
              },
              {
                key: uuidv4(),
                content: (
                  <Card imgSrc="https://i.postimg.cc/NFTRBpf1/DSC-2471.jpg" />
                ),
              },
              {
                key: uuidv4(),
                content: <Card imgSrc="https://i.postimg.cc/4NkzBkBw/UY.jpg" />,
              },
            ]}
            height="60dvh"
            width="60%"
            // margin="0 auto"
            offset={2}
            // px={"2em"}
            showArrows={false}
          />
        </Flex> */}

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
