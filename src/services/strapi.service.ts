import { API_URL } from "@/app/config";

/**
 *
 * @returns ALL EVENTS
 */
async function getEvents() {
  const res = await fetch(
    `${API_URL}/api/events?fields[0]=name&fields[1]=location&fields[2]=description&fields[3]=date&fields[4]=active&fields[5]=ticket_link&populate[cover_mobile][fields][1]=formats&populate[cover_desktop][fields][1]=formats`
  );
  if (!res.ok) {
    throw new Error("Error al obtener los eventos");
  }
  const { data } = await res.json();
  return data;
}

/**
 *
 * @returns SECTIONS
 */
async function getHeroData() {
  const res = await fetch(
    `${API_URL}/api/hero-sections?fields[1]=title&fields[2]=subtitle&fields[3]=paragraph&populate[navigator][fields]=*&populate[button][fields]=*&populate[cover_mobile][fields][0]=formats&populate[cover_desktop][fields][0]=formats`
  );
  if (!res.ok) {
    throw new Error("Error al obtener los eventos");
  }
  const { data } = await res.json();
  return data[0];
}

async function getCarousel() {
  const res = await fetch(
    `${API_URL}/api/carousels?fields[0]=banner_text&&populate[fotos][fields][1]=formats`
  );
  if (!res.ok) {
    throw new Error("Error al obtener la data del carousel");
  }
  const { data } = await res.json();
  return data[0];
}

async function getSpotifySection() {
  const res = await fetch(
    `${API_URL}/api/spotify-sections?&fields[0]=titulo&fields[1]=embed_url&fields[2]=link_url`
  );
  if (!res.ok) {
    throw new Error("Error al obtener la data de la sección de Spotify");
  }
  const { data } = await res.json();
  return data[0];
}

async function getContactData() {
  const res = await fetch(
    `${API_URL}/api/contact-sections?fields[0]=titulo&fields[1]=texto_boton&fields[2]=numero_telefono&fields[3]=mensaje_default`
  );
  if (!res.ok) {
    throw new Error("Error al obtener la data de la sección de Spotify");
  }
  const { data } = await res.json();
  return data[0];
}

async function getArtistSection() {
  const res = await fetch(
    `${API_URL}/api/artist-sections?fields[0]=name&fields[1]=labels&fields[2]=links&fields[3]=text_button&fields[4]=link_button&populate[photo][fields][0]=formats`
  );
  if (!res.ok) {
    throw new Error("Error al obtener la data de la sección de Spotify");
  }
  const { data } = await res.json();
  return data;
}

async function getFooterSection() {
  const res = await fetch(
    `${API_URL}/api/footer-sections?fields[0]=youtube_url&fields[1]=youtube_title`
  );
  if (!res.ok) {
    throw new Error("Error al obtener la data de la sección de Spotify");
  }
  const { data } = await res.json();
  return data[0];
}

export {
  getHeroData,
  getEvents,
  getCarousel,
  getSpotifySection,
  getContactData,
  getArtistSection,
  getFooterSection,
};
