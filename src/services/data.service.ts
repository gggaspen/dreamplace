import {
  getHeroData,
  getEvents,
  getCarousel,
  getSpotifySection,
  getContactData,
  getArtistSection,
  getFooterSection,
} from "@/services/strapi.service";
import { postCounter } from "./counter.service";

export const fetchAllData = async () => {
  const [
    heroData,
    events,
    carousel,
    spotifySection,
    contactSection,
    artistSection,
    footerSection,
    counter,
  ] = await Promise.all([
    // strapi service
    getHeroData(),
    getEvents(),
    getCarousel(),
    getSpotifySection(),
    getContactData(),
    getArtistSection(),
    getFooterSection(),
    // touch counter service
    postCounter(),
  ]);

  const activeEvent = events?.find((event) => event.active);
  const mainDate = activeEvent ? new Date(activeEvent.date) : new Date();

  return {
    heroData,
    events,
    activeEvent,
    mainDate,
    carousel,
    spotifySection,
    contactSection,
    artistSection,
    footerSection,
    counter,
  };
};
