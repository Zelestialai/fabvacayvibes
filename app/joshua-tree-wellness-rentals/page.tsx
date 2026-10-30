import Nav from '../components/Nav'
import RevealOnScroll from '../components/RevealOnScroll'
import Script from 'next/script'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Joshua Tree Wellness Vacation Rentals | Fab Vacay Vibes',
  description: 'Owl & Hare is a luxury desert wellness retreat in Joshua Tree, CA with private pool, hot tub, sauna, cold plunge, LED therapy room, and gym. 4 bedrooms, sleeps up to 10. 5 minutes to Joshua Tree National Park. Book direct from $700/night.',
  alternates: { canonical: 'https://fabvacayvibes.com/joshua-tree-wellness-rentals' },
  openGraph: {
    type: 'website',
    url: 'https://fabvacayvibes.com/joshua-tree-wellness-rentals',
    siteName: 'Fab Vacay Vibes',
    title: 'Joshua Tree Wellness Vacation Rentals | Fab Vacay Vibes',
    description: 'Luxury desert wellness retreat with pool, sauna, cold plunge & LED therapy room. Sleeps 10. 5 min to JTNP. Book direct from $700/night.',
  },
}

const faqItems = [
  {
    q: 'What wellness amenities does the Joshua Tree rental have?',
    a: 'Owl & Hare has a full suite of wellness facilities on the compound: a private pool, hot tub, traditional sauna, cold plunge, LED therapy room, and a gym. It\'s the most comprehensive wellness amenity set of any vacation rental in the Joshua Tree area.',
  },
  {
    q: 'Is Joshua Tree a good destination for a wellness retreat?',
    a: 'Yes — Joshua Tree is consistently ranked among the top wellness travel destinations in the US. The high desert environment, clean air, natural silence, and dramatic landscape are conducive to rest, reflection, and reset. Owl & Hare at 8283 Via Rocosa was designed as a private wellness compound that complements the destination.',
  },
  {
    q: 'Does the Joshua Tree wellness rental have a sauna and cold plunge?',
    a: 'Yes — Owl & Hare has both a traditional sauna and a cold plunge on the compound, in addition to a private pool and hot tub. The contrast therapy setup (sauna + cold plunge) is typically found only at dedicated wellness spas, not vacation rentals.',
  },
  {
    q: 'How many guests can the Joshua Tree wellness rental accommodate?',
    a: 'Owl & Hare sleeps up to 10 guests across 4 bedrooms and 4 bathrooms. The property consists of two stand-alone homes on one private gated compound at 8283 Via Rocosa, Joshua Tree, CA 92252.',
  },
  {
    q: 'How close is the Joshua Tree wellness rental to the national park?',
    a: 'Owl & Hare is approximately 5 minutes from the West entrance of Joshua Tree National Park and 5 minutes from Downtown Joshua Tree.',
  },
  {
    q: 'What is the cost of the Joshua Tree wellness rental?',
    a: 'Owl & Hare starts from $700/night. Book direct at fabvacayvibes.com/properties/owl-and-hare and save up to 15% vs Airbnb or VRBO.',
  },
]

