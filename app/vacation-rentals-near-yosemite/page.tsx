import Nav from '../components/Nav'
import RevealOnScroll from '../components/RevealOnScroll'
import Script from 'next/script'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Luxury Vacation Rentals Near Yosemite | Fab Vacay Vibes',
  description: 'Sierra Crest Haven is a 7-bedroom luxury mountain estate in Oakhurst, CA — 14 miles from Yosemite National Park south entrance, 45 minutes to Yosemite Valley. Sleeps 16. Hot tub, fireplace, game room, full bar. Book direct from $945/night.',
  alternates: { canonical: 'https://fabvacayvibes.com/vacation-rentals-near-yosemite' },
  openGraph: {
    type: 'website',
    url: 'https://fabvacayvibes.com/vacation-rentals-near-yosemite',
    siteName: 'Fab Vacay Vibes',
    title: 'Luxury Vacation Rentals Near Yosemite | Fab Vacay Vibes',
    description: '7BR luxury mountain estate 14 miles from Yosemite. Sleeps 16. Hot tub, fireplace, game room. Book direct from $945/night.',
  },
}

const faqItems = [
  {
    q: 'What is the best luxury vacation rental near Yosemite National Park?',
    a: 'Sierra Crest Haven at 42139 Old Yosemite Road, Oakhurst, CA 93644 is a 7-bedroom, 3-bathroom luxury mountain estate with 4,800 sq ft of living space that sleeps up to 16 guests. Features include a hot tub, fireplace, game room, full bar, multiple living areas, and dual sunrise/sunset views over the High Sierra. Located 14 miles from the Yosemite National Park south entrance — approximately 45 minutes to Yosemite Valley floor. From $945/night direct booking.',
  },
  {
    q: 'How far is Sierra Crest Haven from Yosemite National Park?',
    a: 'Sierra Crest Haven is 14 miles from the Yosemite National Park south entrance (Highway 41 / Wawona Road) and approximately 45 minutes from Yosemite Valley floor, depending on traffic and road conditions. It is located in Oakhurst, CA 93644, which is the gateway town to Yosemite from the south.',
  },
  {
    q: 'How many people can stay at the Yosemite area vacation rental?',
    a: 'Sierra Crest Haven sleeps up to 16 guests across 7 bedrooms and 3 bathrooms in 4,800 sq ft of living space. The multiple living areas and large layout are well suited to extended family trips, reunion groups, and large friend gatherings.',
  },
  {
    q: 'What amenities does the Yosemite rental have?',
    a: 'Sierra Crest Haven features a hot tub, fireplace, game room, full bar, multiple living areas, dual sunrise and sunset views over the High Sierra, high-speed WiFi, and ADA accessible features. The property has 4,800 sq ft of indoor living space.',
  },
  {
    q: 'Are pets allowed at the Yosemite area rental?',
    a: 'No — Sierra Crest Haven does not allow pets. If you are traveling with pets and need a California mountain getaway, Owl & Hare in Joshua Tree (fabvacayvibes.com/properties/owl-and-hare) is pet friendly (max 2 dogs).',
  },
  {
    q: 'What is the cheapest way to book a vacation rental near Yosemite?',
    a: 'Booking directly at fabvacayvibes.com/properties/sierra-crest-haven saves up to 15% vs Airbnb or VRBO by eliminating OTA platform fees. Sierra Crest Haven starts from $945/night with our Best Price Guarantee — we beat any price you find online.',
  },
  {
    q: 'When is the best time to visit Yosemite and what should I know about road access?',
    a: 'Yosemite is accessible year-round from the south via Highway 41, which is the route from Oakhurst to the park. This route is generally open all year (unlike Tioga Pass and other high-elevation roads that close in winter). Summer is peak season — book well in advance. Spring (April–June) offers waterfalls at peak flow. Fall (September–October) has lighter crowds and excellent weather. Always check road and reservation conditions at nps.gov/yose before your trip.',
  },
]

