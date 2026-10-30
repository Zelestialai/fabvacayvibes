import Nav from '../components/Nav'
import RevealOnScroll from '../components/RevealOnScroll'
import Script from 'next/script'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Book Direct Vacation Rentals — Save Up to 15% | Fab Vacay Vibes',
  description: 'Book direct with Fab Vacay Vibes and save up to 15% vs Airbnb and VRBO. No platform fees. Best Price Guarantee. Three luxury vacation rentals: Clearwater FL, Joshua Tree CA, and near Yosemite CA. Direct owner communication and flexible check-in.',
  alternates: { canonical: 'https://fabvacayvibes.com/book-direct-vacation-rentals' },
  openGraph: {
    type: 'website',
    url: 'https://fabvacayvibes.com/book-direct-vacation-rentals',
    siteName: 'Fab Vacay Vibes',
    title: 'Book Direct Vacation Rentals — Save Up to 15% | Fab Vacay Vibes',
    description: 'Skip Airbnb and VRBO fees. Book direct and save up to 15%. Best Price Guarantee. Three luxury properties across FL and CA.',
  },
}

const properties = [
  {
    name: 'Casa Grandè',
    location: 'Clearwater, FL',
    slug: 'casa-grande',
    bedrooms: 5, bathrooms: 3, sleeps: 16,
    price: '$500',
    desc: 'Luxury beach home with private pool. 4 miles to Clearwater Beach. Pet friendly.',
  },
  {
    name: 'Owl & Hare',
    location: 'Joshua Tree, CA',
    slug: 'owl-and-hare',
    bedrooms: 4, bathrooms: 4, sleeps: 10,
    price: '$700',
    desc: 'Desert wellness compound — pool, sauna, cold plunge, gym, pickleball & more. 5 min to Joshua Tree National Park.',
  },
  {
    name: 'Sierra Crest Haven',
    location: 'Oakhurst, CA (Near Yosemite)',
    slug: 'sierra-crest-haven',
    bedrooms: 7, bathrooms: 3, sleeps: 16,
    sqft: 4800,
    price: '$945',
    desc: '4,800 sq ft mountain estate. Hot tub, fireplace, game room, full bar. 14 miles to Yosemite.',
  },
]

const faqItems = [
  {
    q: 'How much do I save booking directly vs Airbnb or VRBO?',
    a: 'Booking directly with Fab Vacay Vibes saves you up to 15% by eliminating OTA platform fees. On a typical multi-night group stay, this can represent hundreds of dollars. All three properties — Casa Grandè in Clearwater FL, Owl & Hare in Joshua Tree CA, and Sierra Crest Haven near Yosemite CA — are available for direct booking at fabvacayvibes.com.',
  },
  {
    q: 'Is it safe to book a vacation rental directly without Airbnb?',
    a: 'Yes — Fab Vacay Vibes uses OwnerRez, a professional vacation rental management platform, to process all bookings. Our booking system handles payment processing, rental agreements, and guest communication through a secure channel. You\'re booking with a verified property owner, not an unknown host. We\'ve hosted hundreds of guests across our three properties.',
  },
  {
    q: 'What is the Best Price Guarantee?',
    a: 'We guarantee that the price you see at fabvacayvibes.com is the best price available for any of our three properties. If you find a lower price for the same property, same dates, and same guest count on Airbnb, VRBO, or any other platform, we\'ll match or beat it.',
  },
  {
    q: 'What are the benefits of booking direct vs through Airbnb?',
    a: 'Direct booking benefits include: up to 15% savings on platform fees, direct communication with the property owner, Best Price Guarantee, more flexible check-in/check-out policies, and no risk of the listing being removed or suspended between booking and check-in. You also have a direct point of contact if anything comes up during your stay.',
  },
  {
    q: 'Which Fab Vacay Vibes properties are available for direct booking?',
    a: 'All three properties are available for direct booking: Casa Grandè in Clearwater FL (fabvacayvibes.com/properties/casa-grande), Owl & Hare in Joshua Tree CA (fabvacayvibes.com/properties/owl-and-hare), and Sierra Crest Haven near Yosemite CA (fabvacayvibes.com/properties/sierra-crest-haven).',
  },
  {
    q: 'How do I contact Fab Vacay Vibes to book directly?',
    a: 'Visit fabvacayvibes.com and select your property to check availability and book online. You can also email FabVacayVibes@gmail.com or call (727) 386-9642 to speak directly with the owner.',
  },
]

