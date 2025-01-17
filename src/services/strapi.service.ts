import { API_URL } from "@/app/config";
// import { QUERY_GET_ALL_EVENTS } from "./graphql";

async function getEvents() {
  // const res = await fetch(`${API_URL}/api/events`);
  const res = await fetch(
    `${API_URL}/api/events?fields[0]=name&fields[1]=location&fields[2]=description&fields[3]=date&fields[4]=active&fields[5]=ticket_link&populate[cover_mobile][fields][1]=formats&populate[cover_desktop][fields][1]=formats`
  );
  // const res = await fetch(`${API_URL}/api/events?populate=*`);
  if (!res.ok) {
    throw new Error("Error al obtener los eventos");
  }
  const { data } = await res.json();
  return data;
}

async function getBannerData() {
  const res = await fetch(
    `${API_URL}/api/portadas?fields[0]=textoBotonPrincipal&fields[1]=textoMiniBannerSuperior`
  );
  if (!res.ok) {
    throw new Error("Error al obtener la data del banner principal");
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

export {
  getEvents,
  getBannerData,
  getCarousel,
  getSpotifySection,
  getContactData,
};
