import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const BASE_URL = 'https://fabvacayvibes.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Fab Vacay Vibes — Luxury Vacation Rentals | Beach, Mountain & Desert',
    template: '%s | Fab Vacay Vibes',
  },
  description: 'Three handpicked luxury vacation rentals — Casa Grandè in Clearwater FL, Owl & Hare in Joshua Tree CA, and Sierra Crest Haven in Oakhurst CA. Book direct and save up to 15% vs Airbnb.',
  keywords: [
    'luxury vacation rental',
    'Clearwater beach house rental',
    'Joshua Tree vacation rental',
    'Oakhurst mountain cabin rental',
    'Yosemite area vacation rental',
    'Joshua Tree pool house',
    'Clearwater FL vacation home',
    'book direct vacation rental',
    'luxury short term rental',
    'family vacation rental Florida',
    'desert vacation rental California',
    'mountain estate rental California',
  ],
  authors: [{ name: 'Fab Vacay Vibes', url: BASE_URL }],
  creator: 'Fab Vacay Vibes',
  publisher: 'Fab Vacay Vibes',
  category: 'travel',
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Fab Vacay Vibes',
    title: 'Fab Vacay Vibes — Luxury Vacation Rentals',
    description: 'Three extraordinary estates. Beach, Desert, Mountain. Book direct for the best rates and personal service.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Fab Vacay Vibes — Luxury Vacation Rentals',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fab Vacay Vibes — Luxury Vacation Rentals',
    description: 'Three extraordinary estates. Beach, Desert, Mountain. Book direct for the best rates.',
    images: ['/og-image.jpg'],
    creator: '@fabvacayvibes',
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
  icons: {
    icon: '/logo-icon.svg',
    shortcut: '/logo-icon.svg',
    apple: '/logo-icon.svg',
  },
  verification: {
    google: '',   // Add Google Search Console verification code here when ready
  },
}

// Organisation structured data (JSON-LD)
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Fab Vacay Vibes',
  url: BASE_URL,
  logo: `${BASE_URL}/logo.svg`,
  description: 'Luxury vacation rentals in Clearwater FL, Joshua Tree CA, and Oakhurst CA.',
  telephone: '+17273869642',
  email: 'FabVacayVibes@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
  sameAs: [
    'https://www.facebook.com/profile.php?id=100093956902449',
    'https://www.instagram.com/fabvacayvibes',
  ],
  priceRange: '$$$',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          id="org-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
