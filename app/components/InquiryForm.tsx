'use client'
import { useState } from 'react'

interface InquiryFormProps {
  propertySlug: string
  propertyName: string
}

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box' as const,
  display: 'block',
  padding: '12px 16px',
  background: 'rgba(253,246,236,0.05)',
  border: '1px solid rgba(244,162,58,0.25)',
  borderRadius: 2,
  color: 'var(--cream)',
  fontFamily: 'DM Sans, sans-serif',
  fontSize: 14,
  outline: 'none',
}

const labelStyle = {
  fontSize: 10,
  letterSpacing: 2,
  textTransform: 'uppercase' as const,
  color: 'var(--orange)',
  marginBottom: 6,
  display: 'block',
}

export default function InquiryForm({ propertySlug, propertyName }: InquiryFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    arrival: '', departure: '', adults: '2', message: '',
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.message) {
      setError('Please fill in your name, email, and message.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: propertySlug,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          arrival: form.arrival || undefined,
          departure: form.departure || undefined,
          adults: parseInt(form.adults) || 2,
          message: form.message,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send inquiry')
      setSuccess(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to send. Please call us directly.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: 16, border: '1px solid rgba(244,162,58,0.15)', borderRadius: 4, overflow: 'hidden' }}>
      {/* Toggle header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', background: 'rgba(253,246,236,0.03)',
          border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18, color: 'var(--orange)' }}>✉</span>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--cream)', margin: 0 }}>Send an Inquiry</p>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: 0, letterSpacing: 1 }}>Questions? We'll respond within 24 hours</p>
          </div>
        </div>
        <span style={{ color: 'var(--orange)', fontSize: 20, transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'none' }}>⌄</span>
      </button>

      {/* Form body */}
      {open && (
        <div style={{ padding: '24px', borderTop: '1px solid rgba(244,162,58,0.1)', background: 'rgba(253,246,236,0.02)' }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>✓</div>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: 'var(--orange-warm)', marginBottom: 8 }}>
                Inquiry Sent!
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Thanks for your interest in {propertyName}. We'll be in touch within 24 hours.
              </p>
              <button
                onClick={() => { setSuccess(false); setForm({ firstName: '', lastName: '', email: '', phone: '', arrival: '', departure: '', adults: '2', message: '' }) }}
                style={{ marginTop: 16, background: 'none', border: '1px solid rgba(244,162,58,0.3)', color: 'var(--orange)', padding: '8px 20px', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, fontFamily: 'inherit' }}
              >
                Send Another
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Name row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 12 }}>
                <div>
                  <label style={labelStyle}>First Name *</label>
                  <input value={form.firstName} onChange={set('firstName')} style={inputStyle} placeholder="Jane" />
                </div>
                <div>
                  <label style={labelStyle}>Last Name *</label>
                  <input value={form.lastName} onChange={set('lastName')} style={inputStyle} placeholder="Smith" />
                </div>
              </div>

              {/* Email + Phone */}
              <div>
                <label style={labelStyle}>Email *</label>
                <input type="email" value={form.email} onChange={set('email')} style={inputStyle} placeholder="jane@example.com" />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="tel" value={form.phone} onChange={set('phone')} style={inputStyle} placeholder="+1 (555) 000-0000" />
              </div>

              {/* Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Check-in</label>
                  <input type="date" value={form.arrival} onChange={set('arrival')} style={{ ...inputStyle, colorScheme: 'dark' }} />
                </div>
                <div>
                  <label style={labelStyle}>Check-out</label>
                  <input type="date" value={form.departure} onChange={set('departure')} style={{ ...inputStyle, colorScheme: 'dark' }} />
                </div>
              </div>

              {/* Guests */}
              <div>
                <label style={labelStyle}>Number of Guests</label>
                <select value={form.adults} onChange={set('adults')} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {[1,2,3,4,5,6,7,8,9,10,11,12,14,16].map(n => (
                    <option key={n} value={n} style={{ background: '#1E0F45' }}>{n} guest{n !== 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label style={labelStyle}>Message *</label>
                <textarea
                  value={form.message}
                  onChange={set('message')}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
                  placeholder={`Tell us about your stay at ${propertyName} — dates, group size, special requests...`}
                />
              </div>

              {error && (
                <div style={{ padding: '12px 16px', background: 'rgba(244,162,58,0.08)', border: '1px solid rgba(244,162,58,0.3)', borderRadius: 2, color: 'var(--orange)', fontSize: 13 }}>
                  {error}
                </div>
              )}

              <button
                onClick={submit}
                disabled={loading}
                style={{
                  background: loading ? 'rgba(244,162,58,0.4)' : 'var(--orange)',
                  color: 'var(--purple)', padding: '14px 24px',
                  fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase',
                  fontWeight: 500, border: 'none', cursor: loading ? 'default' : 'pointer',
                  borderRadius: 2, fontFamily: 'inherit', width: '100%',
                }}
              >
                {loading ? 'Sending...' : 'Send Inquiry →'}
              </button>

              <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', margin: 0 }}>
                Or call us directly: <a href="tel:7273869642" style={{ color: 'var(--orange)', textDecoration: 'none' }}>(727) 386-9642</a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
