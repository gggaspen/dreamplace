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
import {
  getBannerData,
  getCarousel,
  getContactData,
  getEvents,
  getSpotifySection,
} from "@/services/strapi.service";
import { useEffect, useState } from "react";
import IEvent from "@/interfaces/event.interface";
import IBannerData from "@/interfaces/banner-data.interface";
import { dateToCustomString } from "@/utils/format-date";

export default function Home() {
  const [events, setEvents] = useState<IEvent[]>(null);
  const [activeEvent, setActiveEvent] = useState<IEvent>(null);
  const [mainDate, setMainDate] = useState<Date>(new Date());

  const [bannerData, setBannerData] = useState<IBannerData>(null);

  const [carousel, setCarousel] = useState<any>(null);

  const [spotifySection, setSpotifySection] = useState<any>({});

  const [contactSection, setContactSection] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        /**
         * EVENTS
         */
        const events: IEvent[] = await getEvents();
        const activeEvent: IEvent = events?.find((event) => event.active);
        const portada: IBannerData = await getBannerData();
        const _carousel: any = await getCarousel();
        const _spotifySection: any = await getSpotifySection();
        const _contactSection: any = await getContactData();

        setEvents(events);
        setActiveEvent(activeEvent);
        setMainDate(new Date(activeEvent.date));
        /**
         * POSTADA
         */
        setBannerData(portada);
        /**
         * CAROUSEL
         */
        setCarousel(_carousel);
        /**
         * SPOTIFY SECTION
         */
        setSpotifySection(_spotifySection);
        /**
         * CONTACT SECTION
         */
        setContactSection(_contactSection);
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

  useEffect(() => {
    if (spotifySection) {
      console.log("SpotifySection actualizado:", spotifySection);
    }
  }, [spotifySection]);

  useEffect(() => {
    if (contactSection) {
      console.log("contactSection actualizado:", contactSection);
    }
  }, [contactSection]);

  if (!events) return <React.Fragment>Loading...</React.Fragment>;

  return (
    <>
      <main className="">
        <Box h={"100dvh"}>
          <Box position={"absolute"} zIndex={99} w={"100%"}>
            <TopBanner text={bannerData?.textoMiniBannerSuperior}></TopBanner>
            <Nav />
          </Box>

          <Banner event={activeEvent} data={bannerData}></Banner>
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

        <MiniBanner text="NUESTROS ARTISTAS" bgColor="#eee" />

        <Press
        // srcUrlDesktop={{
        //   formats: { url: "https://i.postimg.cc/fWtDqKQB/Banner-Prensa.png" },
        // }}
        // srcUrlMobile={{
        //   formats: { url: "https://i.postimg.cc/fWtDqKQB/Banner-Prensa.png" },
        // }}
        />

        <Footer />
      </main>
    </>
  );
}
