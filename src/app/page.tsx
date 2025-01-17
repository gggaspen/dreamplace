"use client";

import React, { useEffect, useState } from "react";
import BottomBanner from "@/components/bottom-banner/BottomBanner";
import { Resident } from "@/app/pages/resident/Resident";
import Carroussel from "@/app/pages/carousel/Carousel";
// import MiniBanner from "@/components/mini-banner/MiniBanner";
import Contact from "@/app/pages/contact/Contact";
import Press from "@/app/pages/press/Press";
import Footer from "@/app/pages/footer/Footer";
import { fetchAllData } from "@/services/data.service"; // Centralizamos las llamadas a servicios
import { dateToCustomString } from "@/utils/format-date";
import LoadingScreen from "@/components/loading-screen/LoadingScreen";
import Hero from "./pages/hero/Hero";
import "./css/motions.css";

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
      {/* <div className="pulse-motion"></div> */}
      <main className="pulse-motion">
        <Hero bannerData={bannerData} activeEvent={activeEvent} />

        <Carroussel
          fotos={carousel?.fotos}
          banner_text={carousel?.banner_text}
        />

        <BottomBanner
          text={dateToCustomString(mainDate)}
          rows={[{ direction: "left" }]}
        />

        <Resident
          config={spotifySection}
          bannerDate={dateToCustomString(mainDate)}
        />

        <Contact config={contactSection} />

        <Press
          config={artistSection}
          text_artists_banner={bannerData.text_artists_banner}
        />

        <Footer />
      </main>
    </>
  );
}
