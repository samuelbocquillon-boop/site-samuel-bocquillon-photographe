import './globals.css';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CookieBanner } from '@/components/CookieBanner';
import { getSettings } from '@/lib/api';
import { SITE_URL, CITIES } from '@/lib/content';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Samuel Bocquillon — Photographe de mariage à Valenciennes, Nord',
    template: '%s — Samuel Bocquillon, Photographe de mariage',
  },
  description:
    "Samuel Bocquillon, photographe de mariage à Valenciennes (Nord). Des histoires vraies, sans filtre — reportages authentiques à Lille, Douai, Cambrai et partout en France.",
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Samuel Bocquillon — Photographe de mariage',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: { canonical: '/' },
};

function localBusinessJsonLd(settings) {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'Photographer'],
    '@id': `${SITE_URL}/#business`,
    name: settings.business_name,
    image: `${SITE_URL}/opengraph-image.jpg`,
    url: SITE_URL,
    telephone: settings.phone,
    email: settings.email,
    priceRange: '1600€ - 3800€',
    address: {
      '@type': 'PostalAddress',
      addressLocality: settings.city,
      postalCode: settings.postal_code,
      addressRegion: settings.region,
      addressCountry: settings.country || 'FR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: settings.latitude,
      longitude: settings.longitude,
    },
    areaServed: [
      ...Object.values(CITIES).map((c) => ({ '@type': 'City', name: c.name })),
      { '@type': 'AdministrativeArea', name: 'Hauts-de-France' },
    ],
    sameAs: [settings.instagram, settings.facebook, settings.pinterest].filter(Boolean),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
    ],
    makesOffer: [
      { '@type': 'Offer', name: 'Reportage photo de mariage', price: '1600', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Photographie corporate' },
      { '@type': 'Offer', name: 'Location de photobooth', price: '490', priceCurrency: 'EUR' },
      { '@type': 'Offer', name: 'Formation photographie' },
    ],
  };
}

export default async function RootLayout({ children }) {
  const settings = await getSettings();
  return (
    <html lang="fr" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(settings)) }}
        />
        <Header />
        {children}
        <Footer settings={settings} />
        <CookieBanner gaId={settings.ga_id} />
      </body>
    </html>
  );
}
