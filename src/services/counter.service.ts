const API_URL = process.env.NEXT_PUBLIC_API_URL_TOUCH_COUNTER;

if (!API_URL) {
  throw new Error("⚠️ API_URL_TOUCH_COUNTER no está definido");
}

async function postCounter() {
  try {
    const res = await fetch(`${API_URL}/touch`, { method: "POST" });
    if (!res.ok) {
      throw new Error("Error al obtener los eventos");
    }
    const { data } = await res.json();
    return data;
  } catch (error: any) {
    console.error("Error al obtener los eventos:", error);
  }
}

export { postCounter };
