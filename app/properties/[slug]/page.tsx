import { notFound } from 'next/navigation'
import Script from 'next/script'
import { properties } from '../../lib/properties'
import Nav from '../../components/Nav'
import BookingFlow from '../../components/BookingFlow'
import InquiryForm from '../../components/InquiryForm'
import AvailabilityCalendar from '../../components/AvailabilityCalendar'
import PhotoGallery from '../../components/PhotoGallery'
import ExpandableDescription from '../../components/ExpandableDescription'
import PropertyAnalytics from '../../components/PropertyAnalytics'

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

// Fetch synced OwnerRez data from Blob
async function getSyncedData(slug: string) {
  try {
    const res = await fetch(
      `https://ffxdvjgwnh5dbwtv.public.blob.vercel-storage.com/content/sync/${slug}.json`,
      { next: { revalidate: 3600 } } // cache 1 hour
    )
    if (res.ok) return await res.json()
  } catch {}
  return null
}

// Fetch custom description from Blob if available
async function getCustomDescription(slug: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://ffxdvjgwnh5dbwtv.public.blob.vercel-storage.com/content/descriptions/${slug}.txt`,
      { next: { revalidate: 300 } } // cache 5 mins
    )
    if (res.ok) {
      const text = await res.text()
      return text.trim() || null
    }
  } catch {}
  return null
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

