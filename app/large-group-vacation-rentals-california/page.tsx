import Nav from '../components/Nav'
import RevealOnScroll from '../components/RevealOnScroll'
import Script from 'next/script'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Large Group Vacation Rentals in California | Fab Vacay Vibes',
  description: 'Two luxury California vacation rentals for large groups: Owl & Hare in Joshua Tree (4BR, sleeps 10) and Sierra Crest Haven near Yosemite (7BR, sleeps 16). Book direct and save up to 15%.',
  alternates: { canonical: 'https://fabvacayvibes.com/large-group-vacation-rentals-california' },
  openGraph: {
    type: 'website',
    url: 'https://fabvacayvibes.com/large-group-vacation-rentals-california',
    siteName: 'Fab Vacay Vibes',
    title: 'Large Group Vacation Rentals in California | Fab Vacay Vibes',
    description: 'Luxury California vacation rentals for large groups. Joshua Tree (sleeps 10) and near Yosemite (sleeps 16). Book direct from $700/night.',
  },
}

const properties = [
  {
    name: 'Owl & Hare',
    location: 'Joshua Tree, CA',
    address: '8283 Via Rocosa, Joshua Tree, CA 92252',
    slug: 'owl-and-hare',
    bedrooms: 4,
    bathrooms: 4,
    sleeps: 10,
    price: '$700',
    highlight: 'Luxury Desert Wellness Retreat',
    description: 'Two stand-alone homes on a private gated compound. Private pool, hot tub, sauna, cold plunge, LED therapy room, gym, pickleball court, and more. 5 minutes to Joshua Tree National Park.',
    pets: true,
    amenities: ['Private Pool', 'Hot Tub', 'Sauna', 'Cold Plunge', 'LED Therapy Room', 'Gym', 'Pickleball Court', 'BBQ & Fire Pit', 'Pet Friendly'],
  },
  {
    name: 'Sierra Crest Haven',
    location: 'Oakhurst, CA (Near Yosemite)',
    address: '42139 Old Yosemite Road, Oakhurst, CA 93644',
    slug: 'sierra-crest-haven',
    bedrooms: 7,
    bathrooms: 3,
    sleeps: 16,
    sqft: 4800,
    price: '$945',
    highlight: 'Luxury Mountain Estate',
    description: '4,800 sq ft luxury mountain estate. Hot tub, fireplace, game room, full bar, multiple living areas, and dual sunrise/sunset views over the High Sierra. 14 miles from Yosemite\'s south entrance.',
    pets: false,
    amenities: ['Hot Tub', 'Fireplace', 'Game Room', 'Full Bar', 'Multiple Living Areas', 'Dual Mountain Views', 'ADA Features', 'High-Speed WiFi'],
  },
]

const faqItems = [
  {
    q: 'What is the largest vacation rental in California that sleeps 16?',
    a: 'Sierra Crest Haven at 42139 Old Yosemite Road, Oakhurst, CA 93644 is a 7-bedroom, 3-bathroom luxury mountain estate with 4,800 sq ft that sleeps up to 16 guests. It features a hot tub, fireplace, game room, full bar, and dual views over the High Sierra. Located 14 miles from the Yosemite National Park south entrance. From $945/night direct booking.',
  },
  {
    q: 'What California vacation rentals accommodate large groups in Joshua Tree?',
    a: 'Owl & Hare at 8283 Via Rocosa, Joshua Tree, CA 92252 is a 4-bedroom, 4-bathroom luxury desert compound that sleeps up to 10 guests. It features two stand-alone homes on a private gated compound, a private pool, hot tub, sauna, cold plunge, gym, and pickleball court. 5 minutes from Joshua Tree National Park. From $700/night direct booking.',
  },
  {
    q: 'Which is better for a large group — Joshua Tree or near Yosemite?',
    a: 'It depends on what your group is looking for. Owl & Hare in Joshua Tree (sleeps 10) is ideal for groups prioritizing wellness amenities and desert landscape — it has a full spa setup with sauna, cold plunge, and LED therapy room, plus recreation options. Sierra Crest Haven near Yosemite (sleeps 16) is better for larger groups who want mountain scenery, access to Yosemite, and spaces to spread out in a 4,800 sq ft estate.',
  },
  {
    q: 'Can I save money booking directly instead of through Airbnb for a large group?',
    a: 'Yes — booking directly at fabvacayvibes.com saves your group up to 15% by eliminating Airbnb or VRBO platform fees. On a week-long group trip, those savings are significant. We also offer a Best Price Guarantee.',
  },
  {
    q: 'Are any California large group rentals pet friendly?',
    a: 'Yes — Owl & Hare in Joshua Tree is pet friendly (dogs only, maximum 2 per stay). Sierra Crest Haven near Yosemite does not allow pets.',
  },
]

