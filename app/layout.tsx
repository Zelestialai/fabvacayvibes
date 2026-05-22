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
  image: `${BASE_URL}/og-image.svg`,
  description: 'Luxury vacation rentals in Clearwater FL, Joshua Tree CA, and Oakhurst CA near Yosemite. Book direct and save up to 15%. Also offering full-service STR property management and investment property finder services nationwide.',
  telephone: '+17273869642',
  email: 'FabVacayVibes@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
    addressRegion: 'FL',
  },
  sameAs: [
    'https://www.facebook.com/profile.php?id=100093956902449',
    'https://www.instagram.com/fabvacayvibes',
  ],
  priceRange: '$$$',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    bestRating: '5',
    ratingCount: '50',
  },
  hasMap: 'https://maps.google.com/?q=Clearwater,FL',
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private Pool', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Pet Friendly', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Ocean View', value: true },
  ],
}

// FAQ structured data
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Why should I book directly instead of using Airbnb or VRBO?', acceptedAnswer: { '@type': 'Answer', text: 'Booking directly with Fab Vacay Vibes saves you up to 15% by eliminating OTA platform fees. You get direct communication with the owner, more flexible policies, and our Best Price Guarantee.' } },
    { '@type': 'Question', name: 'What luxury vacation rentals do you offer in Florida?', acceptedAnswer: { '@type': 'Answer', text: 'Casa Grandè is a 5-bedroom luxury beach house in Clearwater, FL with a private pool, pet-friendly policy, and walking distance to Pier 60. From $356/night.' } },
    { '@type': 'Question', name: 'Do you have vacation rentals near Joshua Tree National Park?', acceptedAnswer: { '@type': 'Answer', text: 'Owl & Hare is a luxury desert retreat in Joshua Tree, CA with stunning stargazing and easy access to Joshua Tree National Park. From $700/night.' } },
    { '@type': 'Question', name: 'What is the best large vacation rental near Yosemite?', acceptedAnswer: { '@type': 'Answer', text: 'Sierra Crest Haven in Oakhurst, CA is a luxury mountain estate near Yosemite with 6 bedrooms, game room, full bar, and mountain views. Sleeps up to 20 guests from $945/night.' } },
    { '@type': 'Question', name: 'Do you offer vacation rental property management services?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — full-service STR property management including listing setup, dynamic pricing, cleaning, 24/7 guest communication, and monthly reporting. Serving Florida, California, and expanding nationwide.' } },
    { '@type': 'Question', name: 'Can you help me find a vacation rental investment property?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — our property finder service helps investors identify high-yield STR properties across 13+ markets including Clearwater FL, Joshua Tree CA, Smoky Mountains TN, Poconos PA, Myrtle Beach SC and more. Clients average 15%+ cash-on-cash returns.' } },
  ],
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
        <Script
          id="faq-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