export default async function PropertyPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params
  const sp = await searchParams
  const initialDates = {
    arrival: typeof sp.arrival === 'string' ? sp.arrival : undefined,
    departure: typeof sp.departure === 'string' ? sp.departure : undefined,
    adults: typeof sp.adults === 'string' ? parseInt(sp.adults) : undefined,
    children: typeof sp.children === 'string' ? parseInt(sp.children) : undefined,
  }
  const property = properties.find(p => p.slug === slug)
  if (!property) notFound()

  const [bookedDates, customDescription, syncedData] = await Promise.all([
    getBookedDates(slug),
    getCustomDescription(slug),
    getSyncedData(slug),
  ])

  // Merge synced OwnerRez data with local property data (synced takes priority)
  const mergedProperty = {
    ...property,
    bedrooms: syncedData?.bedrooms ?? property.bedrooms,
    bathrooms: syncedData?.bathrooms ?? property.bathrooms,
    sleepsMax: syncedData?.max_guests ?? property.sleepsMax,
    squareFeet: syncedData?.living_area ?? property.squareFeet,
    checkIn: syncedData?.check_in ? syncedData.check_in.replace(':00', '').replace('16', '4:00 PM').replace('15', '3:00 PM') : property.checkIn,
    checkOut: syncedData?.check_out ? syncedData.check_out.replace(':00', '').replace('11', '11:00 AM').replace('10', '10:00 AM') : property.checkOut,
  }
  const bookedSet = new Set(bookedDates)

  return (
    <>
      <Nav />
      {/* GA4: view_item fires once per property page load */}
      <PropertyAnalytics
        propertySlug={property.slug}
        propertyName={property.name}
        pricePerNight={property.pricePerNight}
      />

      <Script
        id={`property-schema-${property.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'VacationRental',
          '@id': `https://fabvacayvibes.com/properties/${property.slug}#vacationrental`,
          name: property.name,
          description: property.description,
          url: `https://fabvacayvibes.com/properties/${property.slug}`,
          image: property.photos?.slice(0, 5) || [property.imageUrl],
          telephone: '+17273869642',
          priceRange: `From $${property.pricePerNight.toLocaleString()}/night`,
          petsAllowed: property.petsAllowed ?? false,
          checkinTime: '16:00:00',
          checkoutTime: property.checkOut?.includes('10') ? '10:00:00' : '11:00:00',
          address: {
            '@type': 'PostalAddress',
            streetAddress: property.address?.split(',')[0] || '',
            addressLocality: property.location,
            addressRegion: property.state,
            postalCode: property.address?.match(/\d{5}/)?.[0] || '',
            addressCountry: 'US',
          },
          ...(property.latitude && property.longitude ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: property.latitude,
              longitude: property.longitude,
            }
          } : {}),
          containsPlace: {
            '@type': 'Accommodation',
            additionalType: 'EntirePlace',
            numberOfBedrooms: mergedProperty.bedrooms,
            numberOfBathroomsTotal: mergedProperty.bathrooms,
            occupancy: {
              '@type': 'QuantitativeValue',
              value: mergedProperty.sleepsMax,
            },
            ...(mergedProperty.squareFeet ? {
              floorSize: {
                '@type': 'QuantitativeValue',
                value: mergedProperty.squareFeet,
                unitCode: 'FTK',
              }
            } : {}),
            amenityFeature: property.amenities.map(a => ({
              '@type': 'LocationFeatureSpecification',
              name: a,
              value: true,
            })),
          },
          brand: {
            '@type': 'Brand',
            name: 'Fab Vacay Vibes',
            url: 'https://fabvacayvibes.com',
          },
        }) }}
      />

      {/* HERO */}
      <section style={{ position: 'relative', height: '70vh', overflow: 'hidden', minHeight: 500 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${property.photos?.[0] || property.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.55)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30,15,69,0.95) 0%, rgba(30,15,69,0.2) 60%, transparent 100%)' }} />
        <div className="hero-text-pad" style={{ position: 'absolute', left: 0, right: 0, maxWidth: 900 }}>
          <span style={{ display: 'inline-block', fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--orange)', border: '1px solid rgba(244,162,58,0.4)', padding: '5px 12px', borderRadius: 1, marginBottom: 16 }}>
            {property.emoji} {property.type} · {property.location}, {property.state}
          </span>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(42px,6vw,80px)', fontWeight: 300, color: 'white', lineHeight: 1, marginBottom: 16 }}>
            {property.name}
          </h1>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
            <span>{mergedProperty.bedrooms} Bedrooms</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{mergedProperty.bathrooms} Bathrooms</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>Sleeps {mergedProperty.sleepsMax}</span>
            {mergedProperty.squareFeet && <><span style={{ opacity: 0.4 }}>·</span><span>{mergedProperty.squareFeet.toLocaleString()} sq ft</span></>}
            {syncedData?.syncedAt && <><span style={{ opacity: 0.4 }}>·</span><span style={{ fontSize: 10, opacity: 0.4 }}>Updated {new Date(syncedData.syncedAt).toLocaleDateString()}</span></>}
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
            <ExpandableDescription description={customDescription || property.description} />

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
                { label: 'Check-in', value: mergedProperty.checkIn || '4:00 PM' },
                { label: 'Check-out', value: mergedProperty.checkOut || '11:00 AM' },
                { label: 'Bedrooms', value: String(mergedProperty.bedrooms) },
                { label: 'Bathrooms', value: String(mergedProperty.bathrooms) },
                { label: 'Max Guests', value: String(mergedProperty.sleepsMax) },
                ...(mergedProperty.squareFeet ? [{ label: 'Living Area', value: `${mergedProperty.squareFeet.toLocaleString()} sq ft` }] : []),
                ...(property.address ? [{ label: 'Address', value: property.address }] : []),
                { label: 'Pets', value: syncedData?.max_pets > 0 ? `Allowed (max ${syncedData.max_pets})` : property.amenities.includes('Pet Friendly') ? 'Allowed (max 2)' : 'Not Allowed' },
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
              initialDates={initialDates}
            />
            <div style={{ marginTop: 16, padding: 24, background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.1)', borderRadius: 4, textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>Questions? Contact us directly</p>
              <a href="tel:7273869642" style={{ fontSize: 16, color: 'var(--orange)', textDecoration: 'none', fontFamily: "'Cormorant Garamond',serif" }}>(727) 386-9642</a>
            </div>
            <InquiryForm propertySlug={property.slug} propertyName={property.name} />
          </div>
        </div>
      </section>

      {/* OWL & HARE FAQ */}
      {property.slug === 'owl-and-hare' && (
        <>
          <Script
            id="owl-and-hare-faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: [
                {
                  '@type': 'Question',
                  name: 'What makes Owl & Hare different from other Joshua Tree vacation rentals?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Owl & Hare is a private gated compound of two stand-alone homes — not a single house divided into units. Groups get full compound privacy while each home offers its own space, sleeping a total of 10 guests across 4 bedrooms and 4 bathrooms. The wellness and recreation amenities are unusually extensive for Joshua Tree: private pool, hot tub, sauna, cold plunge, LED therapy room, gym, pickleball court, mini golf, bocce ball, ping pong, pool table, and arcade machines, all on one property.' },
                },
                {
                  '@type': 'Question',
                  name: 'Is Owl & Hare good for a group wellness retreat?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes. The property is designed for group wellness stays. On-site facilities include a traditional sauna, cold plunge, LED therapy room, and gym alongside a private pool and hot tub. The two-home compound format means groups can gather or retreat individually. Joshua Tree\'s desert environment — altitude, silence, and dark skies — complements any structured wellness program. The property is 5 minutes from Joshua Tree National Park for hiking and outdoor activities.' },
                },
                {
                  '@type': 'Question',
                  name: 'What wellness amenities does Owl & Hare have?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Owl & Hare\'s wellness amenities include: private pool, hot tub, traditional sauna, cold plunge, LED therapy room, and a gym. These are all on-site at the compound.' },
                },
                {
                  '@type': 'Question',
                  name: 'Does Owl & Hare have a cold plunge?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes, Owl & Hare has a cold plunge on-site at the compound.' },
                },
                {
                  '@type': 'Question',
                  name: 'Is there a sauna at Owl & Hare?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes, Owl & Hare has a traditional sauna on-site at the compound.' },
                },
                {
                  '@type': 'Question',
                  name: 'What sports and recreation is available at Owl & Hare?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Owl & Hare has a pickleball court, mini golf, bocce ball, ping pong table, pool table, and arcade machines — all on the property. There is also a private pool, hot tub, BBQ, and fire pit. Joshua Tree National Park is 5 minutes away for hiking and climbing.' },
                },
                {
                  '@type': 'Question',
                  name: 'How many people does Owl & Hare sleep?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Owl & Hare sleeps up to 10 guests across 4 bedrooms and 4 bathrooms in two stand-alone homes on one compound.' },
                },
                {
                  '@type': 'Question',
                  name: 'Are dogs allowed at Owl & Hare?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes, Owl & Hare is pet friendly. Dogs are welcome, with a maximum of 2 dogs per stay.' },
                },
                {
                  '@type': 'Question',
                  name: 'How far is Owl & Hare from Joshua Tree National Park?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Owl & Hare is approximately a 5-minute drive from the Joshua Tree National Park west entrance. Downtown Joshua Tree is also about 5 minutes away. Pappy & Harriet\'s Pioneertown Palace is approximately 25 minutes away.' },
                },
                {
                  '@type': 'Question',
                  name: 'Does Owl & Hare have a private pool?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes, Owl & Hare has a private pool on the compound, along with a hot tub.' },
                },
                {
                  '@type': 'Question',
                  name: 'Can you host a private group retreat at Owl & Hare?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Yes. Owl & Hare is a gated private compound that sleeps up to 10 guests. The two-home layout gives groups both shared gathering space and private retreat space. On-site wellness facilities (sauna, cold plunge, LED therapy room, gym, pool, hot tub) and recreation (pickleball, mini golf, bocce ball, arcade) support multi-day group programming. Book directly at fabvacayvibes.com/properties/owl-and-hare.' },
                },
                {
                  '@type': 'Question',
                  name: 'What is the two-home compound setup at Owl & Hare?',
                  acceptedAnswer: { '@type': 'Answer', text: 'Owl & Hare consists of two separate stand-alone homes on one gated desert compound at 8283 Via Rocosa, Joshua Tree, CA 92252. The homes share the compound\'s amenities — pool, hot tub, sauna, cold plunge, pickleball court, and all recreation facilities — while each home functions independently. Total capacity is 10 guests across 4 bedrooms and 4 bathrooms. The compound is fully private and gated.' },
                },
              ],
            }) }}
          />
          <section className="section-pad-sm" style={{ borderTop: '1px solid rgba(244,162,58,0.1)', maxWidth: 900, margin: '0 auto' }}>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>FAQ</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, fontWeight: 300, color: 'white', marginBottom: 40 }}>Frequently Asked Questions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { q: 'What makes Owl & Hare different from other Joshua Tree vacation rentals?', a: 'Owl & Hare is a private gated compound of two stand-alone homes — not a single house divided into units. Groups get full compound privacy while each home offers its own space, sleeping a total of 10 guests across 4 bedrooms and 4 bathrooms. The wellness and recreation amenities are unusually extensive for Joshua Tree: private pool, hot tub, sauna, cold plunge, LED therapy room, gym, pickleball court, mini golf, bocce ball, ping pong, pool table, and arcade machines, all on one property.' },
                { q: 'Is Owl & Hare good for a group wellness retreat?', a: "Yes. The property is designed for group wellness stays. On-site facilities include a traditional sauna, cold plunge, LED therapy room, and gym alongside a private pool and hot tub. The two-home compound format means groups can gather or retreat individually. Joshua Tree's desert environment — altitude, silence, and dark skies — complements any structured wellness program. The property is 5 minutes from Joshua Tree National Park for hiking and outdoor activities." },
                { q: 'What wellness amenities does Owl & Hare have?', a: "Owl & Hare's wellness amenities include: private pool, hot tub, traditional sauna, cold plunge, LED therapy room, and a gym. These are all on-site at the compound." },
                { q: 'Does Owl & Hare have a cold plunge?', a: 'Yes, Owl & Hare has a cold plunge on-site at the compound.' },
                { q: 'Is there a sauna at Owl & Hare?', a: 'Yes, Owl & Hare has a traditional sauna on-site at the compound.' },
                { q: 'What sports and recreation is available at Owl & Hare?', a: 'Owl & Hare has a pickleball court, mini golf, bocce ball, ping pong table, pool table, and arcade machines — all on the property. There is also a private pool, hot tub, BBQ, and fire pit. Joshua Tree National Park is 5 minutes away for hiking and climbing.' },
                { q: 'How many people does Owl & Hare sleep?', a: 'Owl & Hare sleeps up to 10 guests across 4 bedrooms and 4 bathrooms in two stand-alone homes on one compound.' },
                { q: 'Are dogs allowed at Owl & Hare?', a: 'Yes, Owl & Hare is pet friendly. Dogs are welcome, with a maximum of 2 dogs per stay.' },
                { q: 'How far is Owl & Hare from Joshua Tree National Park?', a: "Owl & Hare is approximately a 5-minute drive from the Joshua Tree National Park west entrance. Downtown Joshua Tree is also about 5 minutes away. Pappy & Harriet's Pioneertown Palace is approximately 25 minutes away." },
                { q: 'Does Owl & Hare have a private pool?', a: 'Yes, Owl & Hare has a private pool on the compound, along with a hot tub.' },
                { q: 'Can you host a private group retreat at Owl & Hare?', a: 'Yes. Owl & Hare is a gated private compound that sleeps up to 10 guests. The two-home layout gives groups both shared gathering space and private retreat space. On-site wellness facilities (sauna, cold plunge, LED therapy room, gym, pool, hot tub) and recreation (pickleball, mini golf, bocce ball, arcade) support multi-day group programming. Book directly at fabvacayvibes.com/properties/owl-and-hare.' },
                { q: 'What is the two-home compound setup at Owl & Hare?', a: "Owl & Hare consists of two separate stand-alone homes on one gated desert compound at 8283 Via Rocosa, Joshua Tree, CA 92252. The homes share the compound's amenities — pool, hot tub, sauna, cold plunge, pickleball court, and all recreation facilities — while each home functions independently. Total capacity is 10 guests across 4 bedrooms and 4 bathrooms. The compound is fully private and gated." },
              ].map(({ q, a }, i) => (
                <details key={i} style={{ borderBottom: '1px solid rgba(244,162,58,0.1)', padding: '0' }}>
                  <summary style={{ padding: '20px 0', fontSize: 15, color: 'var(--cream)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                    <span>{q}</span>
                    <span style={{ color: 'var(--orange)', fontSize: 20, flexShrink: 0, fontWeight: 300 }}>+</span>
                  </summary>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8, paddingBottom: 20, marginTop: 0 }}>{a}</p>
                </details>
              ))}
            </div>
          </section>
        </>
      )}

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
