import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: {
    template: '%s | Peter Pan Boca',
    default: 'Peter Pan Boca',
  },
  description: 'Capturing the magic of Peter Pan events in Boca Raton. Browse our photo galleries from enchanting galas, pirate adventures, and fairy festivals.',
  keywords: ['Peter Pan', 'Boca Raton', 'photo gallery', 'events', 'family', 'entertainment', 'Neverland'],
  authors: [{ name: 'Peter Pan Boca Team' }],
  openGraph: {
    title: 'Peter Pan Boca',
    description: 'Capturing the magic of Peter Pan events in Boca Raton',
    url: 'https://peter-pan-boca.vercel.app',
    siteName: 'Peter Pan Boca',
    type: 'website',
    images: [
      {
        url: 'https://via.placeholder.com/1200x630/1e40af/ffffff?text=Peter+Pan+Boca',
        width: 1200,
        height: 630,
        alt: 'Peter Pan Boca',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peter Pan Boca',
    description: 'Capturing the magic of Peter Pan events in Boca Raton',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&family=Pirata+One&family=Fredoka+One:wght@400&family=Cinzel+Decorative:wght@400;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader />
        <main style={{ flexGrow: 1 }}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}