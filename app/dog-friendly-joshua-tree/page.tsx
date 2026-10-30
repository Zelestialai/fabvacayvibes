import Nav from '../components/Nav'
import RevealOnScroll from '../components/RevealOnScroll'
import Script from 'next/script'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dog-Friendly Joshua Tree Vacation Rentals | Fab Vacay Vibes',
  description: 'Owl & Hare is a dog-friendly luxury desert compound in Joshua Tree, CA. Private gated property, pool, hot tub, sauna, and open desert space for dogs to roam. Max 2 dogs. 4 bedrooms, sleeps 10. 5 min to Joshua Tree National Park. Book direct from $700/night.',
  alternates: { canonical: 'https://fabvacayvibes.com/dog-friendly-joshua-tree' },
  openGraph: {
    type: 'website',
    url: 'https://fabvacayvibes.com/dog-friendly-joshua-tree',
    siteName: 'Fab Vacay Vibes',
    title: 'Dog-Friendly Joshua Tree Vacation Rentals | Fab Vacay Vibes',
    description: 'Dog-friendly luxury desert compound in Joshua Tree. Gated, private, pool & open space. Max 2 dogs. Sleeps 10. Book direct from $700/night.',
  },
}

const faqItems = [
  {
    q: 'Is the Joshua Tree vacation rental dog friendly?',
    a: 'Yes — Owl & Hare at 8283 Via Rocosa, Joshua Tree, CA 92252 welcomes dogs. Maximum 2 dogs per stay. The property is a private gated compound, giving dogs space to move around safely. There is no additional pet fee listed, but confirm at time of booking.',
  },
  {
    q: 'Is Joshua Tree National Park dog friendly?',
    a: 'Dogs are allowed in Joshua Tree National Park but with restrictions: they must be kept on a leash no longer than 6 feet, are not allowed on trails, in wilderness areas, or in buildings. Dogs can be in developed areas (campgrounds, picnic areas, paved roads). Plan hikes for humans and leave dogs at the property or with a sitter. For current rules, check the National Park Service website at nps.gov/jotr.',
  },
  {
    q: 'What is the best dog-friendly vacation rental in Joshua Tree?',
    a: 'Owl & Hare at 8283 Via Rocosa is a 4-bedroom, 4-bathroom luxury compound that sleeps up to 10 guests and welcomes dogs (max 2). The gated compound gives dogs space to roam safely. It\'s 5 minutes from the West entrance of Joshua Tree National Park. From $700/night with direct booking.',
  },
  {
    q: 'How many dogs can I bring to the Joshua Tree rental?',
    a: 'Owl & Hare allows a maximum of 2 dogs per stay. Please confirm your pet policy and any applicable fees at the time of booking at fabvacayvibes.com/properties/owl-and-hare.',
  },
  {
    q: 'Are there dog-friendly things to do near Joshua Tree?',
    a: 'Yes — while dogs have limited access inside Joshua Tree National Park (leash required, no trails), the surrounding area has dog-friendly options including Pioneertown, downtown Joshua Tree shops and restaurants with outdoor seating, and open desert land outside park boundaries. A high chair is also available at Owl & Hare for families with young children traveling alongside pets.',
  },
  {
    q: 'Does the dog-friendly Joshua Tree rental have a pool?',
    a: 'Yes — Owl & Hare has a private pool, hot tub, sauna, and cold plunge. The pool and compound are exclusive to your group during your stay.',
  },
]

export default function DogFriendlyJoshuaTreePage() {
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
                '@id': 'https://fabvacayvibes.com/dog-friendly-joshua-tree',
                url: 'https://fabvacayvibes.com/dog-friendly-joshua-tree',
                name: 'Dog-Friendly Joshua Tree Vacation Rentals | Fab Vacay Vibes',
                isPartOf: { '@type': 'WebSite', url: 'https://fabvacayvibes.com' },
              },
              {
                '@type': 'VacationRental',
                name: 'Owl & Hare — Dog-Friendly Joshua Tree Luxury Compound',
                url: 'https://fabvacayvibes.com/properties/owl-and-hare',
                description: 'Dog-friendly luxury desert compound in Joshua Tree, CA. Private gated property with pool, hot tub, sauna, and open space. Max 2 dogs. Sleeps up to 10.',
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
                  'Gym', 'Pickleball Court', 'BBQ & Fire Pit', 'Gated Compound', 'Pet Friendly',
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
                  { '@type': 'ListItem', position: 2, name: 'Dog-Friendly Joshua Tree', item: 'https://fabvacayvibes.com/dog-friendly-joshua-tree' },
                ],
              },
            ],
          }),
        }}
      />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#1a100a 0%,#2d1505 50%,#1a0d1a 100%)', padding: '160px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(244,162,58,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 20 }}>Pet Friendly · Joshua Tree, CA</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 24 }}>
            Dog-Friendly Joshua Tree<br /><em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>Vacation Rentals</em>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40, maxWidth: 580, margin: '0 auto 40px' }}>
            A private gated desert compound in Joshua Tree — bring your dogs. Open space, a private pool, and the desert at your doorstep.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/properties/owl-and-hare" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, borderRadius: 2, textDecoration: 'none' }}>View Property &amp; Book</Link>
            <a href="#faq" style={{ border: '1px solid rgba(244,162,58,0.4)', color: 'var(--orange)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>Pet Policy FAQ</a>
          </div>
        </div>
      </section>

      {/* PET POLICY HIGHLIGHTS */}
      <section style={{ background: '#0d0620', padding: '60px 48px', borderBottom: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, textAlign: 'center' }}>
          {[
            { stat: '✓', label: 'Dogs Welcome' },
            { stat: '2', label: 'Max Dogs Per Stay' },
            { stat: 'Gated', label: 'Private Compound' },
            { stat: '5 min', label: 'To National Park' },
          ].map(({ stat, label }) => (
            <div key={label}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 300, color: 'var(--orange-warm)', marginBottom: 4 }}>{stat}</p>
              <p style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROPERTY */}
      <section style={{ padding: '100px 48px', background: '#100820', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>The Property</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'white', lineHeight: 1.2, marginBottom: 24 }}>
              Owl &amp; Hare — 8283 Via Rocosa<br />Joshua Tree, CA 92252
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.9, maxWidth: 680, marginBottom: 48 }}>
              Two stand-alone homes on one private gated compound. 4 bedrooms, 4 bathrooms, sleeps up to 10. The gated property gives your dogs safe outdoor space while you use the pool, hot tub, sauna, cold plunge, gym, pickleball court, and more. 5 minutes to Joshua Tree National Park (note: dogs have limited trail access inside the park — they are allowed in developed areas on leash). Pet friendly (max 2 dogs).
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/properties/owl-and-hare" style={{ display: 'inline-block', background: 'var(--orange)', color: 'var(--purple)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, textDecoration: 'none' }}>
                Check Availability →
              </Link>
              <Link href="/properties/owl-and-hare" style={{ display: 'inline-block', border: '1px solid rgba(244,162,58,0.4)', color: 'var(--orange)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>
                Full Amenities List
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '100px 48px', background: '#0d0620', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Pet Policy &amp; Questions</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 300, color: 'white', marginBottom: 48 }}>
              Dog-Friendly Joshua Tree FAQ
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
