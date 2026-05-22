'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

interface Comparable {
  listing_info: { listing_id: number; listing_name: string; cover_photo_url: string }
  location_info: { locality: string; region: string }
  property_details: { bedrooms: number; baths: number; guests: number }
  performance_metrics: { ttm_revenue: number; ttm_occupancy: number; ttm_avg_rate: number }
  ratings: { rating_overall: number; num_reviews: number }
  booking_settings: { min_nights: number }
}

interface Result {
  address: string
  estimate: Record<string, unknown>
  comparables: Comparable[] | null
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '14px 16px',
  background: 'rgba(253,246,236,0.05)',
  border: '1px solid rgba(244,162,58,0.25)',
  borderRadius: 2, color: '#FDF6EC',
  fontFamily: 'DM Sans, sans-serif', fontSize: 14,
  outline: 'none', boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: 10, letterSpacing: 2, textTransform: 'uppercase',
  color: '#F4A23A', marginBottom: 6, display: 'block',
}

export default function RentAnalyzerForm() {
  const [form, setForm] = useState({ address: '', bedrooms: '3', bathrooms: '2', guests: '6' })
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<{description: string; place_id: string}[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const fetchSuggestions = (value: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (value.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/api/places-autocomplete?input=' + encodeURIComponent(value))
        const data = await res.json()
        const results = data.suggestions || []
        setSuggestions(results)
        setShowSuggestions(results.length > 0)
      } catch (err) {
        console.error('Autocomplete error:', err)
      }
    }, 300)
  }

  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('')
  const [selectedCoords, setSelectedCoords] = useState<{lat: number; lng: number} | null>(null)

  const selectSuggestion = (description: string, placeId: string, lat?: number, lng?: number) => {
    setForm(f => ({ ...f, address: description }))
    setSelectedPlaceId(placeId)
    setSelectedCoords(lat && lng ? { lat, lng } : null)
    setSuggestions([])
    setShowSuggestions(false)
  }
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const analyze = async () => {
    if (!form.address.trim()) { setError('Please enter a property address'); return }
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/rent-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, placeId: selectedPlaceId, lat: selectedCoords?.lat, lng: selectedCoords?.lng }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to analyze')
      setResult(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const est = result?.estimate as Record<string, unknown> | undefined
  const finalAnnual = est?.revenue as number | undefined
  const occupancy = est?.occupancy as number | undefined
  const adr = est?.average_daily_rate as number | undefined
  const percentiles = est?.percentiles as Record<string, {avg: number; p25: number; p50: number; p75: number; p90: number}> | undefined
  const monthlyDist = est?.monthly_revenue_distributions as number[] | undefined
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

  return (
    <div style={{ background: '#1E0F45', minHeight: '100vh' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg,#2D1B69 0%,#1E0F45 60%,#3d1a0a 100%)', padding: '140px 48px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(244,162,58,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: '#F4A23A', marginBottom: 20 }}>Free Tool</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 20 }}>
            Short-Term Rental <em style={{ color: '#F7C05A', fontStyle: 'italic' }}>Revenue Estimator</em>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(253,246,236,0.6)', lineHeight: 1.8 }}>
            Enter any US property address to instantly see your estimated annual revenue, occupancy rate, nightly rate — and real comparable listings nearby.
          </p>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '60px 24px', maxWidth: 780, margin: '0 auto', overflow: 'visible' }}>
        <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.15)', borderRadius: 4, padding: '40px 40px 32px', overflow: 'visible' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Property Address *</label>
            <div ref={wrapperRef} style={{ position: 'relative' }}>
              <input
                value={form.address}
                onChange={e => { set('address')(e); setSelectedPlaceId(''); setSelectedCoords(null); fetchSuggestions(e.target.value) }}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                placeholder="e.g. 123 Main St, Clearwater, FL"
                style={inputStyle}
                onKeyDown={e => e.key === 'Enter' && !showSuggestions && analyze()}
                autoComplete="off"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
                  background: '#1a0d3d', border: '1px solid rgba(244,162,58,0.3)',
                  borderTop: 'none', borderRadius: '0 0 4px 4px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                }}>
                  {suggestions.map((s: {description: string; place_id: string; lat?: number; lng?: number}, i: number) => (
                    <button
                      key={s.place_id}
                      onMouseDown={() => selectSuggestion(s.description, s.place_id, s.lat, s.lng)}
                      style={{
                        display: 'block', width: '100%', textAlign: 'left',
                        padding: '12px 16px', background: 'transparent', border: 'none',
                        borderBottom: i < suggestions.length - 1 ? '1px solid rgba(244,162,58,0.08)' : 'none',
                        color: '#FDF6EC', fontSize: 13, cursor: 'pointer',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(244,162,58,0.1)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <span style={{ color: '#F4A23A', marginRight: 8 }}>📍</span>
                      {s.description}
                    </button>
                  ))}
                  <div style={{ padding: '5px 16px', background: 'rgba(0,0,0,0.2)', textAlign: 'right' }}>
                    <span style={{ fontSize: 10, color: 'rgba(253,246,236,0.3)', letterSpacing: 1 }}>Powered by Google</span>
                  </div>
                </div>
              )}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(253,246,236,0.35)', marginTop: 6 }}>
              Enter an address, city, or zip code
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))', gap: 16, marginBottom: 28 }}>
            <div>
              <label style={labelStyle}>Bedrooms</label>
              <select value={form.bedrooms} onChange={set('bedrooms')} style={{ ...inputStyle, cursor: 'pointer' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n} style={{ background: '#1E0F45' }}>{n} BR</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Bathrooms</label>
              <select value={form.bathrooms} onChange={set('bathrooms')} style={{ ...inputStyle, cursor: 'pointer' }}>
                {[1,1.5,2,2.5,3,3.5,4,4.5,5].map(n => <option key={n} value={n} style={{ background: '#1E0F45' }}>{n} BA</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Max Guests</label>
              <select value={form.guests} onChange={set('guests')} style={{ ...inputStyle, cursor: 'pointer' }}>
                {[2,4,6,8,10,12,14,16,18,20].map(n => <option key={n} value={n} style={{ background: '#1E0F45' }}>{n} guests</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)', borderRadius: 2, color: '#ff8080', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button onClick={analyze} disabled={loading} style={{
            width: '100%', padding: '16px',
            background: loading ? 'rgba(244,162,58,0.4)' : '#F4A23A',
            color: '#1E0F45', border: 'none', borderRadius: 2,
            fontSize: 13, letterSpacing: '2.5px', textTransform: 'uppercase',
            fontWeight: 600, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit',
          }}>
            {loading ? 'Analyzing Market Data...' : 'Get Revenue Estimate →'}
          </button>
          <p style={{ fontSize: 11, color: 'rgba(253,246,236,0.3)', textAlign: 'center', marginTop: 12 }}>
            Powered by AirROI · 20M+ properties · Instant results
          </p>
        </div>

        {/* Results */}
        {result && (
          <div style={{ marginTop: 32 }}>
            <p style={{ fontSize: 12, color: 'rgba(253,246,236,0.5)', marginBottom: 24, letterSpacing: 0.5 }}>
              📍 {result.address}
            </p>

            {/* Big stats */}
            {(finalAnnual || occupancy || adr) ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 2, marginBottom: 2 }}>
                {finalAnnual && (
                  <div style={{ background: 'linear-gradient(135deg, rgba(244,162,58,0.12), rgba(30,15,69,0.8))', border: '1px solid rgba(244,162,58,0.25)', padding: '32px 24px', textAlign: 'center' }}>
                    <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#F4A23A', marginBottom: 12 }}>Est. Annual Revenue</p>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, color: 'white', fontWeight: 300, margin: 0 }}>${Math.round(finalAnnual).toLocaleString()}</p>
                    <p style={{ fontSize: 11, color: 'rgba(253,246,236,0.5)', marginTop: 4 }}>per year</p>
                  </div>
                )}
                {occupancy && (
                  <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.12)', padding: '32px 24px', textAlign: 'center' }}>
                    <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#F4A23A', marginBottom: 12 }}>Occupancy Rate</p>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, color: 'white', fontWeight: 300, margin: 0 }}>{Math.round((occupancy > 1 ? occupancy : occupancy * 100))}%</p>
                    <p style={{ fontSize: 11, color: 'rgba(253,246,236,0.5)', marginTop: 4 }}>avg. booked nights</p>
                  </div>
                )}
                {adr && (
                  <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.12)', padding: '32px 24px', textAlign: 'center' }}>
                    <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#F4A23A', marginBottom: 12 }}>Avg. Nightly Rate</p>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, color: 'white', fontWeight: 300, margin: 0 }}>${Math.round(adr)}</p>
                    <p style={{ fontSize: 11, color: 'rgba(253,246,236,0.5)', marginTop: 4 }}>per night</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.15)', borderRadius: 4, padding: 24, marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: '#F4A23A', marginBottom: 8 }}>Raw estimate data:</p>
                <pre style={{ fontSize: 11, color: 'rgba(253,246,236,0.6)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                  {JSON.stringify(result.estimate, null, 2)}
                </pre>
              </div>
            )}

            {/* Comparable listings */}
            {result.comparables && result.comparables.length > 0 && (
              <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.1)', padding: 32, marginTop: 2 }}>
                <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#F4A23A', marginBottom: 20 }}>
                  Comparable Properties Nearby
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 12 }}>
                  {result.comparables.map((comp) => (
                    <div key={comp.listing_info.listing_id} style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                      {comp.listing_info.cover_photo_url && (
                        <img src={comp.listing_info.cover_photo_url} alt="" style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                      )}
                      <div style={{ padding: '12px 14px' }}>
                        <p style={{ fontSize: 12, color: 'var(--cream)', marginBottom: 4, lineHeight: 1.4 }}>{comp.listing_info.listing_name?.substring(0, 45)}</p>
                        <p style={{ fontSize: 10, color: 'rgba(253,246,236,0.4)', marginBottom: 8 }}>
                          {comp.property_details?.bedrooms}BR · {comp.property_details?.baths}BA · {comp.property_details?.guests} guests
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                          <span style={{ color: '#F4A23A' }}>${Math.round(comp.performance_metrics?.ttm_avg_rate || 0)}/night</span>
                          <span style={{ color: 'rgba(253,246,236,0.5)' }}>{Math.round((comp.performance_metrics?.ttm_occupancy || 0) * 100)}% occ</span>
                        </div>
                        {comp.performance_metrics?.ttm_revenue && (
                          <p style={{ fontSize: 11, color: '#F7C05A', marginTop: 4 }}>
                            ${Math.round(comp.performance_metrics.ttm_revenue / 1000)}k/yr
                          </p>
                        )}
                        {comp.ratings?.rating_overall && (
                          <p style={{ fontSize: 10, color: 'rgba(253,246,236,0.4)', marginTop: 2 }}>
                            ★ {comp.ratings.rating_overall} · {comp.ratings.num_reviews} reviews
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ marginTop: 16, padding: '28px 32px', background: 'linear-gradient(135deg, rgba(244,162,58,0.08), rgba(30,15,69,0.5))', border: '1px solid rgba(244,162,58,0.2)', borderRadius: 4 }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#F7C05A', marginBottom: 8 }}>
                Want to maximize this revenue?
              </p>
              <p style={{ fontSize: 13, color: 'rgba(253,246,236,0.6)', marginBottom: 20, lineHeight: 1.7 }}>
                Our property management and finder services are built to get you numbers like these — and beyond.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href={`mailto:FabVacayVibes@gmail.com?subject=Revenue Estimate Follow-up&body=I just ran an estimate for ${result.address} and would love to chat!`}
                  style={{ background: '#F4A23A', color: '#1E0F45', padding: '12px 24px', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, textDecoration: 'none' }}>
                  Talk to Us
                </a>
                <Link href="/services" style={{ border: '1px solid rgba(244,162,58,0.4)', color: '#F4A23A', padding: '12px 24px', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>
                  Our Services
                </Link>
              </div>
            </div>

            <p style={{ fontSize: 11, color: 'rgba(253,246,236,0.3)', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
              Estimates are based on comparable properties in the area. Actual results vary based on property condition, amenities, photos, and management quality.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
