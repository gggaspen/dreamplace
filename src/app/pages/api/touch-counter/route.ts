import { NextResponse } from "next/server";

const API_URL = process.env.API_URL_TOUCH_COUNTER;

export async function GET() {
  if (!API_URL) {
    return NextResponse.json(
      { error: "API_URL_TOUCH_COUNTER no definido" },
      { status: 500 }
    );
  }

  try {
    const res: Response = await fetch(`${API_URL}/touch`);
    const data: any = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener el contador" },
      { status: 500 }
    );
  }
}

export async function POST() {
  if (!API_URL) {
    return NextResponse.json(
      { error: "API_URL_TOUCH_COUNTER no definido" },
      { status: 500 }
    );
  }

  try {
    const res: Response = await fetch(`${API_URL}/touch`, { method: "POST" });
    const data: any = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error al enviar el contador" },
      { status: 500 }
    );
  }
}
