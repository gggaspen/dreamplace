import {
  getEvents,
  getBannerData,
  getCarousel,
  getSpotifySection,
  getContactData,
  getArtistSection,
  getFooterSection,
} from "@/services/strapi.service";

export const fetchAllData = async () => {
  const [
    events,
    bannerData,
    carousel,
    spotifySection,
    contactSection,
    artistSection,
    footerSection,
  ] = await Promise.all([
    getEvents(),
    getBannerData(),
    getCarousel(),
    getSpotifySection(),
    getContactData(),
    getArtistSection(),
    getFooterSection(),
  ]);

  const activeEvent = events?.find((event) => event.active);
  const mainDate = activeEvent ? new Date(activeEvent.date) : new Date();

  return {
    events,
    activeEvent,
    mainDate,
    bannerData,
    carousel,
    spotifySection,
    contactSection,
    artistSection,
    footerSection,
  };
};
