import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Provider } from '@/components/ui/provider';
import { QueryProvider } from '@/infrastructure/providers/QueryProvider';
import { DIProvider } from '@/infrastructure/di/DIContext';
import { AuthProvider } from '@/infrastructure/providers/AuthProvider';
import { RoutePreloadManager } from '@/infrastructure/routing/LazyRoutes';
import { poppins } from './ui/fonts';

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
  fallback: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
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
        alt: 'DREAMPLACE Logo'
      }
    ],
    url: 'https://dreamplace.com.ar',
    siteName: 'DREAMPLACE'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DREAMPLACE',
    description: 'DREAMPLACE.COM.AR',
    images: ['https://dreamplace.com.ar/img/logo.png']
  },
  robots: {
    index: true,
    follow: true
  },
  other: {
    // Security and optimization headers
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-XSS-Protection': '1; mode=block',
    'referrer': 'no-referrer-when-downgrade',
    // Cache control headers
    'Cache-Control': 'public, max-age=3600, must-revalidate',
    'Pragma': 'public',
    // Cloudflare caching
    'cf-edge-cache': 'cache,platform=nextjs'
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Font preconnections for performance optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        // className={`${roboto.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
        className={`${poppins.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
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
