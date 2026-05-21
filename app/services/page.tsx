import Nav from '../components/Nav'
import RevealOnScroll from '../components/RevealOnScroll'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Services — Property Management & Finder | Fab Vacay Vibes',
  description: 'Fab Vacay Vibes offers expert short-term rental property management and investment property finder services across Florida and California.',
}

export default function ServicesPage() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg,#2D1B69 0%,#1E0F45 60%,#3d1a0a 100%)', padding: '160px 48px 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(244,162,58,0.08) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700, margin: '0 auto' }}>
          <p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 20 }}>Beyond The Stay</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 24 }}>
            We Help You <em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>Own</em> the Market
          </h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 40 }}>
            Whether you own a property that needs expert management, or you're looking to invest in your first short-term rental — we have the experience to help you succeed.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#property-management" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, borderRadius: 2, textDecoration: 'none' }}>Property Management</a>
            <a href="#property-finder" style={{ border: '1px solid rgba(244,162,58,0.4)', color: 'var(--orange)', padding: '14px 28px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>Find an Investment</a>
          </div>
        </div>
      </section>

      {/* PROPERTY MANAGEMENT */}
      <section id="property-management" style={{ padding: '100px 48px', background: '#100820', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>For Property Owners</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'white', lineHeight: 1.15, marginBottom: 20, maxWidth: 700 }}>
              Let Us Manage Your Short-Term Rental
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 600, marginBottom: 60 }}>
              We handle everything — from listing optimization and guest communications to cleaning coordination and dynamic pricing — so you earn more without lifting a finger.
            </p>
          </RevealOnScroll>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2, marginBottom: 64 }}>
            {[
              { icon: '📸', title: 'Professional Listing Setup', desc: 'Stunning photography, compelling descriptions, and optimized listings across Airbnb, VRBO, and direct booking.' },
              { icon: '💰', title: 'Dynamic Pricing', desc: 'AI-powered pricing that adjusts daily based on demand, seasonality, and local events to maximize your revenue.' },
              { icon: '🧹', title: 'Cleaning & Maintenance', desc: 'Vetted cleaning crews, supply restocking, and proactive maintenance coordination after every guest.' },
              { icon: '💬', title: '24/7 Guest Communication', desc: 'Instant responses to inquiries and round-the-clock guest support — glowing reviews, guaranteed.' },
              { icon: '📊', title: 'Owner Dashboard', desc: 'Real-time visibility into bookings, revenue, and expenses. Monthly statements delivered automatically.' },
              { icon: '🛡️', title: 'Risk & Damage Protection', desc: 'Thorough guest screening, security deposits, and damage claim management so you are always protected.' },
            ].map(({ icon, title, desc }) => (
              <RevealOnScroll key={title}>
                <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.1)', padding: 36, height: '100%' }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{icon}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: 'white', marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll>
            <div style={{ display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap', padding: '48px', background: 'linear-gradient(135deg, rgba(244,162,58,0.08) 0%, rgba(30,15,69,0.5) 100%)', border: '1px solid rgba(244,162,58,0.2)', borderRadius: 4 }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 300, color: 'var(--orange-warm)', marginBottom: 8 }}>
                  Ready to unlock your property&apos;s potential?
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  We manage properties across the US with deep expertise in Florida and California. Get a free revenue projection for your home.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
                <a href="mailto:FabVacayVibes@gmail.com?subject=Property Management Inquiry" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '16px 32px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, borderRadius: 2, textDecoration: 'none', textAlign: 'center' }}>
                  Get Free Estimate
                </a>
                <a href="tel:7273869642" style={{ border: '1px solid rgba(244,162,58,0.4)', color: 'var(--orange)', padding: '14px 32px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none', textAlign: 'center' }}>
                  Call (727) 386-9642
                </a>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* PROPERTY FINDER */}
      <section id="property-finder" style={{ padding: '100px 48px', background: 'var(--purple)', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }} className="why-grid">
            <div>
              <RevealOnScroll>
                <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Investment Services</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
                  We Find Your Next Short-Term Rental Investment
                </h2>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: 32 }}>
                  Looking to invest in a vacation rental anywhere in the US but don&apos;t know where to start? We source, analyze, and vet properties across the country&apos;s most lucrative short-term rental markets — so you buy with confidence.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
                  {[
                    { step: '01', title: 'Define Your Goals', desc: 'We start with your budget, preferred markets, and return expectations to build your ideal property profile.' },
                    { step: '02', title: 'Market Research & Sourcing', desc: 'We identify high-yield markets and source on and off-market properties with strong STR revenue potential.' },
                    { step: '03', title: 'Revenue Projections', desc: 'Every property comes with a detailed STR analysis — projected occupancy, nightly rates, and annual ROI.' },
                    { step: '04', title: 'Acquisition Support', desc: 'We guide you through offers, inspections, and closing — and can manage your new property from day one.' },
                  ].map(({ step, title, desc }) => (
                    <RevealOnScroll key={step}>
                      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                        <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, color: 'rgba(244,162,58,0.25)', fontWeight: 300, lineHeight: 1, flexShrink: 0, width: 48 }}>{step}</span>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--orange-warm)', marginBottom: 4 }}>{title}</p>
                          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{desc}</p>
                        </div>
                      </div>
                    </RevealOnScroll>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <a href="mailto:FabVacayVibes@gmail.com?subject=Property Finder Inquiry" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '16px 32px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, borderRadius: 2, textDecoration: 'none' }}>
                    Start Your Search
                  </a>
                  <a href="tel:7273869642" style={{ border: '1px solid rgba(244,162,58,0.4)', color: 'var(--orange)', padding: '16px 32px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none' }}>
                    Schedule a Call
                  </a>
                </div>
              </RevealOnScroll>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <RevealOnScroll delay={200}>
                <div style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(244,162,58,0.15)', borderRadius: 4, padding: 32 }}>
                  <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 24 }}>Markets Across the USA</p>
                  {[
                    { market: 'Florida (Statewide)', tag: 'Beach · Theme Parks · Year-Round' },
                    { market: 'Myrtle Beach, SC', tag: 'Beach · Golf · Family Getaways' },
                    { market: 'Poconos, PA', tag: 'Mountain · Ski · Lakefront Cabins' },
                    { market: 'Outer Banks, NC', tag: 'Beachfront · High Season Premiums' },
                    { market: 'Smoky Mountains, TN/NC', tag: 'Cabin · All-Season Bookings' },
                    { market: 'Joshua Tree, CA', tag: 'Desert · High Weekend Rates' },
                    { market: 'Oakhurst / Yosemite, CA', tag: 'Mountain · Peak Season Premiums' },
                    { market: 'Utah (Moab / St. George)', tag: 'National Parks · Adventure Travel' },
                    { market: 'Hocking Hills, OH', tag: 'Cabin · Nature · Weekend Escapes' },
                    { market: 'Red River Gorge, KY', tag: 'Scenic · Climbing · Retreat' },
                    { market: 'Scottsdale, AZ', tag: 'Luxury · Event-Driven Revenue' },
                    { market: 'Gulf Shores, AL', tag: 'Beach · Affordable · High Demand' },
                  ].map(({ market, tag }) => (
                    <div key={market} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(244,162,58,0.08)', flexWrap: 'wrap', gap: 8 }}>
                      <span style={{ fontSize: 14, color: 'var(--cream)' }}>{market}</span>
                      <span style={{ fontSize: 10, letterSpacing: 1.5, color: 'var(--orange)', background: 'rgba(244,162,58,0.08)', padding: '4px 10px', borderRadius: 2 }}>{tag}</span>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={300}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { value: '3+', label: 'Years STR Experience' },
                    { value: '15%+', label: 'Avg. Cash-on-Cash Return' },
                    { value: '85%+', label: 'Average Occupancy Rate' },
                    { value: '5★', label: 'Average Guest Rating' },
                  ].map(({ value, label }) => (
                    <div key={label} style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.1)', borderRadius: 4, padding: '20px 16px', textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 36, color: 'var(--orange-warm)', fontWeight: 300, margin: 0 }}>{value}</p>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: 1, marginTop: 4 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ padding: '80px 48px', background: '#100820', borderTop: '1px solid rgba(244,162,58,0.08)', textAlign: 'center' }}>
        <Link href="/" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 14, color: 'var(--orange)', textDecoration: 'none', letterSpacing: 2, textTransform: 'uppercase', opacity: 0.8 }}>
          ← Back to Properties
        </Link>
      </section>
    </>
  )
}
