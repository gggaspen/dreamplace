import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Provider } from '@/components/ui/provider';
import { QueryProvider } from '@/infrastructure/providers/QueryProvider';
import { DIProvider } from '@/infrastructure/di/DIContext';
import { AuthProvider } from '@/infrastructure/providers/AuthProvider';
import { RoutePreloadManager } from '@/infrastructure/routing/LazyRoutes';
import Head from 'next/head';
// import { poppins } from './ui/fonts';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Arial', 'sans-serif'],
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
  fallback: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ],
});

export const metadata: Metadata = {
  title: 'DREAMPLACE',
  description: 'Explora nuestra plataforma de sueños',
  icons: {
    shortcut: '/img/icon/logo.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'DREAMPLACE',
    description: 'Explora nuestra plataforma de sueños',
    images: [
      {
        url: 'https://dreamplace.com.ar/img/logo.png',
        width: 1200,
        height: 630,
        alt: 'DREAMPLACE Logo',
      },
    ],
    url: 'https://dreamplace.com.ar',
    siteName: 'DREAMPLACE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DREAMPLACE',
    description: 'DREAMPLACE.COM.AR',
    images: ['https://dreamplace.com.ar/img/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    // Security and optimization headers
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    referrer: 'no-referrer-when-downgrade',
    // Cache control headers
    'Cache-Control': 'public, max-age=3600, must-revalidate',
    Pragma: 'public',
    // Cloudflare caching
    'cf-edge-cache': 'cache,platform=nextjs',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <Head>
        {/* img */}
        <meta property='og:title' content='DREAMPLACE' />
        {/* <meta property="og:description" content="" /> */}
        <meta property='og:image' content='/img/logo.png' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta property='og:url' content='https://dreamplace.com.ar' />

        {/* no cache */}
        <meta http-equiv='Cache-Control' content='no-cache, no-store, must-revalidate' />
        <meta http-equiv='Pragma' content='no-cache' />
        <meta http-equiv='Expires' content='0' />
        <meta http-equiv='Cache-Control' content='no-cache, mustrevalidate' />
        <meta http-equiv='Last-Modified' content='0' />

        {/* GPT Cloudflare solution: */}

        {/* Seguridad y optimización */}
        <meta http-equiv='X-Content-Type-Options' content='nosniff' />
        <meta http-equiv='X-Frame-Options' content='SAMEORIGIN' />
        <meta http-equiv='X-XSS-Protection' content='1; mode=block' />
        <meta name='referrer' content='no-referrer-when-downgrade' />

        {/* Caching para Cloudflare */}
        <meta http-equiv='Cache-Control' content='public, max-age=3600, must-revalidate' />
        <meta http-equiv='Pragma' content='public' />

        {/* Compatibilidad con proxies */}
        <meta name='cf-edge-cache' content='cache,platform=nextjs' />

        {/* Cabeceras relacionadas con SEO y redes sociales */}
        <meta property='og:type' content='website' />
        <meta property='og:locale' content='en_US' />
        <meta property='og:title' content='DREAMPLACE' />
        <meta property='og:description' content='Explora nuestra plataforma de sueños' />
        <meta property='og:image' content='https://dreamplace.com.ar/img/logo.png' />
        <meta property='og:url' content='https://dreamplace.com.ar' />

        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='DREAMPLACE' />
        <meta name='twitter:description' content='DREAMPLACE.COM.AR' />
        <meta name='twitter:image' content='https://dreamplace.com.ar/img/logo.png' />

        {/* Font preconnections for performance optimization */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
      </Head>
      <body
        // className={`${roboto.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`${geistSans.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DIProvider>
          <QueryProvider>
            <Provider>
              <AuthProvider>
                <RoutePreloadManager />
                {children}
              </AuthProvider>
            </Provider>
          </QueryProvider>
        </DIProvider>
      </body>
    </html>
  );
}
