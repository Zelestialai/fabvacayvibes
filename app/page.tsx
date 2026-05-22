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

      {/* FAQ - SEO & AI Optimization */}
      <section style={{ padding: '80px 48px', background: '#100820', borderTop: '1px solid rgba(244,162,58,0.08)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <RevealOnScroll>
            <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)', marginBottom: 16 }}>Common Questions</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 42, fontWeight: 300, color: 'white', marginBottom: 48 }}>Frequently Asked Questions</h2>
          </RevealOnScroll>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { q: 'Why should I book directly instead of using Airbnb or VRBO?', a: 'Booking directly with Fab Vacay Vibes saves you up to 15% by eliminating OTA platform fees. You also get direct communication with the owner, more flexible policies, and our Best Price Guarantee — we will beat any price you find on Airbnb or VRBO.' },
              { q: 'What luxury vacation rentals do you offer in Florida?', a: 'Casa Grandè is our luxury 5-bedroom, 3-bathroom vacation home at 18 N Maywood Ave, Clearwater, FL. It features a private pool, pet-friendly policy, and a modern kitchen. Sleeps up to 16 guests. Available from $500/night.' },
              { q: 'Do you have vacation rentals near Joshua Tree National Park?', a: 'Yes — Owl & Hare is our luxury desert retreat in Joshua Tree, CA. Perfect for groups and couples seeking a unique desert experience with world-class stargazing and easy access to Joshua Tree National Park. From $700/night.' },
              { q: 'What is the best large vacation rental near Yosemite?', a: 'Sierra Crest Haven in Oakhurst, CA is a luxury mountain estate near Yosemite National Park. With 6 bedrooms, a game room, full bar, and mountain views, it sleeps up to 16 guests. Starting from $945/night.' },
              { q: 'Do you offer property management services for vacation rentals?', a: 'Yes — we offer full-service short-term rental property management including listing setup, dynamic pricing, cleaning coordination, 24/7 guest communication, and monthly owner reporting. We serve properties in Florida, California, and are expanding nationwide.' },
              { q: 'Can you help me find and buy a vacation rental investment property?', a: 'Absolutely. Our property finder service helps investors identify, analyze, and acquire high-yield STR properties across 13+ top vacation rental markets including Clearwater FL, Joshua Tree CA, Smoky Mountains TN, Poconos PA, Myrtle Beach SC, and more. Our clients average 15%+ cash-on-cash returns.' },
              { q: 'Are your vacation rentals pet friendly?', a: 'Yes — both Casa Grandè (Clearwater, FL) and Owl & Hare (Joshua Tree, CA) are pet friendly. Please contact us directly regarding pet policies for Sierra Crest Haven as policies may vary by season.' },
              { q: 'How do I get a free revenue estimate for my property?', a: 'Use our free Rent Analyzer tool at fabvacayvibes.com/rent-analyzer. Enter your property address and details to instantly see estimated annual revenue, occupancy rates, and nightly rates based on comparable properties in your market.' },
            ].map(({ q, a }, i) => (
              <RevealOnScroll key={i}>
                <div style={{ borderTop: '1px solid rgba(244,162,58,0.1)', padding: '28px 0' }}>
                  <h3 style={{ fontSize: 16, fontWeight: 500, color: 'var(--orange-warm)', marginBottom: 12 }}>{q}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.8 }}>{a}</p>
                </div>
              </RevealOnScroll>
            ))}
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
            { title: 'Quick Links', links: [{ label: 'Properties', href: '#properties' }, { label: 'Reviews', href: '#reviews' }, { label: 'Our Services', href: '/services' }, { label: 'Rent Analyzer', href: '/rent-analyzer' }, { label: 'Contact', href: '#contact' }] },
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