export default function LargeGroupCaliforniaPage() {
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
                '@id': 'https://fabvacayvibes.com/large-group-vacation-rentals-california',
                url: 'https://fabvacayvibes.com/large-group-vacation-rentals-california',
                name: 'Large Group Vacation Rentals in California | Fab Vacay Vibes',
                isPartOf: { '@type': 'WebSite', url: 'https://fabvacayvibes.com' },
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
                  { '@type': 'ListItem', position: 2, name: 'Large Group Vacation Rentals California', item: 'https://fabvacayvibes.com/large-group-vacation-rentals-california' },
                ],
              },
            ],
          }),
        }}
      />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#2D1B69 0%,#1a0d3d 60%,#0d1a10 100%)', padding: '160px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(244,162,58,0.07) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 20 }}>California · Sleeps 10–16</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 24 }}>
            Large Group Vacation<br /><em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>Rentals in California</em>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            Two luxury properties built for groups — a desert wellness compound in Joshua Tree and a mountain estate near Yosemite. Book direct and save.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#properties" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, borderRadius: 2, textDecoration: 'none' }}>See Both Properties</a>
            <a href="#faq" style={{ border: '1px solid rgba(244,162,58,0.4)', color: 'var(--orange)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>FAQ</a>
          </div>
        </div>
      </section>

      {/* PROPERTIES */}
      <section id="properties" style={{ padding: '100px 48px', background: '#100820', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Our California Properties</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'white', marginBottom: 64 }}>
              Two Destinations. One Brand.
            </h2>
          </RevealOnScroll>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {properties.map(p => (
              <RevealOnScroll key={p.slug}>
                <div style={{ background: 'rgba(244,162,58,0.03)', border: '1px solid rgba(244,162,58,0.1)', padding: '48px 48px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start' }}>
                    <div>
                      <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 8 }}>{p.highlight}</p>
                      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 300, color: 'white', marginBottom: 4 }}>{p.name}</h3>
                      <p style={{ fontSize: 13, color: 'rgba(244,162,58,0.6)', marginBottom: 20 }}>{p.address}</p>
                      <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 24 }}>{p.description}</p>
                      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 28 }}>
                        {[
                          { label: 'Bedrooms', val: p.bedrooms },
                          { label: 'Bathrooms', val: p.bathrooms },
                          { label: 'Sleeps', val: p.sleeps },
                          { label: 'From / Night', val: p.price },
                          { label: 'Pets', val: p.pets ? 'Dogs (max 2)' : 'Not allowed' },
                        ].map(({ label, val }) => (
                          <div key={label}>
                            <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{label}</p>
                            <p style={{ fontSize: 16, color: 'var(--cream)', fontWeight: 400 }}>{val}</p>
                          </div>
                        ))}
                      </div>
                      <Link href={`/properties/${p.slug}`} style={{ display: 'inline-block', border: '1px solid rgba(244,162,58,0.5)', color: 'var(--orange)', padding: '12px 24px', fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', borderRadius: 2, textDecoration: 'none' }}>
                        View &amp; Book →
                      </Link>
                    </div>
                    <div style={{ minWidth: 180, textAlign: 'right' }}>
                      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 300, color: 'var(--orange-warm)' }}>{p.sleeps}</p>
                      <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-muted)' }}>Guests Max</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '100px 48px', background: '#0d0620', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Common Questions</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 300, color: 'white', marginBottom: 48 }}>
              Large Group California Rental FAQ
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
      <section style={{ padding: '100px 48px', background: 'linear-gradient(135deg,#2D1B69 0%,#1a0d3d 100%)', textAlign: 'center', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 20 }}>Book Direct &amp; Save Up to 15%</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,60px)', fontWeight: 300, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
              Ready to Book Your<br /><em style={{ color: 'var(--orange-warm)' }}>California Group Trip?</em>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40 }}>
              Both properties available for direct booking. Best Price Guarantee — we beat any price you find on Airbnb or VRBO.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/properties/owl-and-hare" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, textDecoration: 'none' }}>Joshua Tree (Sleeps 10)</Link>
              <Link href="/properties/sierra-crest-haven" style={{ border: '1px solid rgba(244,162,58,0.5)', color: 'var(--orange)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>Near Yosemite (Sleeps 16)</Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  )
}
