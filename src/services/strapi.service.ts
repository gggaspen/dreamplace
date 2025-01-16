import { API_URL } from "@/app/config";
// import { QUERY_GET_ALL_EVENTS } from "./graphql";

async function getEvents() {
  // const res = await fetch(`${API_URL}/api/events`);
  const res = await fetch(
    `${API_URL}/api/events?fields[0]=name&fields[1]=location&fields[2]=description&fields[3]=date&fields[4]=active&populate[cover_mobile][fields][1]=formats&populate[cover_desktop][fields][1]=formats`
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
    `${API_URL}/api/portadas?fields[0]=textoBotonPrincipal&fields[1]=linkBotonPrincipal`
  );
  if (!res.ok) {
    throw new Error("Error al obtener la data del banner principal");
  }
  const { data } = await res.json();
  return data[0];
}

export { getEvents, getBannerData };
