import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Provider } from "@/components/ui/provider";
import { poppins } from "./ui/fonts";
import Head from "next/head";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "DREAMPLACE",
  icons: {
    shortcut: "/img/icon/logo.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* img */}
        <meta property="og:title" content="DREAMPLACE" />
        {/* <meta property="og:description" content="" /> */}
        <meta property="og:image" content="/img/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://dreamplace.com.ar" />

        {/* no cache */}
        <meta
          http-equiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta http-equiv="Pragma" content="no-cache" />
        <meta http-equiv="Expires" content="0" />
        <meta http-equiv="Cache-Control" content="no-cache, mustrevalidate" />
        <meta http-equiv="Last-Modified" content="0" />

        {/* GPT Cloudflare solution: */}

        {/* Seguridad y optimización */}
        <meta http-equiv="X-Content-Type-Options" content="nosniff" />
        <meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
        <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="no-referrer-when-downgrade" />

        {/* Caching para Cloudflare */}
        <meta
          http-equiv="Cache-Control"
          content="public, max-age=3600, must-revalidate"
        />
        <meta http-equiv="Pragma" content="public" />

        {/* Compatibilidad con proxies */}
        <meta name="cf-edge-cache" content="cache,platform=nextjs" />

        {/* Cabeceras relacionadas con SEO y redes sociales */}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="DREAMPLACE" />
        <meta
          property="og:description"
          content="Explora nuestra plataforma de sueños"
        />
        <meta
          property="og:image"
          content="https://dreamplace.com.ar/img/logo.png"
        />
        <meta property="og:url" content="https://dreamplace.com.ar" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="DREAMPLACE" />
        <meta name="twitter:description" content="DREAMPLACE.COM.AR" />
        <meta
          name="twitter:image"
          content="https://dreamplace.com.ar/img/logo.png"
        />
      </Head>
      <body
        // className={`${roboto.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`${poppins.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
