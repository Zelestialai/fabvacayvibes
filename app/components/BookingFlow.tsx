'use client'
import { useState, useEffect } from 'react'

interface BookingFlowProps {
  propertySlug: string
  propertyName: string
  bookedDates: Set<string>
}

type Step = 'dates' | 'quote' | 'guest' | 'redirect'

interface Quote {
  nights: number
  pricing: {
    rentTotal: number
    rentPerNight: number
    rentLabel: string
    fees: { name: string; amount: number }[]
    taxes: { name: string; amount: number }[]
    total: number
  }
}

const fmt = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  padding: '12px 16px',
  background: 'rgba(253,246,236,0.05)',
  border: '1px solid rgba(244,162,58,0.25)',
  borderRadius: 2,
  color: 'var(--cream)',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 14,
  outline: 'none',
  display: 'block',
}

const labelStyle = {
  fontSize: 10,
  letterSpacing: 2,
  textTransform: 'uppercase' as const,
  color: 'var(--orange)',
  marginBottom: 8,
  display: 'block',
}

export default function BookingFlow({ propertySlug, propertyName, bookedDates }: BookingFlowProps) {
  const [step, setStep] = useState<Step>('dates')
  const [arrival, setArrival] = useState('')
  const [departure, setDeparture] = useState('')
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [pets, setPets] = useState(0)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [guest, setGuest] = useState({ firstName: '', lastName: '', email: '', phone: '' })

  const today = new Date().toISOString().split('T')[0]

  // Listen for dates selected in the availability calendar
  useEffect(() => {
    const handler = (e: Event) => {
      const { checkIn, checkOut } = (e as CustomEvent).detail
      setArrival(checkIn)
      setDeparture(checkOut)
      setStep('dates')
      setQuote(null)
      setError('')
    }
    window.addEventListener('calendar-dates-selected', handler)
    return () => window.removeEventListener('calendar-dates-selected', handler)
  }, [])

  const isDateBooked = (dateStr: string) => bookedDates.has(dateStr)

  const fetchQuote = async () => {
    if (!arrival || !departure) { setError('Please select check-in and check-out dates'); return }
    if (arrival >= departure) { setError('Check-out must be after check-in'); return }
    if (isDateBooked(arrival)) { setError('Check-in date is not available'); return }

    setLoading(true)
    setError('')
    try {
      const res = await fetch(
        `/api/quote?property=${propertySlug}&arrival=${arrival}&departure=${departure}&adults=${adults}&children=${children}&pets=${pets}`
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Could not calculate quote')
      setQuote(data)
      setStep('quote')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Could not calculate quote. Please try different dates.')
    } finally {
      setLoading(false)
    }
  }

  const submitBooking = async () => {
    if (!guest.firstName || !guest.lastName || !guest.email) { setError('Please fill in all required fields'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: propertySlug, arrival, departure, adults, children, pets, guest }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Booking failed')
      setStep('redirect')
      // Redirect to OwnerRez payment page
      setTimeout(() => { window.location.href = data.paymentUrl }, 2000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Booking failed. Please try again or call us.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.15)', borderRadius: 4, padding: 28 }}>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['dates', 'quote', 'guest'] as Step[]).map((s, i) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: step === s ? 'var(--orange)' : (
                ['dates','quote','guest'].indexOf(step) > i ? 'rgba(244,162,58,0.3)' : 'rgba(253,246,236,0.05)'
              ),
              border: '1px solid rgba(244,162,58,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: step === s ? 'var(--purple)' : 'var(--text-muted)',
              fontWeight: 600,
            }}>
              {i + 1}
            </div>
            <span style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: step === s ? 'var(--orange)' : 'var(--text-muted)' }}>
              {s === 'dates' ? 'Dates' : s === 'quote' ? 'Quote' : 'Book'}
            </span>
            {i < 2 && <div style={{ width: 20, height: 1, background: 'rgba(244,162,58,0.2)' }} />}
          </div>
        ))}
      </div>

      {/* ── STEP 1: DATES ── */}
      {step === 'dates' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: 'white', marginBottom: 4 }}>
            Check Availability
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 12 }}>
            <div>
              <label style={labelStyle}>Check-in</label>
              <input
                type="date"
                min={today}
                value={arrival}
                onChange={e => setArrival(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Check-out</label>
              <input
                type="date"
                min={arrival || today}
                value={departure}
                onChange={e => setDeparture(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)', gap: 8 }}>
            <div>
              <label style={labelStyle}>Adults</label>
              <select value={adults} onChange={e => setAdults(+e.target.value)} style={inputStyle}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Children</label>
              <select value={children} onChange={e => setChildren(+e.target.value)} style={inputStyle}>
                {[0,1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Pets</label>
              <select value={pets} onChange={e => setPets(+e.target.value)} style={inputStyle}>
                {[0,1,2].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>

          {error && <p style={{ fontSize: 13, color: '#ff6b6b', background: 'rgba(255,107,107,0.1)', padding: '10px 14px', borderRadius: 2 }}>{error}</p>}

          <button
            onClick={fetchQuote}
            disabled={loading}
            style={{
              background: loading ? 'rgba(244,162,58,0.5)' : 'var(--orange)',
              color: 'var(--purple)', padding: '16px 24px',
              fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase',
              fontWeight: 500, border: 'none', borderRadius: 2,
              cursor: loading ? 'not-allowed' : 'pointer', width: '100%',
            }}
          >
            {loading ? 'Checking...' : 'Check Availability →'}
          </button>

          <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
            No charges yet — see full pricing first
          </p>
        </div>
      )}

      {/* ── STEP 2: QUOTE ── */}
      {step === 'quote' && quote && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: 'white', marginBottom: 4 }}>
            Your Quote
          </h3>

          {/* Dates summary */}
          <div style={{ background: 'rgba(244,162,58,0.06)', border: '1px solid rgba(244,162,58,0.15)', borderRadius: 2, padding: '14px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--cream)' }}>
              <span>{arrival} → {departure}</span>
              <span style={{ color: 'var(--orange)' }}>{quote.nights} nights</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              {adults} adults{children > 0 ? `, ${children} children` : ''}{pets > 0 ? `, ${pets} pet${pets > 1 ? 's' : ''}` : ''}
            </div>
          </div>

          {/* Pricing breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--cream)' }}>
              <div>
                <span>{quote.pricing.rentLabel}</span>
                <span style={{fontSize:11,color:'var(--text-muted)',marginLeft:8}}>{fmt(quote.pricing.rentPerNight)} × {quote.nights} nights</span>
              </div>
              <span>{fmt(quote.pricing.rentTotal)}</span>
            </div>
            {quote.pricing.fees.map(f => (
              <div key={f.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
                <span>{f.name}</span>
                <span>{fmt(f.amount)}</span>
              </div>
            ))}
            {quote.pricing.taxes.map(t => (
              <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
                <span>{t.name}</span>
                <span>{fmt(t.amount)}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(244,162,58,0.2)', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: 'white' }}>Total</span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: 'var(--orange-warm)' }}>{fmt(quote.pricing.total)}</span>
            </div>
          </div>

          {error && <p style={{ fontSize: 13, color: '#ff6b6b', background: 'rgba(255,107,107,0.1)', padding: '10px 14px', borderRadius: 2 }}>{error}</p>}

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 10 }}>
            <button onClick={() => setStep('dates')} style={{ background: 'transparent', border: '1px solid rgba(244,162,58,0.3)', color: 'var(--orange)', padding: '14px', fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}>
              ← Back
            </button>
            <button onClick={() => setStep('guest')} style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '14px', fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 500, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
              Book Now →
            </button>
          </div>

          <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
            Best rate — no OTA fees
          </p>
        </div>
      )}

      {/* ── STEP 3: GUEST INFO ── */}
      {step === 'guest' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: 'white', marginBottom: 4 }}>
            Your Details
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 4 }}>
            Total: <span style={{ color: 'var(--orange-warm)', fontFamily: "'Cormorant Garamond',serif", fontSize: 18 }}>{fmt(quote?.pricing.total || 0)}</span>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 12 }}>
            <div>
              <label style={labelStyle}>First Name *</label>
              <input type="text" value={guest.firstName} onChange={e => setGuest(g => ({ ...g, firstName: e.target.value }))} style={inputStyle} placeholder="Jane" />
            </div>
            <div>
              <label style={labelStyle}>Last Name *</label>
              <input type="text" value={guest.lastName} onChange={e => setGuest(g => ({ ...g, lastName: e.target.value }))} style={inputStyle} placeholder="Smith" />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email Address *</label>
            <input type="email" value={guest.email} onChange={e => setGuest(g => ({ ...g, email: e.target.value }))} style={inputStyle} placeholder="jane@example.com" />
          </div>

          <div>
            <label style={labelStyle}>Phone Number</label>
            <input type="tel" value={guest.phone} onChange={e => setGuest(g => ({ ...g, phone: e.target.value }))} style={inputStyle} placeholder="+1 (555) 000-0000" />
          </div>

          {error && <p style={{ fontSize: 13, color: '#ff6b6b', background: 'rgba(255,107,107,0.1)', padding: '10px 14px', borderRadius: 2 }}>{error}</p>}

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 10 }}>
            <button onClick={() => setStep('quote')} style={{ background: 'transparent', border: '1px solid rgba(244,162,58,0.3)', color: 'var(--orange)', padding: '14px', fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 }}>
              ← Back
            </button>
            <button onClick={submitBooking} disabled={loading} style={{ background: loading ? 'rgba(244,162,58,0.5)' : 'var(--orange)', color: 'var(--purple)', padding: '14px', fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 500, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
              {loading ? 'Processing...' : 'Complete Booking →'}
            </button>
          </div>

          <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
            You&apos;ll be redirected to our secure payment page
          </p>
        </div>
      )}

      {/* ── STEP 4: REDIRECT ── */}
      {step === 'redirect' && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✨</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: 'white', marginBottom: 12 }}>
            Almost there!
          </h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Redirecting you to our secure payment page to complete your booking at {propertyName}...
          </p>
          <div style={{ marginTop: 20, width: 40, height: 2, background: 'var(--orange)', margin: '20px auto 0', animation: 'pulse 1s infinite' }} />
        </div>
      )}

      {/* Best Price Guarantee */}
      <div style={{ marginTop: 12, padding: '16px 20px', background: 'rgba(244,162,58,0.05)', border: '1px solid rgba(244,162,58,0.15)', borderRadius: 4 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontSize: 20, flexShrink: 0 }}>🏷️</span>
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--orange-warm)', marginBottom: 4, letterSpacing: 0.5 }}>
              Best Price Guarantee
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
              Found a lower price on Airbnb or VRBO?{' '}
              <a
                href={`mailto:FabVacayVibes@gmail.com?subject=Price Match Request — ${propertyName}&body=Hi! I found a lower price on [OTA] for ${propertyName}. Here are the details:%0A%0AProperty: ${propertyName}%0ADates: %0APrice found: %0ALink: %0A%0APlease match this price for a direct booking!`}
                style={{ color: 'var(--orange)', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Send us the details
              </a>
              {' '}and we&apos;ll beat it for your direct booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
