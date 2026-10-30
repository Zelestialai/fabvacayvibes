import Nav from '../components/Nav'
import RevealOnScroll from '../components/RevealOnScroll'
import Script from 'next/script'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Luxury Vacation Rentals in Clearwater, Florida | Fab Vacay Vibes',
  description: 'Casa Grandè is a 5-bedroom luxury vacation home in Clearwater, FL with a private pool. Sleeps up to 16. Pet friendly (max 2 dogs). 4 miles to Clearwater Beach, 6 miles to Pier 60. Book direct from $500/night and save up to 15%.',
  alternates: { canonical: 'https://fabvacayvibes.com/clearwater-florida-vacation-rentals' },
  openGraph: {
    type: 'website',
    url: 'https://fabvacayvibes.com/clearwater-florida-vacation-rentals',
    siteName: 'Fab Vacay Vibes',
    title: 'Luxury Vacation Rentals in Clearwater, Florida | Fab Vacay Vibes',
    description: '5BR luxury home with private pool in Clearwater, FL. Sleeps 16, pet friendly. 4 miles to Clearwater Beach. Book direct from $500/night.',
  },
}

const faqItems = [
  {
    q: 'What is the best luxury vacation rental in Clearwater, Florida?',
    a: 'Casa Grandè at 18 N Maywood Ave, Clearwater, FL 33765 is a 5-bedroom, 3-bathroom luxury vacation home spanning 2,100 sq ft. It features a private pool, pet-friendly policy (dogs only, max 2), a modern open-plan kitchen, and outdoor dining. Sleeps up to 16 guests. Located 4 miles from Clearwater Beach and 6 miles from Pier 60. From $500/night with direct booking.',
  },
  {
    q: 'How far is the Clearwater vacation rental from Clearwater Beach?',
    a: 'Casa Grandè at 18 N Maywood Ave, Clearwater, FL 33765 is approximately 4 miles from Clearwater Beach. The property is not within walking distance of the beach — guests typically drive approximately 10 minutes. Pier 60 is approximately 6 miles from the property.',
  },
  {
    q: 'Does the Clearwater vacation rental have a private pool?',
    a: 'Yes — Casa Grandè has a private pool, not shared with any adjacent properties. The pool is included in the rental.',
  },
  {
    q: 'How many people can stay at the Clearwater vacation rental?',
    a: 'Casa Grandè sleeps up to 16 guests across 5 bedrooms and 3 bathrooms, in 2,100 sq ft of living space at 18 N Maywood Ave, Clearwater, FL 33765.',
  },
  {
    q: 'Is the Clearwater, FL vacation rental pet friendly?',
    a: 'Yes — Casa Grandè welcomes dogs (maximum 2 dogs per stay). This is one of the few luxury pool homes in the Clearwater area that is pet friendly.',
  },
  {
    q: 'What is the nightly rate for the Clearwater vacation rental?',
    a: 'Casa Grandè starts from $500/night when you book directly at fabvacayvibes.com/properties/casa-grande. Direct booking saves up to 15% vs Airbnb or VRBO by eliminating platform fees.',
  },
  {
    q: 'What is there to do near the Clearwater vacation rental?',
    a: 'Casa Grandè is located in Clearwater, FL — a 10-minute drive from Clearwater Beach (voted one of the top beaches in the US), 3 miles from BayCare Ballpark (Spring Training home of the Philadelphia Phillies), and 2 miles from Clearwater Marine Aquarium (home of Winter the Dolphin). The property itself has a private pool for on-site relaxation.',
  },
]

