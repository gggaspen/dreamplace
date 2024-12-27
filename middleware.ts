import { NextResponse } from "next/server";

export function middleware(req: Request) {
  const res = NextResponse.next();

  // Recuperar la IP del cliente desde los encabezados comunes utilizados por proxies
  const clientIp =
    req.headers.get("cf-connecting-ip") || // IP proporcionada por Cloudflare
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || // Primera IP en la lista (la más cercana al cliente)
    req.headers.get("x-real-ip") || // IP directa de algunos proxies
    "unknown";

  // Establecer cabeceras relacionadas con el proxy
  res.headers.set("X-Forwarded-For", clientIp);
  res.headers.set("X-Real-IP", clientIp);

  // Añadir cabeceras de seguridad adicionales
  res.headers.set("X-Frame-Options", "SAMEORIGIN"); // Protección contra clickjacking
  res.headers.set("X-Content-Type-Options", "nosniff"); // Evitar inferencias de tipo MIME
  res.headers.set("X-XSS-Protection", "1; mode=block"); // Protección básica contra XSS
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin"); // Control sobre la cabecera Referer

  // Opcional: Configurar políticas CORS avanzadas (si es necesario para APIs públicas)
  res.headers.set("Access-Control-Allow-Origin", "*"); // Permitir acceso desde cualquier origen
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  ); // Métodos permitidos
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  ); // Cabeceras permitidas

  // Opcional: Cache-Control para proxies
  res.headers.set("Cache-Control", "public, max-age=3600, must-revalidate");

  // Retornar la respuesta con las cabeceras modificadas
  return res;
}