const reasons = [
  { title: 'Save Up to 15%', desc: 'Airbnb and VRBO charge guests 14–16% in service fees on top of the nightly rate. Booking direct eliminates those fees entirely.' },
  { title: 'Best Price Guarantee', desc: 'We guarantee the best price for your dates. Show us a lower price on any OTA and we\'ll beat it.' },
  { title: 'Direct Owner Communication', desc: 'Talk directly to the property owner — not a platform algorithm. Faster responses, real flexibility, human answers.' },
  { title: 'Flexible Policies', desc: 'More flexibility on check-in/check-out times, early arrivals, and special requests when you\'re dealing with the owner directly.' },
  { title: 'Secure Booking', desc: 'Powered by OwnerRez — a professional STR booking platform used by thousands of property managers. Secure payments, rental agreements, and guest protection.' },
  { title: 'No Listing Cancellation Risk', desc: 'OTA listings can be suspended or altered before your trip. Direct booking relationships don\'t have this risk.' },
]

export default function BookDirectVacationRentalsPage() {
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
                '@id': 'https://fabvacayvibes.com/book-direct-vacation-rentals',
                url: 'https://fabvacayvibes.com/book-direct-vacation-rentals',
                name: 'Book Direct Vacation Rentals — Save Up to 15% | Fab Vacay Vibes',
                description: 'Book direct with Fab Vacay Vibes and save up to 15% vs Airbnb and VRBO. Three luxury vacation rentals in FL and CA.',
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
                  { '@type': 'ListItem', position: 2, name: 'Book Direct Vacation Rentals', item: 'https://fabvacayvibes.com/book-direct-vacation-rentals' },
                ],
              },
            ],
          }),
        }}
      />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#2D1B69 0%,#1a0d3d 60%,#2d1505 100%)', padding: '160px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(244,162,58,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 20 }}>Skip the OTA Fees</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 24 }}>
            Book Direct.<br /><em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>Save Up to 15%.</em>
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40, maxWidth: 580, margin: '0 auto 40px' }}>
            Stop paying Airbnb and VRBO platform fees. Book directly with Fab Vacay Vibes and get the best price, every time.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#properties" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, borderRadius: 2, textDecoration: 'none' }}>Browse Properties</a>
            <a href="#why-direct" style={{ border: '1px solid rgba(244,162,58,0.4)', color: 'var(--orange)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>Why Book Direct</a>
          </div>
        </div>
      </section>

      {/* WHY DIRECT */}
      <section id="why-direct" style={{ padding: '100px 48px', background: '#100820', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Why Direct Booking Wins</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'white', marginBottom: 64 }}>
              6 Reasons to Skip the OTAs
            </h2>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
            {reasons.map(({ title, desc }) => (
              <RevealOnScroll key={title}>
                <div style={{ background: 'rgba(244,162,58,0.03)', border: '1px solid rgba(244,162,58,0.1)', padding: '36px 32px' }}>
                  <p style={{ fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--orange-warm)', marginBottom: 12 }}>{title}</p>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>{desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* PROPERTIES */}
      <section id="properties" style={{ padding: '100px 48px', background: '#0d0620', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Our Properties</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'white', marginBottom: 64 }}>
              Three Luxury Properties. All Direct Booking.
            </h2>
          </RevealOnScroll>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {properties.map(p => (
              <RevealOnScroll key={p.slug}>
                <div style={{ background: 'rgba(244,162,58,0.03)', border: '1px solid rgba(244,162,58,0.1)', padding: '40px 48px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 4 }}>{p.location}</p>
                      <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 300, color: 'white', marginBottom: 8 }}>{p.name}</h3>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 20 }}>{p.desc}</p>
                      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 24 }}>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{p.bedrooms} BR / {p.bathrooms} BA</span>
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Sleeps {p.sleeps}</span>
                        <span style={{ fontSize: 12, color: 'var(--orange)' }}>From {p.price}/night</span>
                      </div>
                      <Link href={`/properties/${p.slug}`} style={{ display: 'inline-block', background: 'var(--orange)', color: 'var(--purple)', padding: '12px 24px', fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, textDecoration: 'none' }}>
                        Book Direct →
                      </Link>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, fontWeight: 300, color: 'var(--orange-warm)', lineHeight: 1 }}>{p.price}</p>
                      <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)' }}>From / Night</p>
                    </div>
                  </div>
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
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Direct Booking Questions</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 300, color: 'white', marginBottom: 48 }}>
              Book Direct FAQ
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
