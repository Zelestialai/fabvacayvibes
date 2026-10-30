import Nav from '../components/Nav'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Fab Vacay Vibes',
  description: 'Privacy policy for Fab Vacay Vibes — how we collect, use, and protect your personal data.',
  robots: { index: true, follow: false },
}

const CONTACT_EMAIL = 'FabVacayVibes@gmail.com'
const EFFECTIVE_DATE = 'October 30, 2026'

const s: Record<string, React.CSSProperties> = {
  page: { background: '#0d0a1a', minHeight: '100vh', color: 'var(--text-muted, #a0a0b0)' },
  hero: { background: 'linear-gradient(135deg,#2D1B69 0%,#1E0F45 100%)', padding: '140px 48px 72px', textAlign: 'center' },
  label: { fontSize: 10, letterSpacing: 5, textTransform: 'uppercase' as const, color: 'var(--orange, #f4a23a)', marginBottom: 16 },
  h1: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(36px,5vw,60px)', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: 12 },
  effectiveDate: { fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 12 },
  body: { maxWidth: 780, margin: '0 auto', padding: '72px 32px 120px' },
  h2: { fontFamily: "'Cormorant Garamond',serif", fontSize: 28, fontWeight: 400, color: '#fff', marginBottom: 14, marginTop: 56, borderBottom: '1px solid rgba(244,162,58,0.12)', paddingBottom: 10 },
  p: { fontSize: 15, lineHeight: 1.85, marginBottom: 16 },
  ul: { paddingLeft: 20, marginBottom: 16 },
  li: { fontSize: 15, lineHeight: 1.85, marginBottom: 6 },
  a: { color: 'var(--orange, #f4a23a)', textDecoration: 'underline' },
}

