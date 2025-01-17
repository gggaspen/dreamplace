"use client";

import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import Banner from "@/components/banner/Banner";
import BottomBanner from "@/components/bottom-banner/BottomBanner";
import TopBanner from "@/components/top-banner/TopBanner";
import Nav from "@/components/nav/Nav";
import { Iframe } from "@/components/iframe/Iframe";
import Carroussel from "@/components/carousel/Carousel";
import MiniBanner from "@/components/mini-banner/MiniBanner";
import Contact from "@/components/contact/Contact";
import Press from "@/components/press/Press";
import Footer from "@/components/footer/Footer";
import { fetchAllData } from "@/services/data.service"; // Centralizamos las llamadas a servicios
import { dateToCustomString } from "@/utils/format-date";
import LoadingScreen from "@/components/loading-screen/LoadingScreen";

export default function Home() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllData();
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <LoadingScreen />;
  }

  const {
    // events,
    activeEvent,
    mainDate,
    bannerData,
    carousel,
    spotifySection,
    contactSection,
    artistSection,
  } = data;

  return (
    <>
      <main>
        <Box h={"100dvh"}>
          <Box position={"absolute"} zIndex={99} w={"100%"}>
            <TopBanner text={bannerData?.textoMiniBannerSuperior} />
            <Nav />
          </Box>

          <Banner event={activeEvent} data={bannerData} />
        </Box>

        <MiniBanner text={carousel?.banner_text} bgColor="#eee" />

        <Carroussel fotos={carousel?.fotos} />

        <BottomBanner
          text={dateToCustomString(mainDate)}
          rows={[{ direction: "left" }]}
        />

        <Iframe
          config={spotifySection}
          bannerDate={dateToCustomString(mainDate)}
        />

        <Contact config={contactSection} />

        <MiniBanner text={bannerData.text_artists_banner} bgColor="#eee" />

        <Press config={artistSection} />

        <Footer />
      </main>
    </>
  );
}