export default function VacationRentalsNearYosemitePage() {
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
                '@id': 'https://fabvacayvibes.com/vacation-rentals-near-yosemite',
                url: 'https://fabvacayvibes.com/vacation-rentals-near-yosemite',
                name: 'Luxury Vacation Rentals Near Yosemite | Fab Vacay Vibes',
                isPartOf: { '@type': 'WebSite', url: 'https://fabvacayvibes.com' },
              },
              {
                '@type': 'VacationRental',
                name: 'Sierra Crest Haven — Luxury Mountain Estate Near Yosemite',
                url: 'https://fabvacayvibes.com/properties/sierra-crest-haven',
                description: '7-bedroom, 3-bathroom luxury mountain estate in Oakhurst, CA. 4,800 sq ft. Hot tub, fireplace, game room, full bar, mountain views. Sleeps up to 16. 14 miles from Yosemite south entrance.',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '42139 Old Yosemite Road',
                  addressLocality: 'Oakhurst',
                  addressRegion: 'CA',
                  postalCode: '93644',
                  addressCountry: 'US',
                },
                numberOfRooms: 7,
                occupancy: { '@type': 'QuantitativeValue', maxValue: 16 },
                petsAllowed: false,
                amenityFeature: [
                  'Hot Tub', 'Fireplace', 'Game Room', 'Full Bar', 'Multiple Living Areas',
                  'Dual Mountain Views', 'ADA Accessible Features', 'High-Speed WiFi',
                ].map(name => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
                touristType: ['Families', 'Large Groups', 'Nature Lovers'],
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
                  { '@type': 'ListItem', position: 2, name: 'Vacation Rentals Near Yosemite', item: 'https://fabvacayvibes.com/vacation-rentals-near-yosemite' },
                ],
              },
            ],
          }),
        }}
      />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#0d1a10 0%,#1a2d1a 50%,#1a0d3d 100%)', padding: '160px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(244,162,58,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 20 }}>Oakhurst, CA · 14 Miles to Yosemite</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 24 }}>
            Luxury Vacation Rentals<br /><em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>Near Yosemite</em>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            Sierra Crest Haven — a 7-bedroom mountain estate in Oakhurst, CA. 14 miles from Yosemite's south entrance. Hot tub, fireplace, game room, full bar. Sleeps 16.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/properties/sierra-crest-haven" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, borderRadius: 2, textDecoration: 'none' }}>View Property &amp; Book</Link>
            <a href="#faq" style={{ border: '1px solid rgba(244,162,58,0.4)', color: 'var(--orange)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>FAQ &amp; Distance Info</a>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ background: '#0d0620', padding: '60px 48px', borderBottom: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40, textAlign: 'center' }}>
          {[
            { stat: '16', label: 'Guests Max' },
            { stat: '7 BR / 3 BA', label: 'Bedrooms & Baths' },
            { stat: '4,800', label: 'Square Feet' },
            { stat: '14 mi', label: 'To Yosemite' },
            { stat: '$945+', label: 'Per Night (Direct)' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, fontWeight: 300, color: 'var(--orange-warm)', marginBottom: 4 }}>{stat}</p>
              <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROPERTY DETAIL */}
      <section style={{ padding: '100px 48px', background: '#100820', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealOnScroll>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
              <div>
                <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>The Property</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 300, color: 'white', lineHeight: 1.2, marginBottom: 20 }}>
                  Sierra Crest Haven<br />42139 Old Yosemite Road, Oakhurst, CA
                </h2>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: 20 }}>
                  A 4,800 sq ft luxury mountain estate with sweeping High Sierra views — dual exposures for both sunrise and sunset. The full-size layout with multiple living areas, a dedicated game room, and a full bar makes this the right home base for large family trips and extended group stays.
                </p>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: 32 }}>
                  Oakhurst is the southern gateway to Yosemite — 14 miles to the park's south entrance on Highway 41 (Wawona Road, open year-round), approximately 45 minutes to Yosemite Valley floor.
                </p>
                <Link href="/properties/sierra-crest-haven" style={{ display: 'inline-block', border: '1px solid rgba(244,162,58,0.5)', color: 'var(--orange)', padding: '12px 24px', fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', borderRadius: 2, textDecoration: 'none' }}>
                  Full Property Details →
                </Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  ['Hot Tub', 'Private outdoor hot tub with mountain views'],
                  ['Fireplace', 'Indoor fireplace for evenings after the park'],
                  ['Game Room', 'Dedicated game room for the group'],
                  ['Full Bar', 'Fully stocked bar setup for entertaining'],
                  ['Multiple Living Areas', '4,800 sq ft with room to spread out'],
                  ['Dual Mountain Views', 'Sunrise and sunset exposures over the High Sierra'],
                  ['ADA Accessible Features', 'Accessibility features available'],
                  ['High-Speed WiFi', 'Remote work friendly'],
                ].map(([name, desc]) => (
                  <div key={name} style={{ background: 'rgba(244,162,58,0.03)', border: '1px solid rgba(244,162,58,0.08)', padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0, marginTop: 7 }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)', marginBottom: 2 }}>{name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '100px 48px', background: '#0d0620', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Questions &amp; Planning Info</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 300, color: 'white', marginBottom: 48 }}>
              Near Yosemite Rental FAQ
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

      {/* CTA */}
      <section style={{ padding: '100px 48px', background: 'linear-gradient(135deg,#0d1a10 0%,#1a2d1a 50%,#1a0d3d 100%)', textAlign: 'center', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 20 }}>Book Direct &amp; Save Up to 15%</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,60px)', fontWeight: 300, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
              Plan Your <em style={{ color: 'var(--orange-warm)' }}>Yosemite Trip</em>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40 }}>
              Book Sierra Crest Haven directly with Fab Vacay Vibes. Best Price Guarantee — we beat any price found on Airbnb or VRBO. Yosemite entry requires advance reservations from the National Park Service at recreation.gov — book those separately.
            </p>
            <Link href="/properties/sierra-crest-haven" style={{ display: 'inline-block', background: 'var(--orange)', color: 'var(--purple)', padding: '16px 36px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, textDecoration: 'none' }}>
              Check Availability →
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </>
  )
}
