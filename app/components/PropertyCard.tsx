import Link from 'next/link'
import { Property } from '../lib/properties'

export default function PropertyCard({ property, large = false }: { property: Property; large?: boolean }) {
  return (
    <Link
      href={`/properties/${property.slug}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'var(--purple-mid)',
        aspectRatio: large ? 'auto' : '3/4',
        minHeight: large ? 600 : undefined,
        display: 'block',
        textDecoration: 'none',
      }}
      className="group"
    >
      {/* Image */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${property.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)',
          transition: 'transform 0.7s ease',
        }}
        className="group-hover:scale-105"
      />
      {/* Overlay */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(30,15,69,0.95) 0%, rgba(30,15,69,0.2) 50%, transparent 100%)',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: 36,
          transition: 'background 0.4s',
        }}
      >
        <span style={{
          display: 'inline-block', fontSize: 9, letterSpacing: 3,
          textTransform: 'uppercase', color: 'var(--orange)',
          border: '1px solid rgba(244,162,58,0.4)', padding: '5px 12px',
          borderRadius: 1, marginBottom: 14, alignSelf: 'flex-start',
        }}>
          {property.emoji} {property.type} · {property.location}, {property.state}
        </span>

        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: large ? 42 : 32, fontWeight: 400, color: 'white', lineHeight: 1.1, marginBottom: 8 }}>
          {property.name}
        </h3>

        <p style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
          <span>{property.bedrooms} BR</span>
          <span>{property.bathrooms} BA</span>
          <span>Sleeps {property.sleepsMin}–{property.sleepsMax}</span>
        </p>

        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
          {property.shortDesc}
        </p>

        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: 'var(--orange-warm)', marginBottom: 16 }}>
          ${property.pricePerNight.toLocaleString()} <span style={{ fontFamily: 'DM Sans,sans-serif', fontSize: 11, color: 'var(--text-muted)' }}>/ night</span>
        </p>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
          color: 'var(--orange)',
        }}>
          View Property →
        </div>
      </div>
    </Link>
  )
}
