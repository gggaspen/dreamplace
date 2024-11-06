import Banner from "@/components/banner/Banner";
import { Box } from "@chakra-ui/react";
import BottomBanner from "@/components/bottom-banner/BottomBanner";
import TopBanner from "@/components/top-banner/TopBanner";
import Nav from "@/components/nav/Nav";

export default function Home() {
  return (
    <>
      <main>
        <Box w={"100dvw"} h={"100dvh"}>
          <Box position={"absolute"} zIndex={2} w={"100%"}>
            <TopBanner></TopBanner>
            <Nav />
          </Box>

          <Banner></Banner>
        </Box>

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
