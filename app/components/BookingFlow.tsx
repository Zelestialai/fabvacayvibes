'use client'
import { useState, useEffect } from 'react'
import { trackBeginCheckout } from '../lib/analytics'
import { appendUtmToUrl } from '../lib/utm'

interface BookingFlowProps {
  propertySlug: string
  propertyName: string
  bookedDates: Set<string>
  initialDates?: {
    arrival?: string
    departure?: string
    adults?: number
    children?: number
  }
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

const CAL_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const CAL_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

export default function BookingFlow({ propertySlug, propertyName, bookedDates, initialDates }: BookingFlowProps) {
  const [step, setStep] = useState<Step>('dates')
  const [arrival, setArrival] = useState(initialDates?.arrival || '')
  const [departure, setDeparture] = useState(initialDates?.departure || '')
  const [adults, setAdults] = useState(initialDates?.adults || 2)
  const [children, setChildren] = useState(initialDates?.children || 0)
  const [pets, setPets] = useState(0)
  const [poolHeating, setPoolHeating] = useState(false)
  const [quote, setQuote] = useState<Quote | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [guest, setGuest] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [calHovered, setCalHovered] = useState<string | null>(null)
  const [calMonth, setCalMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

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

  // Calendar helpers
  const calFmt = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const calIsInRange = (dateStr: string) => {
    const ref = calHovered || departure
    if (!arrival || !ref) return false
    const [a, b] = arrival < ref ? [arrival, ref] : [ref, arrival]
    return dateStr > a && dateStr < b
  }

  const calRangeHasBooked = (start: string, end: string) => {
    const cur = new Date(start + 'T12:00:00')
    const endD = new Date(end + 'T12:00:00')
    while (cur < endD) {
      if (bookedDates.has(cur.toISOString().split('T')[0])) return true
      cur.setDate(cur.getDate() + 1)
    }
    return false
  }

  const handleCalDayClick = (dateStr: string) => {
    if (dateStr < today || isDateBooked(dateStr)) return
    if (!arrival || (arrival && departure)) {
      setArrival(dateStr); setDeparture(''); setCalHovered(null); return
    }
    if (dateStr <= arrival) { setArrival(dateStr); setDeparture(''); return }
    if (calRangeHasBooked(arrival, dateStr)) { setArrival(dateStr); setDeparture(''); return }
    setDeparture(dateStr); setCalHovered(null)
  }

  const calPrevMonth = () => setCalMonth(p => p.month === 0 ? { year: p.year - 1, month: 11 } : { year: p.year, month: p.month - 1 })
  const calNextMonth = () => setCalMonth(p => p.month === 11 ? { year: p.year + 1, month: 0 } : { year: p.year, month: p.month + 1 })
  const calNext = calMonth.month === 11 ? { year: calMonth.year + 1, month: 0 } : { year: calMonth.year, month: calMonth.month + 1 }

  const renderCalMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)

    return (
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontWeight: 400, color: 'var(--orange-warm)', textAlign: 'center', marginBottom: 10 }}>
          {CAL_MONTHS[month]} {year}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
          {CAL_DAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 9, letterSpacing: 1, color: 'var(--text-muted)', padding: '2px 0' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />
            const dateStr = calFmt(year, month, day)
            const past = dateStr < today
            const booked = isDateBooked(dateStr)
            const isStart = dateStr === arrival
            const isEnd = dateStr === (calHovered || departure)
            const inRange = calIsInRange(dateStr)
            const isToday = dateStr === today
            const selectable = !past && !booked

            let bg = 'transparent'
            let color = past ? 'rgba(253,246,236,0.2)' : 'var(--cream)'
            let border = '1px solid transparent'
            let textDec = 'none'
            let cursor = 'default'
            let borderRadius = 2

            if (booked) {
              bg = 'rgba(244,162,58,0.1)'; color = 'rgba(244,162,58,0.3)'; textDec = 'line-through'
            } else if (past) {
              color = 'rgba(253,246,236,0.18)'
            } else if (isStart || isEnd) {
              bg = 'var(--orange)'; color = '#1E0F45'; cursor = 'pointer'; borderRadius = 2
            } else if (inRange) {
              bg = 'rgba(244,162,58,0.18)'; color = 'var(--cream)'; cursor = 'pointer'; borderRadius = 0
            } else {
              bg = 'rgba(253,246,236,0.03)'; border = isToday ? '1px solid rgba(244,162,58,0.45)' : '1px solid rgba(253,246,236,0.07)'; cursor = 'pointer'
            }

            return (
              <div
                key={day}
                onClick={() => handleCalDayClick(dateStr)}
                onMouseEnter={() => { if (arrival && !departure && selectable) setCalHovered(dateStr) }}
                onMouseLeave={() => setCalHovered(null)}
                title={booked ? 'Booked' : past ? 'Past' : 'Available'}
                style={{
                  aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, borderRadius, background: bg, color, border, textDecoration: textDec, cursor,
                  transition: 'background 0.12s', fontWeight: (isStart || isEnd) ? 600 : 400,
                }}
              >
                {day}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const fetchQuote = async () => {
    if (!arrival || !departure) { setError('Please select check-in and check-out dates'); return }
    if (arrival >= departure) { setError('Check-out must be after check-in'); return }
    if (isDateBooked(arrival)) { setError('Check-in date is not available'); return }

    setLoading(true)
    setError('')
    try {
      const poolParam = poolHeating ? '&poolHeating=1' : ''
      const res = await fetch(
        `/api/quote?property=${propertySlug}&arrival=${arrival}&departure=${departure}&adults=${adults}&children=${children}&pets=${pets}${poolParam}`
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
        body: JSON.stringify({ slug: propertySlug, arrival, departure, adults, children, pets, guest, couponCode: couponCode.trim() || undefined, poolHeating: poolHeating || undefined }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Booking failed')
      setStep('redirect')
      // Redirect to OwnerRez payment page, appending UTM/oppref for attribution
      const paymentUrlWithUtm = appendUtmToUrl(data.paymentUrl)
      setTimeout(() => { window.location.href = paymentUrlWithUtm }, 2000)
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

          {/* Inline date picker calendar */}
          <div style={{ background: 'rgba(253,246,236,0.02)', border: '1px solid rgba(244,162,58,0.15)', borderRadius: 2, padding: '16px 12px' }}>
            {/* Calendar nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <button onClick={calPrevMonth} style={{ background: 'transparent', border: '1px solid rgba(244,162,58,0.3)', color: 'var(--orange)', padding: '4px 10px', cursor: 'pointer', borderRadius: 2, fontSize: 14, lineHeight: 1 }}>←</button>
              <button onClick={calNextMonth} style={{ background: 'transparent', border: '1px solid rgba(244,162,58,0.3)', color: 'var(--orange)', padding: '4px 10px', cursor: 'pointer', borderRadius: 2, fontSize: 14, lineHeight: 1 }}>→</button>
            </div>
            {/* Two months side-by-side (stack on narrow) */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {renderCalMonth(calMonth.year, calMonth.month)}
              {renderCalMonth(calNext.year, calNext.month)}
            </div>
            {/* Selected dates summary */}
            {(arrival || departure) && (
              <div style={{ display: 'flex', gap: 12, marginTop: 14, padding: '10px 12px', background: 'rgba(244,162,58,0.07)', borderRadius: 2, border: '1px solid rgba(244,162,58,0.18)', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Check-in</div>
                  <div style={{ fontSize: 13, color: 'var(--orange-warm)', fontFamily: "'Cormorant Garamond',serif" }}>{arrival || '—'}</div>
                </div>
                <div style={{ color: 'rgba(244,162,58,0.4)', fontSize: 16 }}>→</div>
                <div>
                  <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Check-out</div>
                  <div style={{ fontSize: 13, color: 'var(--orange-warm)', fontFamily: "'Cormorant Garamond',serif" }}>{departure || '—'}</div>
                </div>
                {arrival && departure && (
                  <div style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--cream)' }}>
                    {Math.round((new Date(departure).getTime() - new Date(arrival).getTime()) / 86400000)} nights
                  </div>
                )}
                <button onClick={() => { setArrival(''); setDeparture('') }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
              </div>
            )}
            {/* Legend */}
            <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(253,246,236,0.07)', borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>Available</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, background: 'rgba(244,162,58,0.1)', borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>Booked</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, background: 'var(--orange)', borderRadius: 2 }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>Selected</span>
              </div>
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

          {/* Pool Heating — Owl & Hare only */}
          {propertySlug === 'owl-and-hare' && (
            <div
              onClick={() => setPoolHeating(h => !h)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 16px', borderRadius: 2, cursor: 'pointer',
                background: poolHeating ? 'rgba(244,162,58,0.1)' : 'rgba(253,246,236,0.03)',
                border: `1px solid ${poolHeating ? 'rgba(244,162,58,0.5)' : 'rgba(244,162,58,0.2)'}`,
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>🔥</span>
                <div>
                  <div style={{ fontSize: 13, color: 'var(--cream)', fontWeight: 500 }}>Add Pool Heating</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>$250 per night — keep the pool warm year-round</div>
                </div>
              </div>
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: poolHeating ? 'var(--orange)' : 'rgba(253,246,236,0.1)',
                border: '1px solid rgba(244,162,58,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, color: 'var(--purple)', fontWeight: 700, flexShrink: 0,
              }}>
                {poolHeating ? '✓' : ''}
              </div>
            </div>
          )}

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
            <button onClick={() => {
              const totalAmount = quote?.pricing.total ?? 0
              trackBeginCheckout({
                propertySlug,
                propertyName,
                totalAmount,
                nights: quote?.nights ?? 1,
              })
              // OpenAI Ads — checkout_started standard event
              if (typeof window !== 'undefined' && typeof (window as unknown as { oaiq?: Function }).oaiq === 'function') {
                const oaiq = (window as unknown as { oaiq: Function }).oaiq
                oaiq('measure', 'checkout_started', {
                  type: 'contents',
                  amount: Math.round(totalAmount * 100), // minor units (cents)
                  currency: 'USD',
                })
              }
              setStep('guest')
            }} style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '14px', fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 500, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
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

          {/* Coupon Code */}
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Coupon / Promo Code</label>
              <input
                type="text"
                value={couponCode}
                onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponApplied(false) }}
                style={{ ...inputStyle, textTransform: 'uppercase', letterSpacing: 2 }}
                placeholder="ENTER CODE"
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                onClick={() => { if (couponCode.trim()) setCouponApplied(true) }}
                style={{ padding: '12px 16px', background: couponApplied ? 'rgba(74,222,128,0.15)' : 'rgba(244,162,58,0.1)', border: `1px solid ${couponApplied ? 'rgba(74,222,128,0.4)' : 'rgba(244,162,58,0.3)'}`, color: couponApplied ? '#4ade80' : 'var(--orange)', fontSize: 11, letterSpacing: 1, cursor: 'pointer', borderRadius: 2, whiteSpace: 'nowrap', fontFamily: 'inherit' }}
              >
                {couponApplied ? '✓ Applied' : 'Apply'}
              </button>
            </div>
          </div>
          {couponApplied && (
            <p style={{ fontSize: 11, color: '#4ade80', marginTop: -8 }}>
              ✓ Coupon &quot;{couponCode}&quot; will be applied at checkout
            </p>
          )}

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
