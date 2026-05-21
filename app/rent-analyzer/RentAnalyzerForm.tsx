'use client'
import { useState } from 'react'
import Link from 'next/link'

interface EstimateResult {
  address: string
  estimate: {
    annual_revenue?: number
    monthly_revenue?: number
    occupancy_rate?: number
    average_daily_rate?: number
    adr?: number
    revenue_per_available_night?: number
    revpar?: number
    monthly_breakdown?: { month: string; revenue: number; occupancy: number; adr: number }[]
    comparable_count?: number
    [key: string]: unknown
  }
  market?: {
    name?: string
    city?: string
    state?: string
    [key: string]: unknown
  }
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  background: 'rgba(253,246,236,0.05)',
  border: '1px solid rgba(244,162,58,0.25)',
  borderRadius: 2,
  color: '#FDF6EC',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 2,
  textTransform: 'uppercase',
  color: '#F4A23A',
  marginBottom: 6,
  display: 'block',
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function RentAnalyzerForm() {
  const [form, setForm] = useState({ address: '', bedrooms: '3', bathrooms: '2', guests: '6' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<EstimateResult | null>(null)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const analyze = async () => {
    if (!form.address.trim()) { setError('Please enter a property address'); return }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch('/api/rent-analyzer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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

  const est = result?.estimate
  const annualRevenue = est?.annual_revenue || (est?.monthly_revenue ? est.monthly_revenue * 12 : null)
  const occupancy = est?.occupancy_rate
  const adr = est?.average_daily_rate || est?.adr
  const monthly = est?.monthly_breakdown

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
            Enter any US property address to instantly see your estimated annual revenue, occupancy rate, and nightly rate — powered by live data from 20M+ properties.
          </p>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '60px 24px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.15)', borderRadius: 4, padding: '40px 40px 32px' }}>
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Property Address *</label>
            <input
              value={form.address}
              onChange={set('address')}
              placeholder="123 Main St, Clearwater, FL 33755"
              style={inputStyle}
              onKeyDown={e => e.key === 'Enter' && analyze()}
            />
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

          <button
            onClick={analyze}
            disabled={loading}
            style={{
              width: '100%', padding: '16px', background: loading ? 'rgba(244,162,58,0.4)' : '#F4A23A',
              color: '#1E0F45', border: 'none', borderRadius: 2, fontSize: 13, letterSpacing: '2.5px',
              textTransform: 'uppercase', fontWeight: 600, cursor: loading ? 'default' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Analyzing...' : 'Get Revenue Estimate →'}
          </button>

          <p style={{ fontSize: 11, color: 'rgba(253,246,236,0.35)', textAlign: 'center', marginTop: 12 }}>
            Powered by AirROI · 20M+ properties · US-wide coverage
          </p>
        </div>

        {/* Results */}
        {result && annualRevenue && (
          <div style={{ marginTop: 32 }}>
            {/* Address confirmed */}
            <p style={{ fontSize: 12, color: 'rgba(253,246,236,0.5)', marginBottom: 24, letterSpacing: 1 }}>
              📍 {result.address}
              {result.market?.name && <span style={{ color: '#F4A23A', marginLeft: 8 }}>· {result.market.name}</span>}
            </p>

            {/* Big 3 stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 2, marginBottom: 2 }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(244,162,58,0.12) 0%, rgba(30,15,69,0.8) 100%)', border: '1px solid rgba(244,162,58,0.25)', padding: '32px 24px', textAlign: 'center' }}>
                <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#F4A23A', marginBottom: 12 }}>Est. Annual Revenue</p>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, color: 'white', fontWeight: 300, margin: 0 }}>
                  ${Math.round(annualRevenue).toLocaleString()}
                </p>
                <p style={{ fontSize: 11, color: 'rgba(253,246,236,0.5)', marginTop: 4 }}>per year</p>
              </div>
              {occupancy && (
                <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.12)', padding: '32px 24px', textAlign: 'center' }}>
                  <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#F4A23A', marginBottom: 12 }}>Occupancy Rate</p>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, color: 'white', fontWeight: 300, margin: 0 }}>
                    {Math.round(occupancy * 100)}%
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(253,246,236,0.5)', marginTop: 4 }}>avg. booked nights</p>
                </div>
              )}
              {adr && (
                <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.12)', padding: '32px 24px', textAlign: 'center' }}>
                  <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#F4A23A', marginBottom: 12 }}>Avg. Nightly Rate</p>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, color: 'white', fontWeight: 300, margin: 0 }}>
                    ${Math.round(adr)}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(253,246,236,0.5)', marginTop: 4 }}>per night</p>
                </div>
              )}
            </div>

            {/* Monthly breakdown */}
            {monthly && monthly.length > 0 && (
              <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.1)', padding: 32, marginTop: 2 }}>
                <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: '#F4A23A', marginBottom: 20 }}>Monthly Breakdown</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(100px,1fr))', gap: 8 }}>
                  {monthly.map((m, i) => (
                    <div key={i} style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.08)', borderRadius: 2, padding: '12px 8px', textAlign: 'center' }}>
                      <p style={{ fontSize: 10, color: '#F4A23A', letterSpacing: 1, marginBottom: 6 }}>{MONTHS[i] || m.month}</p>
                      <p style={{ fontSize: 14, color: 'white', fontWeight: 500, margin: 0 }}>${Math.round(m.revenue / 1000 * 10) / 10}k</p>
                      <p style={{ fontSize: 10, color: 'rgba(253,246,236,0.4)', marginTop: 2 }}>{Math.round(m.occupancy * 100)}% occ</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div style={{ marginTop: 24, padding: '28px 32px', background: 'linear-gradient(135deg, rgba(244,162,58,0.08), rgba(30,15,69,0.5))', border: '1px solid rgba(244,162,58,0.2)', borderRadius: 4 }}>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: '#F7C05A', marginBottom: 8 }}>
                Want to maximize this revenue?
              </p>
              <p style={{ fontSize: 13, color: 'rgba(253,246,236,0.6)', marginBottom: 20, lineHeight: 1.7 }}>
                Our property management and finder services are built to get you numbers like these — and beyond. Let&apos;s talk.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <a href="mailto:FabVacayVibes@gmail.com?subject=Rent Analyzer Follow-up" style={{ background: '#F4A23A', color: '#1E0F45', padding: '12px 24px', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 600, borderRadius: 2, textDecoration: 'none' }}>
                  Talk to Us
                </a>
                <Link href="/services" style={{ border: '1px solid rgba(244,162,58,0.4)', color: '#F4A23A', padding: '12px 24px', fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>
                  Our Services
                </Link>
              </div>
            </div>

            <p style={{ fontSize: 11, color: 'rgba(253,246,236,0.3)', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
              Estimates are based on comparable properties and market data. Actual results may vary based on property condition, amenities, and management quality.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
