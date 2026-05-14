'use client'
import { useState, useEffect } from 'react'

const PROPERTIES = ['casa-grande', 'owl-and-hare', 'sierra-crest-haven']
const SECRET = 'fabvacay-migrate-2026'

export default function MigratePage() {
  const [status, setStatus] = useState<Record<string, number>>({})
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)

  const addLog = (msg: string) => setLog(l => [...l, `${new Date().toLocaleTimeString()} — ${msg}`])

  useEffect(() => { fetchStatus() }, [])

  async function fetchStatus() {
    const res = await fetch('/api/admin-migrate-drive', { headers: { 'x-admin-secret': SECRET } })
    const data = await res.json()
    setStatus(data.uploaded || {})
  }

  async function runBatch(property: string) {
    const res = await fetch('/api/admin-migrate-drive', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': SECRET },
      body: JSON.stringify({ property, batchSize: 10 }),
    })
    return res.json()
  }

  async function migrateAll() {
    setRunning(true)
    setLog([])
    for (const prop of PROPERTIES) {
      addLog(`Starting ${prop}...`)
      let remaining = 999
      while (remaining > 0) {
        const result = await runBatch(prop)
        if (result.error) { addLog(`ERROR: ${result.error}`); break }
        addLog(`${prop}: ${result.alreadyUploaded + result.batchProcessed}/${result.totalInDrive} uploaded, ${result.remaining} remaining`)
        remaining = result.remaining
        await fetchStatus()
        if (result.batchProcessed === 0) break
        await new Promise(r => setTimeout(r, 500))
      }
      addLog(`✓ ${prop} complete!`)
    }
    setRunning(false)
    addLog('🎉 All done! Refresh to see final counts.')
  }

  return (
    <div style={{ background: '#1E0F45', minHeight: '100vh', padding: 40, color: '#FDF6EC', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#F4A23A', marginBottom: 8 }}>Image Migration: Drive → Vercel Blob</h1>
      <p style={{ color: 'rgba(253,246,236,0.6)', marginBottom: 32, fontSize: 13 }}>
        Downloads all property photos from Google Drive and uploads them to Vercel Blob CDN.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 32 }}>
        {PROPERTIES.map(prop => (
          <div key={prop} style={{ background: 'rgba(253,246,236,0.05)', border: '1px solid rgba(244,162,58,0.2)', borderRadius: 8, padding: 20 }}>
            <p style={{ color: '#F7C05A', fontSize: 13, marginBottom: 8 }}>{prop}</p>
            <p style={{ fontSize: 28, color: '#F4A23A' }}>{status[prop] ?? '—'}</p>
            <p style={{ fontSize: 11, color: 'rgba(253,246,236,0.4)' }}>images uploaded</p>
          </div>
        ))}
      </div>

      <button
        onClick={migrateAll}
        disabled={running}
        style={{ background: running ? 'rgba(244,162,58,0.3)' : '#F4A23A', color: '#1E0F45', padding: '14px 32px', fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 4, cursor: running ? 'default' : 'pointer', marginBottom: 24, letterSpacing: 1 }}
      >
        {running ? '⏳ Migrating...' : '🚀 Start Migration'}
      </button>

      {log.length > 0 && (
        <div style={{ background: '#100820', border: '1px solid rgba(244,162,58,0.2)', borderRadius: 4, padding: 16, maxHeight: 400, overflowY: 'auto' }}>
          {log.map((l, i) => <p key={i} style={{ fontSize: 12, margin: '2px 0', color: l.includes('ERROR') ? '#ff6b6b' : l.includes('✓') || l.includes('🎉') ? '#4ade80' : 'rgba(253,246,236,0.7)' }}>{l}</p>)}
        </div>
      )}
    </div>
  )
}
