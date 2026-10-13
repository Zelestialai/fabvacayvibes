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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: [{ url: '/favicon.ico' }],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  verification: {
    google: 'Cz-26RV5AEDSoEL2EP62W4WVMlYQtvAVAnblsvHLcU8',
  },
}

// Organisation structured data (JSON-LD)
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Fab Vacay Vibes',
  url: BASE_URL,
  logo: `${BASE_URL}/logo-gold.png`,
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
    { '@type': 'Question', name: 'Why should I book directly instead of using Airbnb or VRBO?', acceptedAnswer: { '@type': 'Answer', text: 'Booking directly with Fab Vacay Vibes at fabvacayvibes.com saves you up to 15% by eliminating OTA platform fees. You get direct communication with the owner, our Best Price Guarantee, and more flexible check-in/check-out policies. All three properties — Casa Grandè (Clearwater FL), Owl & Hare (Joshua Tree CA), and Sierra Crest Haven (Oakhurst CA near Yosemite) — are available to book directly.' } },
    { '@type': 'Question', name: 'What luxury vacation rentals do you offer in Florida?', acceptedAnswer: { '@type': 'Answer', text: 'Casa Grandè is a 5-bedroom, 3-bathroom luxury vacation home at 18 N Maywood Ave, Clearwater, FL 33765. Spanning 2,100 sq ft, it features a private pool, pet-friendly policy (dogs only, max 2), modern open-plan kitchen, outdoor dining, and sleeps up to 16 guests. Located 4 miles from Clearwater Beach and 3 miles from BayCare Ballpark. From $500/night with direct booking.' } },
    { '@type': 'Question', name: 'Do you have vacation rentals near Joshua Tree National Park?', acceptedAnswer: { '@type': 'Answer', text: 'Owl & Hare at 8283 Via Rocosa, Joshua Tree, CA 92252 is a 4-bedroom, 4-bathroom luxury desert wellness retreat that sleeps up to 10 guests. It features two stand-alone homes on one compound, a private pool, hot tub, vintage Airstream, and fire pit. Situated 5 minutes from the Joshua Tree National Park west entrance and 5 minutes from Downtown Joshua Tree. Pet friendly (max 2 dogs). From $700/night.' } },
    { '@type': 'Question', name: 'What is the best large vacation rental near Yosemite?', acceptedAnswer: { '@type': 'Answer', text: 'Sierra Crest Haven at 42139 Old Yosemite Road, Oakhurst, CA 93644 is a 7-bedroom, 3-bathroom luxury mountain estate with 4,800 sq ft of living space, a hot tub, fireplace, game room, full bar, multiple living areas, and dual sunrise/sunset views over the High Sierra. It sleeps up to 16 guests and is located 14 miles from the Yosemite National Park south entrance (approximately 45 minutes to Yosemite Valley). From $945/night.' } },
    { '@type': 'Question', name: 'Which properties allow pets?', acceptedAnswer: { '@type': 'Answer', text: 'Casa Grandè in Clearwater, FL and Owl & Hare in Joshua Tree, CA are both pet friendly — dogs only, maximum 2 dogs per stay, high chair provided. Sierra Crest Haven in Oakhurst, CA does not allow pets.' } },
    { '@type': 'Question', name: 'How far is the Clearwater vacation rental from the beach?', acceptedAnswer: { '@type': 'Answer', text: 'Casa Grandè is located at 18 N Maywood Ave, Clearwater, FL 33765 — approximately 4 miles from Clearwater Beach and 3 miles from BayCare Ballpark. The property is not within walking distance of the beach; guests typically drive approximately 10 minutes to reach Clearwater Beach or Pier 60.' } },
    { '@type': 'Question', name: 'Do you offer vacation rental property management services?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — Fab Vacay Vibes offers full-service STR property management including professional listing setup, dynamic pricing optimization, 24/7 guest communication, cleaning and maintenance coordination, guest screening, and monthly owner reporting. Currently serving Florida and California with nationwide expansion. Contact FabVacayVibes@gmail.com or call (727) 386-9642.' } },
    { '@type': 'Question', name: 'Can you help me find a vacation rental investment property?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — our property finder service helps investors identify high-yield STR properties across 13+ markets including Clearwater FL, Joshua Tree CA, Smoky Mountains TN, Poconos PA, Myrtle Beach SC, Outer Banks NC, Moab UT, and more. Clients average 15%+ cash-on-cash returns. Use our free Rent Analyzer at fabvacayvibes.com/rent-analyzer to get an instant revenue estimate for any US address.' } },
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
      <body>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GP6D3BGY20"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-GP6D3BGY20');
        ` }} />
        {children}
      </body>
    </html>
  )
}
