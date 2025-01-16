"use client";

import React from "react";
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
import { getBannerData, getEvents } from "@/services/strapi.service";
import { useEffect, useState } from "react";
import IEvent from "@/interfaces/event.interface";
import IBannerData from "@/interfaces/banner-data.interface";

export default function Home() {
  const [events, setEvents] = useState<IEvent[]>(null);
  const [activeEvent, setActiveEvent] = useState<IEvent>(null);
  const [mainDate, setMainDate] = useState<Date>(new Date());

  const [bannerData, setBannerData] = useState<IBannerData>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const events: IEvent[] = await getEvents();
        const portada: IBannerData = await getBannerData();

        const activeEvent: IEvent = events?.find((event) => event.active);
        setEvents(events);
        setActiveEvent(activeEvent);
        setMainDate(new Date(activeEvent.date));
        console.log(mainDate);

        setBannerData(portada);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (bannerData) {
      console.log("BannerData actualizado:", bannerData);
    }
  }, [bannerData]);

  if (!events) return <React.Fragment>Loading...</React.Fragment>;

  return (
    <>
      <main className="">
        <Box h={"100dvh"}>
          <Box position={"absolute"} zIndex={99} w={"100%"}>
            <TopBanner></TopBanner>
            <Nav />
          </Box>

          <Banner event={activeEvent} data={bannerData}></Banner>
        </Box>

        <MiniBanner text="PRODUCCIONES" bgColor="#eee" />

        <Carroussel />

        <BottomBanner rows={[{ direction: "left" }]} />

        <Iframe />

        <Contact />

        <MiniBanner text="NUESTROS ARTISTAS" bgColor="#eee" />

        <Press />

        <Footer />
      </main>
    </>
  );
}
