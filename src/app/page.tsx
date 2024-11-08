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

        <Flex justifyContent={"center"} alignItems={"center"} p={"2em"}>
          <Carousel
            cards={[
              {
                key: uuidv4(),
                content: (
                  <Card imagen="https://updates.theme-fusion.com/wp-content/uploads/2017/12/convertplus_thumbnail.jpg" />
                ),
              },
              {
                key: uuidv4(),
                content: (
                  <Card imagen="https://updates.theme-fusion.com/wp-content/uploads/2017/12/acf_pro.png" />
                ),
              },
              {
                key: uuidv4(),
                content: (
                  <Card imagen="https://updates.theme-fusion.com/wp-content/uploads/2017/12/layer_slider_plugin_thumb.png" />
                ),
              },
              {
                key: uuidv4(),
                content: (
                  <Card imagen="https://updates.theme-fusion.com/wp-content/uploads/2016/08/slider_revolution-1.png" />
                ),
              },
              {
                key: uuidv4(),
                content: (
                  <Card imagen="https://updates.theme-fusion.com/wp-content/uploads/2019/01/pwa_880_660.jpg" />
                ),
              },
            ]}
            height="500px"
            width="30%"
            margin="0 auto"
            offset={2}
            showArrows={false}
          />
        </Flex>

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