export default function PrivacyPage() {
  return (
    <div style={s.page}>
      <Nav />

      <div style={s.hero}>
        <p style={s.label}>Legal</p>
        <h1 style={s.h1}>Privacy Policy</h1>
        <p style={s.effectiveDate}>Effective date: {EFFECTIVE_DATE}</p>
      </div>

      <div style={s.body}>

        <p style={s.p}>
          Fab Vacay Vibes (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates{' '}
          <a href="https://fabvacayvibes.com" style={s.a}>fabvacayvibes.com</a> (the &ldquo;Site&rdquo;).
          This Privacy Policy explains what personal data we collect, why we collect it, and your rights
          regarding that data. It applies to all visitors and guests worldwide and meets the requirements
          of the EU General Data Protection Regulation (GDPR), the UK General Data Protection Regulation
          (UK GDPR), and the California Consumer Privacy Act (CCPA).
        </p>

        {/* ── 1. DATA WE COLLECT ── */}
        <h2 style={s.h2}>1. Data We Collect</h2>
        <p style={s.p}><strong style={{ color: '#fff' }}>Information you provide directly:</strong></p>
        <ul style={s.ul}>
          <li style={s.li}>Name, email address, and phone number when you submit an inquiry or make a booking.</li>
          <li style={s.li}>Travel dates, number of guests, and special requests included in your booking.</li>
          <li style={s.li}>Messages you send us via the contact or inquiry forms.</li>
        </ul>
        <p style={s.p}><strong style={{ color: '#fff' }}>Information collected automatically:</strong></p>
        <ul style={s.ul}>
          <li style={s.li}>Pages viewed, time on site, and navigation path (via Google Analytics 4).</li>
          <li style={s.li}>Device type, browser, operating system, and approximate location (city/region level).</li>
          <li style={s.li}>Referral source, including UTM campaign parameters from ads or links you clicked.</li>
          <li style={s.li}>Interactions with our site (button clicks, form submissions) tracked as analytics events.</li>
        </ul>
        <p style={s.p}><strong style={{ color: '#fff' }}>Cookies and similar technologies:</strong></p>
        <ul style={s.ul}>
          <li style={s.li}><em>Essential cookies</em> — required for the booking flow and session to function. No consent required.</li>
          <li style={s.li}><em>Analytics cookies</em> — Google Analytics 4 cookies (e.g. <code>_ga</code>, <code>_ga_*</code>). Set only with your consent (EU/UK) or in anonymised form (other regions).</li>
          <li style={s.li}><em>Advertising cookies</em> — OpenAI Ads pixel. Set only with your consent (EU/UK).</li>
        </ul>

        {/* ── 2. HOW WE USE YOUR DATA ── */}
        <h2 style={s.h2}>2. How We Use Your Data</h2>
        <ul style={s.ul}>
          <li style={s.li}><strong style={{ color: '#fff' }}>To fulfil your booking</strong> — processing reservations and payments through our booking system (OwnerRez).</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>To communicate with you</strong> — confirming bookings, answering inquiries, and sending pre/post-stay information.</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>To improve the Site</strong> — analysing traffic and user behaviour to make the booking experience better.</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>To measure advertising effectiveness</strong> — understanding which ads or channels drive bookings (with consent where required).</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>To comply with legal obligations</strong> — retaining booking records as required by tax and accounting law.</li>
        </ul>

        {/* ── 3. LEGAL BASIS (EU/UK) ── */}
        <h2 style={s.h2}>3. Legal Basis for Processing (EU &amp; UK Visitors)</h2>
        <ul style={s.ul}>
          <li style={s.li}><strong style={{ color: '#fff' }}>Contract</strong> — processing your booking and communicating with you about it (Art. 6(1)(b) GDPR).</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Consent</strong> — analytics and advertising cookies (Art. 6(1)(a) GDPR). You may withdraw consent at any time.</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Legitimate interests</strong> — Site security and fraud prevention (Art. 6(1)(f) GDPR).</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Legal obligation</strong> — retaining financial records (Art. 6(1)(c) GDPR).</li>
        </ul>

        {/* ── 4. THIRD PARTIES ── */}
        <h2 style={s.h2}>4. Third-Party Services</h2>
        <p style={s.p}>We share data only with the following trusted partners, each bound by their own privacy policies and, where applicable, a Data Processing Agreement with us:</p>
        <ul style={s.ul}>
          <li style={s.li}><strong style={{ color: '#fff' }}>OwnerRez</strong> — our booking and property management system. Receives guest name, email, phone, and travel dates to process reservations. <a href="https://www.ownerrez.com/privacy" style={s.a} target="_blank" rel="noopener noreferrer">Privacy policy ↗</a></li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Google Analytics 4 / Google Ads</strong> — analytics and ad measurement. Data is pseudonymised; IP addresses are anonymised. Governed by Google&rsquo;s Consent Mode v2. <a href="https://policies.google.com/privacy" style={s.a} target="_blank" rel="noopener noreferrer">Privacy policy ↗</a></li>
          <li style={s.li}><strong style={{ color: '#fff' }}>OpenAI Ads</strong> — advertising pixel for measuring ad performance. Activated only with your consent (EU/UK). <a href="https://openai.com/policies/privacy-policy" style={s.a} target="_blank" rel="noopener noreferrer">Privacy policy ↗</a></li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Vercel</strong> — our website hosting provider. Processes server logs and edge request data. <a href="https://vercel.com/legal/privacy-policy" style={s.a} target="_blank" rel="noopener noreferrer">Privacy policy ↗</a></li>
        </ul>
        <p style={s.p}>We do not sell your personal data to any third party.</p>

        {/* ── 5. INTERNATIONAL TRANSFERS ── */}
        <h2 style={s.h2}>5. International Data Transfers</h2>
        <p style={s.p}>
          We are based in the United States. If you are located in the EU or UK, your data is transferred
          to the US under appropriate safeguards — including Standard Contractual Clauses (SCCs) with
          our third-party processors and the UK International Data Transfer Agreement (IDTA) where applicable.
        </p>

        {/* ── 6. RETENTION ── */}
        <h2 style={s.h2}>6. How Long We Keep Your Data</h2>
        <ul style={s.ul}>
          <li style={s.li}><strong style={{ color: '#fff' }}>Booking records</strong> — 7 years (legal/tax requirement).</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Inquiry messages</strong> — 2 years from last contact, or until resolved.</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Analytics data</strong> — 14 months (Google Analytics default retention).</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Cookie consent preference</strong> — stored in your browser; cleared if you clear site data.</li>
        </ul>

        {/* ── 7. YOUR RIGHTS ── */}
        <h2 style={s.h2}>7. Your Rights</h2>
        <p style={s.p}>Depending on where you live, you may have the following rights:</p>
        <ul style={s.ul}>
          <li style={s.li}><strong style={{ color: '#fff' }}>Access</strong> — request a copy of the personal data we hold about you.</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Rectification</strong> — ask us to correct inaccurate data.</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Erasure</strong> (&ldquo;right to be forgotten&rdquo;) — ask us to delete your data where we have no legal obligation to retain it.</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Restriction</strong> — ask us to limit how we use your data while a dispute is resolved.</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Data portability</strong> — receive your data in a machine-readable format.</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Object</strong> — object to processing based on legitimate interests or for direct marketing.</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>Withdraw consent</strong> — change or withdraw cookie consent at any time by clearing this site&rsquo;s data in your browser settings, or by emailing us.</li>
          <li style={s.li}><strong style={{ color: '#fff' }}>CCPA (California)</strong> — the right to know, delete, and opt out of the sale of personal information. We do not sell personal information.</li>
        </ul>
        <p style={s.p}>
          To exercise any right, email us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}?subject=Privacy Request`} style={s.a}>{CONTACT_EMAIL}</a>.
          We will respond within 30 days (EU/UK: one calendar month).
        </p>
        <p style={s.p}>
          EU/UK residents may also lodge a complaint with their local supervisory authority — in the UK,
          the{' '}
          <a href="https://ico.org.uk" style={s.a} target="_blank" rel="noopener noreferrer">Information Commissioner&rsquo;s Office (ICO)</a>.
        </p>

        {/* ── 8. CHILDREN ── */}
        <h2 style={s.h2}>8. Children&rsquo;s Privacy</h2>
        <p style={s.p}>
          Our Site is not directed at children under 16. We do not knowingly collect personal data from
          anyone under 16. If you believe a child has provided us with personal data, please contact us
          and we will delete it promptly.
        </p>

        {/* ── 9. CHANGES ── */}
        <h2 style={s.h2}>9. Changes to This Policy</h2>
        <p style={s.p}>
          We may update this policy from time to time. The effective date at the top of the page will
          reflect the most recent revision. For material changes, we will notify guests with active
          bookings by email.
        </p>

        {/* ── 10. CONTACT ── */}
        <h2 style={s.h2}>10. Contact Us</h2>
        <p style={s.p}>
          For any privacy-related questions or requests:
        </p>
        <p style={{ ...s.p, color: '#fff' }}>
          <strong>Fab Vacay Vibes</strong><br />
          Los Angeles, CA, USA<br />
          <a href={`mailto:${CONTACT_EMAIL}`} style={s.a}>{CONTACT_EMAIL}</a><br />
          <a href="tel:7273869642" style={s.a}>(727) 386-9642</a>
        </p>

      </div>
    </div>
  )
}
