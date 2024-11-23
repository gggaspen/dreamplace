import Banner from "@/components/banner/Banner";
import { Box } from "@chakra-ui/react";
import BottomBanner from "@/components/bottom-banner/BottomBanner";
import TopBanner from "@/components/top-banner/TopBanner";
import Nav from "@/components/nav/Nav";
import { Iframe } from "@/components/iframe/Iframe";
import Carroussel from "@/components/carousel/Carousel";
import MiniBanner from "@/components/mini-banner/MiniBanner";
import Contact from "@/components/contact/Contact";
import Press from "@/components/press/Press";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <Box pos={"relative"}>
        <Box h={"100dvh"}>
          <Box position={"absolute"} zIndex={2} w={"100%"}>
            <TopBanner></TopBanner>
            <Nav />
          </Box>

          <Banner bgSourceUrl="/img/banner-1.png"></Banner>
        </Box>

        <Carroussel />

        <Box pos={"relative"} zIndex={1}>
          <BottomBanner rows={[{ direction: "left" }]} />
        </Box>

        <Iframe />

        <Contact />

        <MiniBanner text="NUESTROS ARTISTAS" bgColor="#eee" />

        <Press />
        {/* <Box zIndex={2}>
          <Banner
            forPress={true}
            bgSourceUrl="https://i.postimg.cc/fWtDqKQB/Banner-Prensa.png"
          ></Banner>
        </Box> */}

        <Footer />
      </Box>
    </>
  );
}
