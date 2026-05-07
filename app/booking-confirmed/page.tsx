import Nav from '../components/Nav'
import Link from 'next/link'

export default function BookingConfirmed() {
  return (
    <>
      <Nav />
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 48px', background: 'linear-gradient(135deg,#1E0F45 0%,#2D1B69 50%,#1A0D3D 100%)' }}>
        <div style={{ maxWidth: 560 }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🎉</div>
          <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Booking Confirmed</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,64px)', fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 20 }}>
            Welcome to the <em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>Fab Vacay Vibes</em> family!
          </h1>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-muted)', marginBottom: 40 }}>
            Your booking is confirmed. You'll receive a confirmation email shortly with all the details. We can't wait to host you!
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '16px 36px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, borderRadius: 2, textDecoration: 'none' }}>
              Back to Home
            </Link>
            <a href="mailto:FabVacayVibes@gmail.com" style={{ border: '1px solid rgba(244,162,58,0.5)', color: 'var(--orange)', padding: '16px 36px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
