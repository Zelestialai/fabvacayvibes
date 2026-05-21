'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  function handleHashNav(hash: string) {
    setMenuOpen(false)
    if (isHome) {
      const el = document.querySelector(hash)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    } else {
      router.push('/' + hash)
    }
  }

  const navLinks = [
    { label: 'Properties', hash: '#properties' },
    { label: 'About', hash: '#why' },
    { label: 'Reviews', hash: '#reviews' },
    { label: 'List Your Property', hash: '#property-management' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        background: scrolled || menuOpen ? 'rgba(30,15,69,0.97)' : 'linear-gradient(to bottom,rgba(30,15,69,0.95),transparent)',
        backdropFilter: scrolled || menuOpen ? 'blur(12px)' : 'none',
        transition: 'background 0.4s, backdrop-filter 0.4s',
      }}>
        <Link href="/" style={{ textDecoration: 'none', zIndex: 101, display: 'flex', alignItems: 'center' }}>
          <img src="/logo.svg" alt="Fab Vacay Vibes" height={44} style={{ height: 44, width: 'auto' }} />
        </Link>

        {/* Desktop links */}
        <ul style={{ display: 'flex', gap: 36, alignItems: 'center', listStyle: 'none', margin: 0, padding: 0 }}
          className="nav-desktop">
          {navLinks.map(({ label, hash }) => (
            <li key={hash}>
              <button
                onClick={() => handleHashNav(hash)}
                style={{ fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--cream)', background: 'none', border: 'none', cursor: 'pointer', opacity: 0.8, fontFamily: 'inherit' }}
              >
                {label}
              </button>
            </li>
          ))}
          <li>
            <Link
              href="/#properties"
              onClick={(e) => { e.preventDefault(); handleHashNav('#properties') }}
              style={{ background: 'var(--orange)', color: 'var(--purple)', padding: '10px 22px', borderRadius: 2, fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}
            >
              Book Direct
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          className="nav-hamburger"
          aria-label="Toggle menu"
          style={{ background: 'none', border: 'none', cursor: 'pointer', zIndex: 101, padding: 4 }}
        >
          <div style={{ width: 24, height: 2, background: 'var(--orange-warm)', marginBottom: 5, transition: 'transform 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
          <div style={{ width: 24, height: 2, background: 'var(--orange-warm)', marginBottom: 5, transition: 'opacity 0.3s', opacity: menuOpen ? 0 : 1 }} />
          <div style={{ width: 24, height: 2, background: 'var(--orange-warm)', transition: 'transform 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile dropdown menu */}
      <div
        className="nav-mobile-menu"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99,
          background: 'rgba(16,8,32,0.98)',
          backdropFilter: 'blur(16px)',
          padding: '100px 40px 48px',
          transform: menuOpen ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}
      >
        {navLinks.map(({ label, hash }) => (
          <button
            key={hash}
            onClick={() => handleHashNav(hash)}
            style={{ fontSize: 28, fontFamily: "'Cormorant Garamond',serif", fontWeight: 300, color: 'white', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '12px 0', borderBottom: '1px solid rgba(244,162,58,0.1)' }}
          >
            {label}
          </button>
        ))}
        <div style={{ marginTop: 24 }}>
          <Link
            href="/properties/casa-grande"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', padding: '8px 0', textDecoration: 'none', letterSpacing: 1 }}
          >→ Casa Grandè</Link>
          <Link
            href="/properties/owl-and-hare"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', padding: '8px 0', textDecoration: 'none', letterSpacing: 1 }}
          >→ Owl & Hare</Link>
          <Link
            href="/properties/sierra-crest-haven"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', padding: '8px 0', textDecoration: 'none', letterSpacing: 1 }}
          >→ Sierra Crest Haven</Link>
          <Link
            href="/#property-management"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'block', fontSize: 13, color: 'var(--orange)', padding: '8px 0', textDecoration: 'none', letterSpacing: 1, borderTop: '1px solid rgba(244,162,58,0.1)', marginTop: 8, paddingTop: 16 }}
          >✦ List Your Property</Link>
        </div>
        <button
          onClick={() => { handleHashNav('#properties'); setMenuOpen(false) }}
          style={{ marginTop: 24, background: 'var(--orange)', color: 'var(--purple)', padding: '16px 24px', fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', fontWeight: 500, border: 'none', cursor: 'pointer', borderRadius: 2, fontFamily: 'inherit' }}
        >
          Book Direct
        </button>
      </div>

      <style>{`
        .nav-hamburger { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: block; }
        }
        nav { padding: 20px 48px; }
        @media (max-width: 768px) {
          nav { padding: 20px 24px !important; }
        }
      `}</style>
    </>
  )
}
