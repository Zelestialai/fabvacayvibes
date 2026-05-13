'use client'
import { useState, useEffect } from 'react'

interface CalendarProps {
  propertySlug: string
  propertyName: string
  bookingUrl: string
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

export default function AvailabilityCalendar({ propertySlug, propertyName, bookingUrl }: CalendarProps) {
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkIn, setCheckIn] = useState<string | null>(null)
  const [checkOut, setCheckOut] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })

  useEffect(() => {
    setLoading(true)
    fetch(`/api/availability?property=${propertySlug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error)
        setBookedDates(new Set(data.bookedDates))
        setLoading(false)
      })
      .catch(() => {
        setError('Could not load availability. Please contact us directly.')
        setLoading(false)
      })
  }, [propertySlug])

  const formatDate = (year: number, month: number, day: number) =>
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const isPast = (dateStr: string) => dateStr < new Date().toISOString().split('T')[0]
  const isBooked = (dateStr: string) => bookedDates.has(dateStr)

  // Check if any date in range is booked (for validating a selection)
  const rangeHasBookedDate = (start: string, end: string) => {
    const cur = new Date(start)
    const endD = new Date(end)
    while (cur < endD) {
      if (bookedDates.has(cur.toISOString().split('T')[0])) return true
      cur.setDate(cur.getDate() + 1)
    }
    return false
  }

  const isInRange = (dateStr: string) => {
    const ref = hovered || checkOut
    if (!checkIn || !ref) return false
    const [a, b] = checkIn < ref ? [checkIn, ref] : [ref, checkIn]
    return dateStr > a && dateStr < b
  }

  const isRangeStart = (dateStr: string) => dateStr === checkIn
  const isRangeEnd = (dateStr: string) => dateStr === (hovered || checkOut)

  const handleDayClick = (dateStr: string) => {
    if (isPast(dateStr) || isBooked(dateStr)) return

    if (!checkIn || (checkIn && checkOut)) {
      // Start new selection
      setCheckIn(dateStr)
      setCheckOut(null)
      return
    }

    // Have check-in, picking check-out
    if (dateStr <= checkIn) {
      setCheckIn(dateStr)
      setCheckOut(null)
      return
    }

    // Validate no booked dates in range
    if (rangeHasBookedDate(checkIn, dateStr)) {
      // Reset and start over from this date
      setCheckIn(dateStr)
      setCheckOut(null)
      return
    }

    setCheckOut(dateStr)
    setHovered(null)
  }

  const handleDayHover = (dateStr: string) => {
    if (checkIn && !checkOut) setHovered(dateStr)
  }

  const nights = checkIn && checkOut
    ? Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000)
    : 0

  const buildBookingUrl = () => {
    if (checkIn && checkOut) {
      // Try to append dates to ownerrez url
      const url = new URL(bookingUrl)
      url.searchParams.set('arrival', checkIn)
      url.searchParams.set('departure', checkOut)
      return url.toString()
    }
    return bookingUrl
  }

  const prevMonth = () => setCurrentMonth(prev =>
    prev.month === 0 ? { year: prev.year - 1, month: 11 } : { year: prev.year, month: prev.month - 1 }
  )
  const nextMonth = () => setCurrentMonth(prev =>
    prev.month === 11 ? { year: prev.year + 1, month: 0 } : { year: prev.year, month: prev.month + 1 }
  )
  const getNextMonth = () =>
    currentMonth.month === 11
      ? { year: currentMonth.year + 1, month: 0 }
      : { year: currentMonth.year, month: currentMonth.month + 1 }

  const renderMonth = (year: number, month: number) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDay = new Date(year, month, 1).getDay()
    const cells: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)

    const today = new Date().toISOString().split('T')[0]

    return (
      <div style={{ flex: 1, minWidth: 240 }}>
        <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 400, color: 'var(--orange-warm)', textAlign: 'center', marginBottom: 16 }}>
          {MONTHS[month]} {year}
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', padding: '4px 0' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} />
            const dateStr = formatDate(year, month, day)
            const past = isPast(dateStr)
            const booked = isBooked(dateStr)
            const available = !past && !booked
            const inRange = isInRange(dateStr)
            const isStart = isRangeStart(dateStr)
            const isEnd = isRangeEnd(dateStr)
            const isToday = dateStr === today
            const isSelected = isStart || isEnd

            let bg = 'transparent'
            let color = past ? 'rgba(253,246,236,0.2)' : 'var(--cream)'
            let border = '1px solid transparent'
            let textDecoration = 'none'
            let cursor = 'default'

            if (booked) {
              bg = 'rgba(244,162,58,0.12)'
              color = 'rgba(244,162,58,0.35)'
              textDecoration = 'line-through'
            } else if (past) {
              bg = 'transparent'
              color = 'rgba(253,246,236,0.2)'
            } else if (isSelected) {
              bg = 'var(--orange)'
              color = '#1E0F45'
              cursor = 'pointer'
            } else if (inRange) {
              bg = 'rgba(244,162,58,0.2)'
              color = 'var(--cream)'
              cursor = 'pointer'
            } else {
              bg = 'rgba(253,246,236,0.04)'
              border = '1px solid rgba(253,246,236,0.08)'
              cursor = 'pointer'
              if (isToday) border = '1px solid rgba(244,162,58,0.5)'
            }

            return (
              <div
                key={day}
                onClick={() => handleDayClick(dateStr)}
                onMouseEnter={() => handleDayHover(dateStr)}
                onMouseLeave={() => setHovered(null)}
                title={booked ? 'Booked' : past ? 'Past' : isSelected ? dateStr : 'Available'}
                style={{
                  aspectRatio: '1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, borderRadius: isSelected ? 2 : inRange ? 0 : 2,
                  background: bg, color, border, textDecoration, cursor,
                  transition: 'background 0.15s',
                  fontWeight: isSelected ? 600 : 400,
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

  const nextM = getNextMonth()

  return (
    <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.15)', borderRadius: 4, padding: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: 'white' }}>
          Availability
        </h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={prevMonth} style={{ background: 'transparent', border: '1px solid rgba(244,162,58,0.3)', color: 'var(--orange)', padding: '6px 14px', cursor: 'pointer', borderRadius: 2, fontSize: 16 }}>←</button>
          <button onClick={nextMonth} style={{ background: 'transparent', border: '1px solid rgba(244,162,58,0.3)', color: 'var(--orange)', padding: '6px 14px', cursor: 'pointer', borderRadius: 2, fontSize: 16 }}>→</button>
        </div>
      </div>

      {/* Selected dates summary */}
      {(checkIn || checkOut) && (
        <div style={{ display: 'flex', gap: 16, marginBottom: 20, padding: '12px 16px', background: 'rgba(244,162,58,0.08)', borderRadius: 2, border: '1px solid rgba(244,162,58,0.2)', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Check-in</div>
            <div style={{ fontSize: 14, color: 'var(--orange-warm)', fontFamily: "'Cormorant Garamond',serif" }}>{checkIn || '—'}</div>
          </div>
          <div style={{ color: 'rgba(244,162,58,0.4)', fontSize: 18 }}>→</div>
          <div>
            <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 2 }}>Check-out</div>
            <div style={{ fontSize: 14, color: 'var(--orange-warm)', fontFamily: "'Cormorant Garamond',serif" }}>{checkOut || '—'}</div>
          </div>
          {nights > 0 && (
            <div style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--cream)' }}>{nights} night{nights !== 1 ? 's' : ''}</div>
          )}
          <button onClick={() => { setCheckIn(null); setCheckOut(null) }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13, letterSpacing: 2 }}>LOADING AVAILABILITY...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--orange)', fontSize: 13 }}>{error}</div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {renderMonth(currentMonth.year, currentMonth.month)}
            {renderMonth(nextM.year, nextM.month)}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 24, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(244,162,58,0.1)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(253,246,236,0.08)', borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>Available</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, background: 'rgba(244,162,58,0.12)', borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>Booked</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, background: 'var(--orange)', borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>Selected</span>
            </div>
          </div>
        </>
      )}

      {/* Book CTA */}
      {!loading && !error && (
        <a
          href={buildBookingUrl()}
          target="_blank"
          style={{
            display: 'block', textAlign: 'center', marginTop: 24,
            background: checkIn && checkOut ? 'var(--orange)' : 'rgba(244,162,58,0.3)',
            color: checkIn && checkOut ? 'var(--purple)' : 'var(--cream)',
            padding: '14px 24px', fontSize: 12, letterSpacing: '2.5px',
            textTransform: 'uppercase', fontWeight: 500,
            borderRadius: 2, textDecoration: 'none',
            transition: 'background 0.2s',
            pointerEvents: checkIn && checkOut ? 'auto' : 'none',
          }}
        >
          {checkIn && checkOut ? `Book ${nights} Night${nights !== 1 ? 's' : ''} →` : 'Select Dates to Book'}
        </a>
      )}
    </div>
  )
}
