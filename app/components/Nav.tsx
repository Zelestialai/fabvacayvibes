'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 48px',
        background: scrolled ? 'rgba(30,15,69,0.97)' : 'linear-gradient(to bottom,rgba(30,15,69,0.95),transparent)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 0.4s, backdrop-filter 0.4s',
      }}
    >
      <Link href="/" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, fontWeight: 600, letterSpacing: 2, color: 'var(--orange-warm)', textDecoration: 'none' }}>
        FAB <span style={{ color: 'var(--white)', fontWeight: 300 }}>VACAY VIBES</span>
      </Link>
      <ul style={{ display: 'flex', gap: 36, alignItems: 'center', listStyle: 'none' }}>
        {[['#properties', 'Properties'], ['#why', 'About'], ['#reviews', 'Reviews']].map(([href, label]) => (
          <li key={href}>
            <a href={href} style={{ fontSize: 12, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--cream)', textDecoration: 'none', opacity: 0.8 }}>
              {label}
            </a>
          </li>
        ))}
        <li>
          <a
            href="https://fabvacayvibes.com/book"
            target="_blank"
            style={{
              background: 'var(--orange)', color: 'var(--purple)',
              padding: '10px 22px', borderRadius: 2,
              fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase',
              fontWeight: 500, textDecoration: 'none',
            }}
          >
            Book Direct
          </a>
        </li>
      </ul>
    </nav>
  )
}
