import { notFound } from 'next/navigation'
import Script from 'next/script'
import { properties } from '../../lib/properties'
import Nav from '../../components/Nav'
import BookingFlow from '../../components/BookingFlow'
import InquiryForm from '../../components/InquiryForm'
import AvailabilityCalendar from '../../components/AvailabilityCalendar'
import PhotoGallery from '../../components/PhotoGallery'

export async function generateStaticParams() {
  return properties.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = properties.find(p => p.slug === slug)
  if (!property) return {}

  const BASE = 'https://fabvacayvibes.com'
  const url = `${BASE}/properties/${property.slug}`
  const locationStr = `${property.location}, ${property.state}`
  const title = `${property.name} — Luxury ${property.type} Vacation Rental in ${locationStr} | Fab Vacay Vibes`
  const description = `Book ${property.name}, a luxury ${property.bedrooms}-bedroom vacation rental in ${locationStr}. ${property.shortDesc} Sleeps ${property.sleepsMin}-${property.sleepsMax} guests from ${property.pricePerNight.toLocaleString()}/night. Book direct and save up to 15% vs Airbnb.`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title,
      description,
      siteName: 'Fab Vacay Vibes',
      images: [{ url: property.imageUrl, width: 1200, height: 800, alt: property.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [property.imageUrl],
    },
  }
}