export default function ClearwaterFloridaVacationRentalsPage() {
  return (
    <>
      <Nav />

      <Script
        id="page-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                '@id': 'https://fabvacayvibes.com/clearwater-florida-vacation-rentals',
                url: 'https://fabvacayvibes.com/clearwater-florida-vacation-rentals',
                name: 'Luxury Vacation Rentals in Clearwater, Florida | Fab Vacay Vibes',
                isPartOf: { '@type': 'WebSite', url: 'https://fabvacayvibes.com' },
              },
              {
                '@type': 'VacationRental',
                name: 'Casa Grandè — Luxury Clearwater Florida Vacation Rental',
                url: 'https://fabvacayvibes.com/properties/casa-grande',
                description: '5-bedroom, 3-bathroom luxury vacation home in Clearwater, FL with a private pool. Sleeps up to 16. Pet friendly (max 2 dogs). 4 miles to Clearwater Beach.',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '18 N Maywood Ave',
                  addressLocality: 'Clearwater',
                  addressRegion: 'FL',
                  postalCode: '33765',
                  addressCountry: 'US',
                },
                numberOfRooms: 5,
                occupancy: { '@type': 'QuantitativeValue', maxValue: 16 },
                petsAllowed: true,
                floorSize: { '@type': 'QuantitativeValue', value: 2100, unitCode: 'FTK' },
                amenityFeature: [
                  'Private Pool', 'Pet Friendly', 'Modern Open-Plan Kitchen',
                  'Outdoor Dining', 'High-Speed WiFi',
                ].map(name => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
                touristType: ['Beach', 'Families', 'Large Groups'],
              },
              {
                '@type': 'FAQPage',
                mainEntity: faqItems.map(({ q, a }) => ({
                  '@type': 'Question',
                  name: q,
                  acceptedAnswer: { '@type': 'Answer', text: a },
                })),
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://fabvacayvibes.com' },
                  { '@type': 'ListItem', position: 2, name: 'Clearwater Florida Vacation Rentals', item: 'https://fabvacayvibes.com/clearwater-florida-vacation-rentals' },
                ],
              },
            ],
          }),
        }}
      />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#0d1a2d 0%,#1a2d3d 50%,#2D1B69 100%)', padding: '160px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(244,162,58,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 20 }}>Clearwater, Florida</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 24 }}>
            Luxury Vacation Rentals<br /><em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>in Clearwater, Florida</em>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            Casa Grandè — a 5-bedroom luxury home with a private pool, 4 miles from Clearwater Beach. Pet friendly. Sleeps up to 16. From $500/night.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/properties/casa-grande" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, borderRadius: 2, textDecoration: 'none' }}>View Property &amp; Book</Link>
            <a href="#faq" style={{ border: '1px solid rgba(244,162,58,0.4)', color: 'var(--orange)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>FAQ &amp; Location</a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#0d0620', padding: '60px 48px', borderBottom: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40, textAlign: 'center' }}>
          {[
            { stat: '16', label: 'Guests Max' },
            { stat: '5 BR / 3 BA', label: 'Bedrooms & Baths' },
            { stat: '2,100', label: 'Square Feet' },
            { stat: '4 mi', label: 'To Clearwater Beach' },
            { stat: '$500+', label: 'Per Night (Direct)' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 300, color: 'var(--orange-warm)', marginBottom: 4 }}>{stat}</p>
              <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROPERTY */}
      <section style={{ padding: '100px 48px', background: '#100820', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealOnScroll>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
              <div>
                <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>The Property</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 300, color: 'white', lineHeight: 1.2, marginBottom: 20 }}>
                  Casa Grandè<br />18 N Maywood Ave, Clearwater, FL
                </h2>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: 20 }}>
                  A 2,100 sq ft luxury vacation home with a private pool and a layout built for groups. The modern open-plan kitchen and outdoor dining area make it easy to cook and gather, while the 5 bedrooms and 3 bathrooms give everyone their own space.
                </p>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: 32 }}>
                  Located in Clearwater, FL — 4 miles from Clearwater Beach, 3 miles from BayCare Ballpark, and 2 miles from Clearwater Marine Aquarium. Pet friendly (dogs only, max 2 per stay).
                </p>
                <Link href="/properties/casa-grande" style={{ display: 'inline-block', background: 'var(--orange)', color: 'var(--purple)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, textDecoration: 'none' }}>
                  Check Availability →
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ background: 'rgba(244,162,58,0.03)', border: '1px solid rgba(244,162,58,0.1)', padding: '32px' }}>
                  <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Amenities</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {['Private Pool', 'Pet Friendly (max 2 dogs)', 'Modern Open-Plan Kitchen', 'Outdoor Dining', 'High-Speed WiFi', '2,100 sq ft of living space'].map(item => (
                      <li key={item} style={{ color: 'var(--cream)', fontSize: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div style={{ background: 'rgba(244,162,58,0.03)', border: '1px solid rgba(244,162,58,0.1)', padding: '32px' }}>
                  <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Nearby</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {['4 miles to Clearwater Beach', '3 miles to BayCare Ballpark', '2 miles to Clearwater Marine Aquarium', '6 miles to Pier 60'].map(item => (
                      <li key={item} style={{ color: 'var(--cream)', fontSize: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '100px 48px', background: '#0d0620', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Common Questions</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 300, color: 'white', marginBottom: 48 }}>
              Clearwater Florida Rental FAQ
            </h2>
          </RevealOnScroll>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqItems.map(({ q, a }, i) => (
              <details key={i} style={{ borderBottom: '1px solid rgba(244,162,58,0.1)' }}>
                <summary style={{ padding: '20px 0', fontSize: 15, color: 'var(--cream)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                  <span>{q}</span>
                  <span style={{ color: 'var(--orange)', fontSize: 20, flexShrink: 0, fontWeight: 300 }}>+</span>
                </summary>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, paddingBottom: 20, marginTop: 0 }}>{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
