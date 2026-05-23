'use client'
import { useState, useEffect } from 'react'

const PROPERTIES = ['casa-grande', 'owl-and-hare', 'sierra-crest-haven']
const NAMES: Record<string, string> = {
  'casa-grande': 'Casa Grandè',
  'owl-and-hare': 'Owl & Hare',
  'sierra-crest-haven': 'Sierra Crest Haven',
}
const SECRET = 'fabvacay-admin-2026'

export default function AdminContentPage() {
  const [auth, setAuth] = useState(false)
  const [password, setPassword] = useState('')
  const [selected, setSelected] = useState('casa-grande')
  const [descriptions, setDescriptions] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (auth) loadDescriptions()
  }, [auth])

  async function loadDescriptions() {
    setLoading(true)
    try {
      const res = await fetch('/api/content', { headers: { 'x-admin-secret': SECRET } })
      const data = await res.json()
      setDescriptions(data || {})
    } catch {}
    setLoading(false)
  }

  async function save() {
    setSaving(true)
    await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': SECRET },
      body: JSON.stringify({ slug: selected, description: descriptions[selected] || '' }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!auth) return (
    <div style={{ background: '#1E0F45', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(244,162,58,0.2)', borderRadius: 8, padding: '48px 40px', maxWidth: 400, width: '100%' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: '#F4A23A', marginBottom: 8 }}>Admin Access</h1>
        <p style={{ fontSize: 13, color: 'rgba(253,246,236,0.5)', marginBottom: 24 }}>Enter password to manage property descriptions</p>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && password === SECRET && setAuth(true)}
          placeholder="Password" style={{ width: '100%', padding: '12px 16px', background: 'rgba(253,246,236,0.05)', border: '1px solid rgba(244,162,58,0.25)', borderRadius: 2, color: '#FDF6EC', fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }} />
        <button onClick={() => password === SECRET && setAuth(true)}
          style={{ width: '100%', padding: '12px', background: '#F4A23A', color: '#1E0F45', border: 'none', borderRadius: 2, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
          Sign In
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ background: '#1E0F45', minHeight: '100vh', padding: '40px 32px', color: '#FDF6EC' }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: '#F4A23A', marginBottom: 4 }}>Property Content Manager</h1>
      <p style={{ fontSize: 13, color: 'rgba(253,246,236,0.5)', marginBottom: 32 }}>Edit property descriptions — changes go live instantly</p>

      {/* Property selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {PROPERTIES.map(p => (
          <button key={p} onClick={() => setSelected(p)}
            style={{ padding: '8px 20px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', border: '1px solid rgba(244,162,58,0.4)', borderRadius: 2, cursor: 'pointer', fontFamily: 'inherit', background: selected === p ? '#F4A23A' : 'transparent', color: selected === p ? '#1E0F45' : '#F4A23A' }}>
            {NAMES[p]}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ color: 'rgba(253,246,236,0.5)' }}>Loading...</p>
      ) : (
        <div>
          <p style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: '#F4A23A', marginBottom: 8 }}>Description for {NAMES[selected]}</p>
          <p style={{ fontSize: 12, color: 'rgba(253,246,236,0.4)', marginBottom: 12 }}>Paste from OwnerRez or Airbnb. Supports multiple paragraphs.</p>
          <textarea
            value={descriptions[selected] || ''}
            onChange={e => setDescriptions(d => ({ ...d, [selected]: e.target.value }))}
            rows={16}
            placeholder={`Paste the full description for ${NAMES[selected]} here...`}
            style={{ width: '100%', padding: '16px', background: 'rgba(253,246,236,0.05)', border: '1px solid rgba(244,162,58,0.25)', borderRadius: 2, color: '#FDF6EC', fontFamily: 'DM Sans, sans-serif', fontSize: 14, outline: 'none', boxSizing: 'border-box', lineHeight: 1.7, resize: 'vertical' }}
          />
          <div style={{ display: 'flex', gap: 12, marginTop: 12, alignItems: 'center' }}>
            <button onClick={save} disabled={saving}
              style={{ padding: '12px 32px', background: saved ? '#4ade80' : '#F4A23A', color: '#1E0F45', border: 'none', borderRadius: 2, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
              {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save & Publish'}
            </button>
            <span style={{ fontSize: 12, color: 'rgba(253,246,236,0.4)' }}>
              {descriptions[selected]?.length || 0} characters
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