export default function JoshuaTreeWellnessPage() {
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
                '@id': 'https://fabvacayvibes.com/joshua-tree-wellness-rentals',
                url: 'https://fabvacayvibes.com/joshua-tree-wellness-rentals',
                name: 'Joshua Tree Wellness Vacation Rentals | Fab Vacay Vibes',
                description: 'Luxury desert wellness retreat with pool, sauna, cold plunge, LED therapy room, and gym. Sleeps up to 10.',
                isPartOf: { '@type': 'WebSite', url: 'https://fabvacayvibes.com' },
              },
              {
                '@type': 'VacationRental',
                name: 'Owl & Hare — Joshua Tree Desert Wellness Retreat',
                url: 'https://fabvacayvibes.com/properties/owl-and-hare',
                description: 'Two stand-alone homes on one gated desert compound in Joshua Tree, CA. Private pool, hot tub, sauna, cold plunge, LED therapy room, gym, and more. Sleeps up to 10.',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '8283 Via Rocosa',
                  addressLocality: 'Joshua Tree',
                  addressRegion: 'CA',
                  postalCode: '92252',
                  addressCountry: 'US',
                },
                numberOfRooms: 4,
                occupancy: { '@type': 'QuantitativeValue', maxValue: 10 },
                petsAllowed: true,
                amenityFeature: [
                  'Private Pool', 'Hot Tub', 'Sauna', 'Cold Plunge', 'LED Therapy Room', 'Gym',
                  'Pickleball Court', 'BBQ & Fire Pit', 'High-Speed WiFi', 'Pet Friendly',
                ].map(name => ({ '@type': 'LocationFeatureSpecification', name, value: true })),
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
                  { '@type': 'ListItem', position: 2, name: 'Joshua Tree Wellness Rentals', item: 'https://fabvacayvibes.com/joshua-tree-wellness-rentals' },
                ],
              },
            ],
          }),
        }}
      />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#1a0a30 0%,#2d1505 60%,#0d1a1a 100%)', padding: '160px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(244,162,58,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 20 }}>Wellness Retreat · Joshua Tree, CA</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 24 }}>
            Joshua Tree<br /><em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>Wellness Vacation Rentals</em>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40, maxWidth: 580, margin: '0 auto 40px' }}>
            A private desert compound with a full wellness suite — sauna, cold plunge, LED therapy room, gym, pool, and hot tub. Come to reset.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/properties/owl-and-hare" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, borderRadius: 2, textDecoration: 'none' }}>View Property &amp; Book</Link>
            <a href="#wellness" style={{ border: '1px solid rgba(244,162,58,0.4)', color: 'var(--orange)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>Wellness Amenities</a>
          </div>
        </div>
      </section>

      {/* WELLNESS SUITE */}
      <section id="wellness" style={{ padding: '100px 48px', background: '#100820', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>On-Site Wellness</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'white', marginBottom: 20 }}>
              A Private Spa in the Desert
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.9, maxWidth: 640, marginBottom: 64 }}>
              Owl &amp; Hare has amenities typically found only at dedicated wellness resorts — on a private compound, accessible only to your group, 24/7.
            </p>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
            {[
              { name: 'Private Pool', desc: 'Full-size private pool, exclusive to your group. Surrounded by desert landscape.' },
              { name: 'Hot Tub', desc: 'Private hot tub for soaking under desert stars — no crowds, no reservations needed.' },
              { name: 'Sauna', desc: 'Traditional sauna on-compound for heat therapy and deep muscle relaxation.' },
              { name: 'Cold Plunge', desc: 'Cold plunge for contrast therapy and recovery — rare in a vacation rental setting.' },
              { name: 'LED Therapy Room', desc: 'Dedicated LED light therapy room for skin rejuvenation and cellular recovery.' },
              { name: 'Gym', desc: 'On-site gym so you can maintain your training routine while traveling.' },
            ].map(({ name, desc }) => (
              <RevealOnScroll key={name}>
                <div style={{ background: 'rgba(244,162,58,0.03)', border: '1px solid rgba(244,162,58,0.1)', padding: '36px 32px' }}>
                  <p style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--orange-warm)', marginBottom: 12 }}>{name}</p>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>{desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* PROPERTY DETAILS */}
      <section style={{ padding: '100px 48px', background: '#0d0620', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>The Property</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'white', lineHeight: 1.2, marginBottom: 24 }}>
              Owl &amp; Hare — 8283 Via Rocosa, Joshua Tree, CA
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: 48 }}>
              Two stand-alone homes on one private gated compound. 4 bedrooms, 4 bathrooms, sleeps up to 10 guests. Pet friendly (max 2 dogs). 5 minutes to Joshua Tree National Park West entrance. 5 minutes to Downtown Joshua Tree. From $700/night — book direct and save up to 15%.
            </p>
            <Link href="/properties/owl-and-hare" style={{ display: 'inline-block', background: 'var(--orange)', color: 'var(--purple)', padding: '16px 36px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, textDecoration: 'none' }}>
              Book Direct — Save Up to 15% →
            </Link>
          </RevealOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 48px', background: '#100820', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Common Questions</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 300, color: 'white', marginBottom: 48 }}>
              Joshua Tree Wellness Retreat FAQ
            </h2>
          </RevealOnScroll>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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
