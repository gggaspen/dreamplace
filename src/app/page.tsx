"use client";

import React, { useEffect, useState } from "react";
import { Resident } from "@/app/pages/resident/Resident";
import Carousel from "@/app/pages/carousel/Carousel";
import Contact from "@/app/pages/contact/Contact";
import Press from "@/app/pages/press/Press";
import Footer from "@/app/pages/footer/Footer";
import { fetchAllData } from "@/services/data.service";
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
    heroData,
    activeEvent,
    carousel,
    spotifySection,
    contactSection,
    artistSection,
  } = data;

  return (
    <>
      <main className="pulse-motion">
        <Hero config={heroData} activeEvent={activeEvent} />

        <Carousel fotos={carousel?.fotos} banner_text={carousel?.banner_text} />

        <Resident config={spotifySection} />

        <Contact config={contactSection} />

        <Press config={artistSection} />

        <Footer />
      </main>
    </>
  );
}
