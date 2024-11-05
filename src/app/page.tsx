import TopBanner from "@/components/top-banner/TopBanner";
import Nav from "../components/nav/Nav";
import Banner from "@/components/banner/Banner";
import { Box } from "@chakra-ui/react";

export default function Home() {
  return (
    <main>
      <Box w={"100dvw"} h={"100dvh"} overflow={"relative"}>
        <Box position={"absolute"} zIndex={1} w={"100%"}>
          <TopBanner></TopBanner>
          <Nav />
        </Box>

        <Banner></Banner>
      </Box>

      {/* <div id="bottom-banner"></div>
      <div id="pics-grid"></div>
      <div id="date-motion"></div>
      <div id="artists"></div>
      <div id="more-info"></div>
      <div id="footer"></div> */}
    </main>
    // <>
    //   <Image
    //     src="/vercel.svg"
    //     alt="Vercel Logo"
    //     width={72}
    //     height={16}
    //     priority
    //   />
    // </>
  );
}
