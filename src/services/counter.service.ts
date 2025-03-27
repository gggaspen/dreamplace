const API_URL = process.env.NEXT_PUBLIC_API_URL_TOUCH_COUNTER;

if (!API_URL) {
  throw new Error("⚠️ API_URL_TOUCH_COUNTER no está definido");
}

export async function postCounter() {
  try {
    const res = await fetch(`${API_URL}/touch`, { method: "POST" });
    if (!res.ok) {
      throw new Error(`❌ Error en POST: ${res.statusText}`);
    }
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Error al enviar el contador:", error);
    throw error;
  }
}

export async function getCounter() {
  try {
    const res = await fetch(`${API_URL}/touch`);
    if (!res.ok) {
      throw new Error(`❌ Error en GET: ${res.statusText}`);
    }
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("❌ Error al obtener el contador:", error);
    throw error;
  }
}
