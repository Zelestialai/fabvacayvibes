import Nav from '../components/Nav'
import RevealOnScroll from '../components/RevealOnScroll'
import Script from 'next/script'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Private Group Retreats in Joshua Tree | Fab Vacay Vibes',
  description: 'Owl & Hare is a 4-bedroom, 4-bathroom luxury desert compound in Joshua Tree, CA — built for private group retreats. Private pool, hot tub, sauna, cold plunge, LED therapy room, gym, pickleball court, and more. Sleeps up to 10. Book direct from $700/night.',
  alternates: { canonical: 'https://fabvacayvibes.com/joshua-tree-group-retreats' },
  openGraph: {
    type: 'website',
    url: 'https://fabvacayvibes.com/joshua-tree-group-retreats',
    siteName: 'Fab Vacay Vibes',
    title: 'Private Group Retreats in Joshua Tree | Fab Vacay Vibes',
    description: 'Luxury desert compound for private group retreats. Pool, sauna, cold plunge, gym, pickleball & more. Sleeps 10. 5 min to Joshua Tree National Park.',
  },
}

const faqItems = [
  {
    q: 'What makes Owl & Hare ideal for a group retreat in Joshua Tree?',
    a: 'Owl & Hare is a private gated compound with two stand-alone homes on one property, giving groups both shared communal spaces and private retreat space. The wellness amenities — sauna, cold plunge, LED therapy room, and gym — make it purpose-built for wellness retreats, corporate offsites, and group rejuvenation trips. The compound also includes a pickleball court, mini golf, bocce ball, arcade machines, and pool table, so there\'s no shortage of group activities.',
  },
  {
    q: 'How many people can stay at the Joshua Tree group retreat?',
    a: 'Owl & Hare sleeps up to 10 guests across 4 bedrooms and 4 bathrooms. The property is located at 8283 Via Rocosa, Joshua Tree, CA 92252.',
  },
  {
    q: 'Does the Joshua Tree retreat have a pool?',
    a: 'Yes — Owl & Hare has a private pool, private hot tub, sauna, and cold plunge on the compound. The pool is not shared with any other property.',
  },
  {
    q: 'How far is the Joshua Tree retreat from Joshua Tree National Park?',
    a: 'Owl & Hare is approximately 5 minutes from the West entrance of Joshua Tree National Park and 5 minutes from Downtown Joshua Tree.',
  },
  {
    q: 'Is the Joshua Tree group retreat pet friendly?',
    a: 'Yes — Owl & Hare welcomes dogs (maximum 2 per stay). A high chair is also available for families traveling with young children.',
  },
  {
    q: 'What is the nightly rate for the Joshua Tree group retreat?',
    a: 'Owl & Hare starts from $700/night when you book direct at fabvacayvibes.com/properties/owl-and-hare. Direct booking saves up to 15% vs Airbnb or VRBO.',
  },
]

