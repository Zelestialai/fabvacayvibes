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
      .catch(err => {
        setError('Could not load availability. Please contact us directly.')
        setLoading(false)
      })
  }, [propertySlug])

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const isBooked = (year: number, month: number, day: number) => {
    return bookedDates.has(formatDate(year, month, day))
  }

  const isPast = (year: number, month: number, day: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return new Date(year, month, day) < today
  }

  const prevMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 }
      return { year: prev.year, month: prev.month - 1 }
    })
  }

  const nextMonth = () => {
    setCurrentMonth(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 }
      return { year: prev.year, month: prev.month + 1 }
    })
  }

  // Show 2 months
  const getNextMonth = () => {
    if (currentMonth.month === 11) return { year: currentMonth.year + 1, month: 0 }
    return { year: currentMonth.year, month: currentMonth.month + 1 }
  }

  const renderMonth = (year: number, month: number) => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const cells = []

    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(d)

    return (
      <div style={{ flex: 1 }}>
        <h4 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 18, fontWeight: 400,
          color: 'var(--orange-warm)',
          textAlign: 'center', marginBottom: 16,
        }}>
          {MONTHS[month]} {year}
        </h4>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, marginBottom: 4 }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 10, letterSpacing: 1, color: 'var(--text-muted)', padding: '4px 0' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Date cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />

            const past = isPast(year, month, day)
            const booked = isBooked(year, month, day)
            const available = !past && !booked

            return (
              <div
                key={day}
                title={booked ? 'Booked' : past ? '' : 'Available'}
                style={{
                  aspectRatio: '1',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, borderRadius: 2,
                  cursor: available ? 'pointer' : 'default',
                  background: booked
                    ? 'rgba(244,162,58,0.15)'
                    : past
                    ? 'transparent'
                    : 'rgba(253,246,236,0.04)',
                  color: booked
                    ? 'rgba(244,162,58,0.4)'
                    : past
                    ? 'rgba(253,246,236,0.15)'
                    : 'var(--cream)',
                  textDecoration: booked ? 'line-through' : 'none',
                  border: available ? '1px solid rgba(253,246,236,0.08)' : '1px solid transparent',
                  transition: 'background 0.2s',
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
    <div style={{
      background: 'rgba(253,246,236,0.03)',
      border: '1px solid rgba(244,162,58,0.15)',
      borderRadius: 4, padding: 32,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h3 style={{
          fontFamily: "'Cormorant Garamond',serif",
          fontSize: 22, fontWeight: 400, color: 'white',
        }}>
          Availability
        </h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={prevMonth} style={{
            background: 'transparent', border: '1px solid rgba(244,162,58,0.3)',
            color: 'var(--orange)', padding: '6px 14px', cursor: 'pointer',
            borderRadius: 2, fontSize: 16,
          }}>←</button>
          <button onClick={nextMonth} style={{
            background: 'transparent', border: '1px solid rgba(244,162,58,0.3)',
            color: 'var(--orange)', padding: '6px 14px', cursor: 'pointer',
            borderRadius: 2, fontSize: 16,
          }}>→</button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13, letterSpacing: 2 }}>
          LOADING AVAILABILITY...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--orange)', fontSize: 13 }}>
          {error}
        </div>
      ) : (
        <>
          {/* Two month grid */}
          <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
            {renderMonth(currentMonth.year, currentMonth.month)}
            {renderMonth(nextM.year, nextM.month)}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 24, marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(244,162,58,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(253,246,236,0.08)', borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>Available</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 14, height: 14, background: 'rgba(244,162,58,0.15)', borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1 }}>Booked</span>
            </div>
          </div>
        </>
      )}

      {/* Book CTA */}
      {!loading && !error && (
        <a
          href={bookingUrl}
          target="_blank"
          style={{
            display: 'block', textAlign: 'center', marginTop: 24,
            background: 'var(--orange)', color: 'var(--purple)',
            padding: '14px 24px', fontSize: 12, letterSpacing: '2.5px',
            textTransform: 'uppercase', fontWeight: 500,
            borderRadius: 2, textDecoration: 'none',
          }}
        >
          Check Availability & Book Direct
        </a>
      )}
    </div>
  )
}
