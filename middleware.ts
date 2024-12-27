import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const res = NextResponse.next();

  // Añadir cabeceras proxy
  res.headers.set(
    "X-Forwarded-For",
    req.headers.get("x-forwarded-for") || "unknown"
  );
  res.headers.set("X-Real-IP", req.headers.get("x-real-ip") || "unknown");

  return res;
}
