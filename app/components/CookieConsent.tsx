'use client'
import { useEffect, useState } from 'react'

const CONSENT_KEY = 'fvv_cookie_consent'
const CONSENT_VERSION = '1' // bump to re-prompt after policy changes

type ConsentState = 'granted' | 'denied' | null

// EU member states + UK + EEA (ISO 3166-1 alpha-2)
const EU_UK_TIMEZONE_PREFIXES = ['Europe/', 'Atlantic/Reykjavik', 'Atlantic/Faroe']

function isEuUkTimezone(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    return EU_UK_TIMEZONE_PREFIXES.some(prefix => tz.startsWith(prefix))
  } catch {
    return false // default to not showing if detection fails
  }
}

function loadConsent(): ConsentState {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.version !== CONSENT_VERSION) return null
    return parsed.value as ConsentState
  } catch {
    return null
  }
}

function saveConsent(value: 'granted' | 'denied') {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, version: CONSENT_VERSION }))
  } catch { /* ignore */ }
}

/**
 * Applies consent to GA4 and OpenAI pixel.
 * Called both on initial load (from stored preference) and after user choice.
 */
export function applyConsent(state: 'granted' | 'denied') {
  // GA4 consent mode v2
  if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: Function }).gtag === 'function') {
    const gtag = (window as unknown as { gtag: Function }).gtag
    gtag('consent', 'update', {
      analytics_storage: state,
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
    })
  }

  // OpenAI pixel — suppress/enable future events
  // oaiq queues calls, so we use a flag checked in layout
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>)['__fvv_analytics_consent'] = state === 'granted'
  }
}

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Only show for EU/UK visitors
    if (!isEuUkTimezone()) return

    const stored = loadConsent()
    if (stored !== null) {
      applyConsent(stored)
      return
    }

    // No stored preference — show the banner
    setShow(true)
  }, [])

  function handleAccept() {
    saveConsent('granted')
    applyConsent('granted')
    setShow(false)
  }

  function handleDecline() {
    saveConsent('denied')
    applyConsent('denied')
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: '#18181b',
        borderTop: '1px solid #3f3f46',
        padding: '16px 24px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '12px',
        fontFamily: 'inherit',
      }}
    >
      <p style={{ flex: '1 1 260px', margin: 0, fontSize: '14px', color: '#d4d4d8', lineHeight: '1.5' }}>
        We use cookies to analyse site traffic and improve your experience.{' '}
        <a
          href="/privacy"
          style={{ color: '#a78bfa', textDecoration: 'underline' }}
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy policy
        </a>
        .
      </p>
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          onClick={handleDecline}
          style={{
            padding: '8px 18px',
            borderRadius: '6px',
            border: '1px solid #52525b',
            background: 'transparent',
            color: '#a1a1aa',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Decline
        </button>
        <button
          onClick={handleAccept}
          style={{
            padding: '8px 18px',
            borderRadius: '6px',
            border: 'none',
            background: '#7c3aed',
            color: '#fff',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 600,
          }}
        >
          Accept
        </button>
      </div>
    </div>
  )
}