// Fetch booked dates server-side for initial render
async function getBookedDates(slug: string): Promise<string[]> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/availability?property=${slug}`, {
      next: { revalidate: 300 }
    })
    if (!res.ok) return []
    const data = await res.json()
    return data.bookedDates || []
  } catch {
    return []
  }
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const property = properties.find(p => p.slug === slug)
  if (!property) notFound()

  const bookedDates = await getBookedDates(slug)
  const bookedSet = new Set(bookedDates)

  return (
    <>
      <Nav />

      <Script
        id={`property-schema-${property.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'VacationRental',
          name: property.name,
          description: property.description,
          url: `https://fabvacayvibes.com/properties/${property.slug}`,
          image: property.photos?.slice(0, 5).map(p => `https://fabvacayvibes.com${p}`) || [property.imageUrl],
          telephone: '+17273869642',
          priceRange: `$${property.pricePerNight.toLocaleString()} per night`,
          address: {
            '@type': 'PostalAddress',
            addressLocality: property.location,
            addressRegion: property.state,
            addressCountry: 'US',
          },
          amenityFeature: property.amenities.map(a => ({
            '@type': 'LocationFeatureSpecification',
            name: a,
            value: true,
          })),
          numberOfRooms: property.bedrooms,
          occupancy: {
            '@type': 'QuantitativeValue',
            minValue: property.sleepsMin,
            maxValue: property.sleepsMax,
          },
          starRating: { '@type': 'Rating', ratingValue: '5' },
        }) }}
      />

      {/* HERO */}
      <section style={{ position: 'relative', height: '70vh', overflow: 'hidden', minHeight: 500 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${property.photos?.[0] ? encodeURIComponent(property.photos[0]).replace(/%2F/g, '/') : property.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.55)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30,15,69,0.95) 0%, rgba(30,15,69,0.2) 60%, transparent 100%)' }} />
        <div className="hero-text-pad" style={{ position: 'absolute', left: 0, right: 0, maxWidth: 900 }}>
          <span style={{ display: 'inline-block', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--orange)', border: '1px solid rgba(244,162,58,0.4)', padding: '5px 12px', borderRadius: 1, marginBottom: 16 }}>
            {property.emoji} {property.type} · {property.location}, {property.state}
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(42px,6vw,80px)', fontWeight: 300, color: 'white', lineHeight: 1, marginBottom: 16 }}>
            {property.name}
          </h1>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span>{property.bedrooms} Bedrooms</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{property.bathrooms} Bathrooms</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Sleeps {property.sleepsMax}</span>
            {property.squareFeet && <><span style={{ opacity: 0.4 }}>·</span><span>{property.squareFeet.toLocaleString()} sq ft</span></>}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="section-pad-sm" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="property-layout">

          {/* LEFT */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid rgba(244,162,58,0.15)' }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, color: 'var(--orange-warm)', fontWeight: 300 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>from </span>${property.pricePerNight.toLocaleString()}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>/ night</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--orange)', letterSpacing: 2, textTransform: 'uppercase', border: '1px solid rgba(244,162,58,0.3)', padding: '6px 14px', borderRadius: 2 }}>
                Book Direct & Save
              </span>
            </div>

            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>About This Property</p>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, lineHeight: 1.7, color: 'var(--cream)', marginBottom: 40 }}>
              {property.description}
            </p>

            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 20 }}>Highlights</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 40 }}>
              {property.highlights.map(h => (
                <div key={h} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange)', flexShrink: 0 }} />
                  <span style={{ fontSize: 15, color: 'var(--cream)' }}>{h}</span>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 20 }}>Amenities</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 48 }}>
              {property.amenities.map(a => (
                <span key={a} style={{ fontSize: 12, letterSpacing: 1, color: 'var(--cream)', border: '1px solid rgba(244,162,58,0.2)', padding: '8px 16px', borderRadius: 2, background: 'rgba(253,246,236,0.03)' }}>{a}</span>
              ))}
            </div>

            {/* Property Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0, marginBottom: 48, border: '1px solid rgba(244,162,58,0.12)' }}>
              {[
                { label: 'Check-in', value: property.checkIn || '4:00 PM' },
                { label: 'Check-out', value: property.checkOut || '11:00 AM' },
                { label: 'Bedrooms', value: String(property.bedrooms) },
                { label: 'Bathrooms', value: String(property.bathrooms) },
                { label: 'Max Guests', value: String(property.sleepsMax) },
                ...(property.squareFeet ? [{ label: 'Living Area', value: `${property.squareFeet.toLocaleString()} sq ft` }] : []),
                ...(property.address ? [{ label: 'Address', value: property.address }] : []),
                { label: 'Pets', value: property.amenities.includes('Pet Friendly') ? 'Allowed (max 2)' : 'Not Allowed' },
              ].map(({ label, value }) => (
                <div key={label} style={{ padding: '20px 24px', borderBottom: '1px solid rgba(244,162,58,0.08)', borderRight: '1px solid rgba(244,162,58,0.08)' }}>
                  <p style={{ fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 6 }}>{label}</p>
                  <p style={{ fontSize: 14, color: 'var(--cream)' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Photo Gallery */}
            <PhotoGallery photos={property.photos} propertyName={property.name} />

            {/* Availability Calendar (visual reference) */}
            <AvailabilityCalendar propertySlug={property.slug} propertyName={property.name} bookingUrl={property.ownerrezUrl} />
          </div>

          {/* RIGHT: Booking Flow */}
          <div id="booking" style={{ position: 'sticky', top: 100, alignSelf: 'start' }}>
            <BookingFlow
              propertySlug={property.slug}
              propertyName={property.name}
              bookedDates={bookedSet}
            />
            <div style={{ marginTop: 16, padding: 24, background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.1)', borderRadius: 4, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Questions? Contact us directly</p>
              <a href="tel:7273869642" style={{ fontSize: 16, color: 'var(--orange)', textDecoration: 'none', fontFamily: "'Cormorant Garamond',serif" }}>(727) 386-9642</a>
            </div>
            <InquiryForm propertySlug={property.slug} propertyName={property.name} />
          </div>
        </div>
      </section>

      {/* OTHER PROPERTIES */}
      <section className="section-pad-sm" style={{ borderTop: '1px solid rgba(244,162,58,0.1)' }}>
        <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Explore More</p>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 300, color: 'white', marginBottom: 40 }}>Other properties you may love</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 2 }}>
          {properties.filter(p => p.slug !== property.slug).map(p => (
            <a key={p.slug} href={`/properties/${p.slug}`} style={{ textDecoration: 'none', position: 'relative', overflow: 'hidden', display: 'block', aspectRatio: '4/3' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${p.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.6)' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30,15,69,0.9) 0%, transparent 60%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 28 }}>
                <span style={{ fontSize: 10, letterSpacing: 2, color: 'var(--orange)', textTransform: 'uppercase', marginBottom: 8 }}>{p.emoji} {p.type}</span>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: 'white', fontWeight: 400, marginBottom: 4 }}>{p.name}</h3>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{p.location}, {p.state}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