export default function JoshuaTreeGroupRetreatsPage() {
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
                '@id': 'https://fabvacayvibes.com/joshua-tree-group-retreats',
                url: 'https://fabvacayvibes.com/joshua-tree-group-retreats',
                name: 'Private Group Retreats in Joshua Tree | Fab Vacay Vibes',
                description: 'Luxury desert compound for private group retreats in Joshua Tree, CA. Sleeps up to 10.',
                isPartOf: { '@type': 'WebSite', url: 'https://fabvacayvibes.com' },
              },
              {
                '@type': 'VacationRental',
                name: 'Owl & Hare — Joshua Tree Private Group Retreat',
                url: 'https://fabvacayvibes.com/properties/owl-and-hare',
                description: 'Two stand-alone homes on one gated desert compound. Private pool, hot tub, sauna, cold plunge, LED therapy room, gym, pickleball court & more. Sleeps up to 10. 5 minutes to Joshua Tree National Park.',
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
                  'Private Pool', 'Hot Tub', 'Sauna', 'Cold Plunge', 'LED Therapy Room',
                  'Gym', 'Pickleball Court', 'Mini Golf', 'Bocce Ball', 'Ping Pong',
                  'Pool Table', 'Arcade Machines', 'Vintage Airstream', 'BBQ & Fire Pit',
                  'High-Speed WiFi', 'Pet Friendly',
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
                  { '@type': 'ListItem', position: 2, name: 'Joshua Tree Group Retreats', item: 'https://fabvacayvibes.com/joshua-tree-group-retreats' },
                ],
              },
            ],
          }),
        }}
      />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#1a0d3d 0%,#2d1505 60%,#1a0d3d 100%)', padding: '160px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(244,162,58,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 20 }}>Joshua Tree, California</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 24 }}>
            Private Group Retreats<br /><em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>in Joshua Tree</em>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
            A private gated desert compound — two homes, one pool, one wellness sanctuary. Built for groups who want space, privacy, and something extraordinary.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/properties/owl-and-hare" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, borderRadius: 2, textDecoration: 'none' }}>View Property &amp; Book</Link>
            <a href="#amenities" style={{ border: '1px solid rgba(244,162,58,0.4)', color: 'var(--orange)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>See Amenities</a>
          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section style={{ background: '#0d0620', padding: '60px 48px', borderBottom: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 40, textAlign: 'center' }}>
          {[
            { stat: '10', label: 'Guests Max' },
            { stat: '4 BR / 4 BA', label: 'Bedrooms & Baths' },
            { stat: '5 min', label: 'To National Park' },
            { stat: '$700+', label: 'Per Night (Direct)' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 300, color: 'var(--orange-warm)', marginBottom: 4 }}>{stat}</p>
              <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RETREAT CONCEPT */}
      <section style={{ padding: '100px 48px', background: '#100820' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealOnScroll>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>The Compound</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'white', lineHeight: 1.2, marginBottom: 24 }}>
                  Two Homes.<br />One Private Sanctuary.
                </h2>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: 20 }}>
                  Owl &amp; Hare is two stand-alone homes on a single gated desert compound at 8283 Via Rocosa, Joshua Tree, CA. The dual-structure layout gives groups both shared communal spaces and private retreat space — everyone together, but no one on top of each other.
                </p>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.9, marginBottom: 32 }}>
                  Five minutes from the West entrance of Joshua Tree National Park. Five minutes from Downtown Joshua Tree. The desert starts at your doorstep.
                </p>
                <Link href="/properties/owl-and-hare" style={{ display: 'inline-block', background: 'transparent', border: '1px solid rgba(244,162,58,0.5)', color: 'var(--orange)', padding: '12px 24px', fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', borderRadius: 2, textDecoration: 'none' }}>
                  Full Property Details →
                </Link>
              </div>
              <div style={{ background: 'rgba(244,162,58,0.04)', border: '1px solid rgba(244,162,58,0.1)', borderRadius: 4, padding: '40px' }}>
                <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 24 }}>Perfect For</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    'Corporate offsites & team retreats',
                    'Wellness &amp; yoga retreats',
                    'Bachelorette &amp; bachelor weekends',
                    'Birthday &amp; milestone celebrations',
                    'Family reunions (pet friendly)',
                    'Creative &amp; artist residencies',
                    'Fitness &amp; training camps',
                  ].map(item => (
                    <li key={item} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', color: 'var(--cream)', fontSize: 14, lineHeight: 1.6 }}>
                      <span style={{ color: 'var(--orange)', flexShrink: 0 }}>—</span>
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* AMENITIES */}
      <section id="amenities" style={{ padding: '100px 48px', background: '#0d0620', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>What's Included</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'white', marginBottom: 60 }}>
              Amenities Built for Groups
            </h2>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
            {[
              { category: 'Wellness', items: ['Private Pool', 'Hot Tub', 'Sauna', 'Cold Plunge', 'LED Therapy Room', 'Gym'] },
              { category: 'Recreation', items: ['Pickleball Court', 'Mini Golf', 'Bocce Ball', 'Ping Pong', 'Pool Table', 'Arcade Machines'] },
              { category: 'Outdoor & Social', items: ['Vintage Airstream', 'BBQ & Fire Pit', 'Desert Views', 'Mountain Views', 'Private Gated Compound', 'Pet Friendly (max 2 dogs)'] },
            ].map(({ category, items }) => (
              <RevealOnScroll key={category}>
                <div style={{ background: 'rgba(244,162,58,0.03)', border: '1px solid rgba(244,162,58,0.1)', padding: 40 }}>
                  <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 24 }}>{category}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {items.map(item => (
                      <li key={item} style={{ color: 'var(--cream)', fontSize: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '100px 48px', background: '#100820', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Common Questions</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 300, color: 'white', marginBottom: 48 }}>
              Joshua Tree Group Retreat FAQ
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

      {/* CTA */}
      <section style={{ padding: '100px 48px', background: 'linear-gradient(135deg,#2D1B69 0%,#1a0d3d 100%)', textAlign: 'center', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 20 }}>Book Direct &amp; Save</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,60px)', fontWeight: 300, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
              Ready to Plan Your<br /><em style={{ color: 'var(--orange-warm)' }}>Joshua Tree Retreat?</em>
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40 }}>
              Book direct with Fab Vacay Vibes and save up to 15% vs Airbnb or VRBO. Best Price Guarantee — we beat any price you find online.
            </p>
            <Link href="/properties/owl-and-hare" style={{ display: 'inline-block', background: 'var(--orange)', color: 'var(--purple)', padding: '16px 36px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, textDecoration: 'none' }}>
              Check Availability →
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </>
  )
}
