import Nav from './components/Nav'
import PropertyCard from './components/PropertyCard'
import RevealOnScroll from './components/RevealOnScroll'
import { properties } from './lib/properties'

export default function Home() {
  return (
    <>
      <Nav />

      {/* HERO */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', overflow: 'hidden',
        padding: '120px 24px 80px',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 80%, rgba(244,162,58,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 20% 20%, rgba(74,26,107,0.6) 0%, transparent 50%),
            linear-gradient(175deg, #1E0F45 0%, #2D1B69 40%, #1A0D3D 100%)`,
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `radial-gradient(1px 1px at 15% 20%, rgba(255,255,255,0.6) 0%, transparent 100%),
            radial-gradient(1.5px 1.5px at 55% 15%, rgba(247,192,90,0.7) 0%, transparent 100%),
            radial-gradient(1px 1px at 75% 8%, rgba(255,255,255,0.5) 0%, transparent 100%),
            radial-gradient(1px 1px at 90% 55%, rgba(255,255,255,0.3) 0%, transparent 100%)`,
        }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 280, background: 'linear-gradient(to top, rgba(232,98,26,0.25) 0%, rgba(244,162,58,0.1) 40%, transparent 100%)' }} />
        <svg style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', height: 220, pointerEvents: 'none' }} viewBox="0 0 1440 220" preserveAspectRatio="none">
          <polygon points="0,220 180,80 360,220" fill="#2D1B69" opacity="0.7"/>
          <polygon points="200,220 420,60 640,220" fill="#1A0D3D" opacity="0.9"/>
          <polygon points="500,220 720,90 940,220" fill="#2D1B69" opacity="0.7"/>
          <polygon points="760,220 980,70 1200,220" fill="#1A0D3D" opacity="0.9"/>
          <polygon points="1040,220 1240,85 1440,220" fill="#2D1B69" opacity="0.7"/>
          <polygon points="0,220 280,120 560,220" fill="#100820" opacity="0.85"/>
          <polygon points="400,220 680,105 960,220" fill="#100820" opacity="0.85"/>
          <polygon points="800,220 1080,115 1360,220" fill="#100820" opacity="0.85"/>
          <rect x="0" y="200" width="1440" height="20" fill="#100820"/>
        </svg>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}>
          <p style={{ fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 28, opacity: 0, animation: 'fadeUp 0.8s ease 0.2s forwards' }}>
            Beach · Mountain · Desert
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(52px,8vw,96px)', fontWeight: 300, lineHeight: 0.95, color: 'white', marginBottom: 12, opacity: 0, animation: 'fadeUp 0.9s ease 0.4s forwards' }}>
            <em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>Extraordinary</em><br />
            <strong style={{ fontWeight: 600 }}>Stays.</strong> Unforgettable<br />Vibes.
          </h1>
          <p style={{ fontSize: 14, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 36, opacity: 0, animation: 'fadeUp 0.9s ease 0.55s forwards' }}>
            Luxury Vacation Rentals
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto 48px', opacity: 0, animation: 'fadeUp 0.9s ease 0.65s forwards' }}>
            Three handpicked estates across America&apos;s most breathtaking landscapes. Book direct for the best rates.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', opacity: 0, animation: 'fadeUp 0.9s ease 0.8s forwards' }}>
            <a href="#properties" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '16px 36px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, borderRadius: 2, textDecoration: 'none' }}>Explore Properties</a>
            <a href="#properties" style={{ border: '1px solid rgba(244,162,58,0.5)', color: 'var(--orange)', padding: '16px 36px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none', background: 'transparent' }}>Book Direct &amp; Save</a>
          </div>
        </div>


      </section>

      {/* ICON BAR */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 60, padding: 'clamp(20px,4vw,32px) clamp(20px,4vw,48px)', background: 'rgba(244,162,58,0.06)', borderTop: '1px solid rgba(244,162,58,0.12)', borderBottom: '1px solid rgba(244,162,58,0.12)', flexWrap: 'wrap' }}>
        {[['🌊', 'Clearwater Beach, FL'], ['🏜️', 'Joshua Tree, CA'], ['🏔️', 'Oakhurst, CA']].map(([icon, label]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: 18 }}>{icon}</span><span>{label}</span>
          </div>
        ))}
      </div>

      {/* PROPERTIES */}
      <section id="properties" className="section-pad" style={{ background: 'var(--purple)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 56, flexWrap: 'wrap', gap: 24 }}>
          <div>
            <RevealOnScroll><p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Our Collection</p></RevealOnScroll>
            <RevealOnScroll delay={100}><h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,58px)', fontWeight: 300, color: 'white', lineHeight: 1.1 }}>Three <em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>distinct</em><br />escapes.</h2></RevealOnScroll>
          </div>
          <RevealOnScroll delay={200}><p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-muted)', maxWidth: 400, textAlign: 'right' }}>Each property handpicked for its setting, character, and exceptional amenities. Book direct for the best rates.</p></RevealOnScroll>
        </div>
        <RevealOnScroll delay={300}>
          <div className="prop-grid">
            <div><PropertyCard property={properties[0]} large /></div>
            <PropertyCard property={properties[1]} />
            <PropertyCard property={properties[2]} />
          </div>
        </RevealOnScroll>
      </section>

      {/* WHY BOOK DIRECT */}
      <section id="why" className="section-pad" style={{ background: 'linear-gradient(160deg,#160a35 0%,#1E0F45 50%,#250D52 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(244,162,58,0.08) 0%, transparent 70%)' }} />
        <div className="why-grid">
          <div>
            <RevealOnScroll><p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Why Book Direct</p></RevealOnScroll>
            <RevealOnScroll delay={100}><h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,58px)', fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 20 }}>Skip the <em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>fees.</em><br />Keep the luxury.</h2></RevealOnScroll>
            <RevealOnScroll delay={200}><p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-muted)', maxWidth: 480, marginBottom: 40 }}>Booking directly with Fab Vacay Vibes means lower rates, flexible terms, and a personal host who knows every property intimately.</p></RevealOnScroll>
            <RevealOnScroll delay={300}>
              <div className="why-features">
                {[['💰','Best Rate Guarantee','No Airbnb or VRBO service fees. Book direct and save up to 15%.'],['🤝','Personal Service','Direct line to your host. Fast responses, local tips, and real care.'],['🔒','Flexible Terms','More flexible cancellation policies when you book with us directly.'],['✨','Luxury Assured','Every stay is managed and inspected to the highest standard.']].map(([icon,title,desc]) => (
                  <div key={title as string} style={{ borderTop: '1px solid rgba(244,162,58,0.2)', paddingTop: 24 }}>
                    <div style={{ fontSize: 24, marginBottom: 12 }}>{icon}</div>
                    <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: 'white', marginBottom: 8 }}>{title}</h4>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
          <RevealOnScroll delay={200}>
            <div style={{ borderRadius: 4, overflow: 'hidden', background: 'linear-gradient(135deg,#2D1B69 0%,#1A0D3D 40%,#3d1a0a 100%)', padding: 40 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {[['3','Curated Properties'],['5★','Average Guest Rating'],['100%','Personally Managed']].map(([num,label]) => (
                  <div key={label as string} style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(244,162,58,0.15)', padding: '28px 32px', borderRadius: 3 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 52, color: 'var(--orange-warm)', fontWeight: 300, lineHeight: 1 }}>{num}</div>
                    <div style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: 6 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="reviews" className="section-pad" style={{ background: 'var(--purple)', textAlign: 'center' }}>
        <RevealOnScroll><p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Guest Reviews</p></RevealOnScroll>
        <RevealOnScroll delay={100}><h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,58px)', fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 56 }}>What our <em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>guests</em> say.</h2></RevealOnScroll>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
          {[
            { text: '"Absolutely stunning property. The views from Sierra Crest at sunrise were something I\'ll never forget. Perfectly managed, immaculate."', author: 'Michael R.', prop: 'Sierra Crest Haven' },
            { text: '"Owl & Hare is magic. The Airstream, the hot tub under the stars, the silence of the desert — we\'ve already rebooked for next year."', author: 'Sarah & James T.', prop: 'Owl & Hare, Joshua Tree' },
            { text: '"Casa Grandè was perfect for our big family trip. Pool, beach, space for everyone — and the host responded instantly every time."', author: 'The Flores Family', prop: 'Casa Grandè, Clearwater' },
          ].map((t, i) => (
            <RevealOnScroll key={t.author} delay={i * 100}>
              <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.12)', padding: '40px 36px', borderRadius: 3, textAlign: 'left' }}>
                <div style={{ color: 'var(--orange)', fontSize: 14, letterSpacing: 3, marginBottom: 20 }}>★★★★★</div>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 19, fontStyle: 'italic', color: 'var(--cream)', lineHeight: 1.6, marginBottom: 24 }}>{t.text}</p>
                <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--orange)' }}>{t.author}</p>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{t.prop}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* CTA */}

      {/* PROPERTY MANAGEMENT */}
      <section id="property-management" className="section-pad" style={{ background: '#100820', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>For Property Owners</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 300, color: 'white', lineHeight: 1.15, marginBottom: 20, maxWidth: 700 }}>
              Let Us Manage Your Short-Term Rental
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 600, marginBottom: 60 }}>
              We handle everything — from listing optimization and guest communications to cleaning coordination and dynamic pricing — so you earn more without lifting a finger.
            </p>
          </RevealOnScroll>

          {/* Features grid */}
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
                <div style={{ background: 'rgba(253,246,236,0.03)', border: '1px solid rgba(244,162,58,0.1)', padding: 36, transition: 'border-color 0.3s' }}>
                  <div style={{ fontSize: 32, marginBottom: 16 }}>{icon}</div>
                  <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 400, color: 'white', marginBottom: 10 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          {/* CTA */}
          <RevealOnScroll>
            <div style={{ display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap', padding: '48px', background: 'linear-gradient(135deg, rgba(244,162,58,0.08) 0%, rgba(30,15,69,0.5) 100%)', border: '1px solid rgba(244,162,58,0.2)', borderRadius: 4 }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, fontWeight: 300, color: 'var(--orange-warm)', marginBottom: 8 }}>
                  Ready to unlock your property&apos;s potential?
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>
                  We manage properties across Florida and California. Get a free revenue projection for your home.
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
      <section id="property-finder" className="section-pad" style={{ background: 'var(--purple)', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="why-grid">
            {/* Left: copy */}
            <div>
              <RevealOnScroll>
                <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Investment Services</p>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 300, color: 'white', lineHeight: 1.15, marginBottom: 24 }}>
                  We Find Your Next Short-Term Rental Investment
                </h2>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.85, marginBottom: 32 }}>
                  Looking to invest in a vacation rental but don&apos;t know where to start? We source, analyze, and vet properties in the most lucrative short-term rental markets — so you buy with confidence.
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

            {/* Right: stats + markets */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <RevealOnScroll delay={200}>
                <div style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(244,162,58,0.15)', borderRadius: 4, padding: 32 }}>
                  <p style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 24 }}>Markets We Know</p>
                  {[
                    { market: 'Clearwater / Tampa Bay, FL', tag: 'Beach · Year-Round Demand' },
                    { market: 'Joshua Tree, CA', tag: 'Desert · High Weekend Rates' },
                    { market: 'Oakhurst / Yosemite, CA', tag: 'Mountain · Peak Season Premiums' },
                    { market: 'Scottsdale, AZ', tag: 'Luxury · Event-Driven Revenue' },
                    { market: 'Smoky Mountains, TN', tag: 'Cabin · All-Season Bookings' },
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

      <section id="contact" className="section-pad" style={{ textAlign: 'center', background: 'linear-gradient(135deg,#2D1B69 0%,#1E0F45 50%,#3d1a0a 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(244,162,58,0.1) 0%, transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <RevealOnScroll><p style={{ fontSize: 10, letterSpacing: 5, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Ready to Escape?</p></RevealOnScroll>
          <RevealOnScroll delay={100}><h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,58px)', fontWeight: 300, color: 'white', lineHeight: 1.1, maxWidth: 600, margin: '0 auto 20px' }}>Your <em style={{ color: 'var(--orange-warm)', fontStyle: 'italic' }}>perfect</em><br />stay awaits.</h2></RevealOnScroll>
          <RevealOnScroll delay={200}>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 40px' }}>Book direct for the best rates and personal service. We&apos;d love to host you.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#properties" style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '16px 36px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, borderRadius: 2, textDecoration: 'none' }}>Check Availability</a>
              <a href="tel:7273869642" style={{ border: '1px solid rgba(244,162,58,0.5)', color: 'var(--orange)', padding: '16px 36px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 400, borderRadius: 2, textDecoration: 'none', background: 'transparent' }}>(727) 386-9642</a>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer" style={{ background: '#100820', borderTop: '1px solid rgba(244,162,58,0.1)' }}>
        <div className="footer-inner">
          <div>
            <a href="/" style={{ textDecoration: 'none', display: 'block', marginBottom: 12 }}>
              <img src="/logo.svg" alt="Fab Vacay Vibes" style={{ height: 48, width: 'auto' }} />
            </a>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 260 }}>Luxury vacation rentals across America&apos;s most stunning landscapes.</p>
          </div>
          {[
            { title: 'Properties', links: properties.map(p => ({ label: p.name, href: `/properties/${p.slug}` })) },
            { title: 'Quick Links', links: [{ label: 'Properties', href: '#properties' }, { label: 'Reviews', href: '#reviews' }, { label: 'List Your Property', href: '#property-management' }, { label: 'Find a Property', href: '#property-finder' }, { label: 'Contact', href: '#contact' }] },
            { title: 'Contact', links: [{ label: '(727) 386-9642', href: 'tel:7273869642' }, { label: 'FabVacayVibes@gmail.com', href: 'mailto:FabVacayVibes@gmail.com' }] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => <li key={l.label}><a href={l.href} style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>{l.label}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(244,162,58,0.08)', paddingTop: 24, flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 12, color: 'rgba(253,246,236,0.3)' }}>© 2026 Fab Vacay Vibes. All rights reserved.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="https://www.facebook.com/profile.php?id=100093956902449" target="_blank" style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)', textDecoration: 'none' }}>Facebook</a>
            <a href="https://www.instagram.com/fabvacayvibes" target="_blank" style={{ fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-muted)', textDecoration: 'none' }}>Instagram</a>
          </div>
        </div>
      </footer>
    </>
  )
}
// build-bust: 2026-05-13T07:45:00Z
