'use client'
import { useState, useEffect } from 'react'

const PROPERTIES = ['casa-grande', 'owl-and-hare', 'sierra-crest-haven']
const SECRET = 'fabvacay-migrate-2026'

export default function MigratePage() {
  const [status, setStatus] = useState<Record<string, number>>({})
  const [envOk, setEnvOk] = useState<Record<string, boolean>>({})
  const [log, setLog] = useState<string[]>([])
  const [running, setRunning] = useState(false)

  const addLog = (msg: string) => setLog(l => [...l, `${new Date().toLocaleTimeString()} — ${msg}`])

  useEffect(() => { fetchStatus() }, [])

  async function fetchStatus() {
    const res = await fetch('/api/admin-migrate-drive', { headers: { 'x-admin-secret': SECRET } })
    const data = await res.json()
    setStatus(data.uploaded || {})
    setEnvOk(data.envVars || {})
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
      let stuckCount = 0
      while (remaining > 0) {
        const result = await runBatch(prop)
        if (result.error) { addLog(`❌ ERROR: ${result.error}`); break }
        if (result.failures?.length > 0) {
          addLog(`⚠️ ${result.failures.length} failures: ${result.failures[0].error}`)
        }
        addLog(`${prop}: ${result.alreadyUploaded + result.succeeded}/${result.totalInDrive} uploaded, ${result.remaining} remaining`)
        
        const newRemaining = result.remaining
        if (newRemaining >= remaining) {
          stuckCount++
          if (stuckCount >= 2) { addLog(`⚠️ Stuck on ${prop} — check Drive sharing settings`); break }
        } else {
          stuckCount = 0
        }
        remaining = newRemaining
        await fetchStatus()
        await new Promise(r => setTimeout(r, 300))
      }
      addLog(`✓ ${prop} done!`)
    }
    setRunning(false)
    addLog('🎉 Migration complete!')
  }

  const envMissing = Object.entries(envOk).filter(([, v]) => !v)

  return (
    <div style={{ background: '#1E0F45', minHeight: '100vh', padding: 40, color: '#FDF6EC', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#F4A23A', marginBottom: 8 }}>Image Migration: Drive → Vercel Blob</h1>

      {/* Env var check */}
      <div style={{ marginBottom: 24, padding: 16, background: 'rgba(253,246,236,0.04)', border: '1px solid rgba(244,162,58,0.2)', borderRadius: 4 }}>
        <p style={{ fontSize: 12, marginBottom: 8, color: '#F4A23A' }}>ENV VARS:</p>
        {Object.entries(envOk).map(([k, v]) => (
          <p key={k} style={{ fontSize: 12, margin: '2px 0', color: v ? '#4ade80' : '#ff6b6b' }}>
            {v ? '✓' : '✗'} {k}
          </p>
        ))}
        {envMissing.length > 0 && (
          <p style={{ color: '#ff6b6b', fontSize: 12, marginTop: 8 }}>
            ⚠️ Missing env vars — add them in Vercel Settings → Environment Variables, then redeploy
          </p>
        )}
      </div>

      {/* Upload counts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {PROPERTIES.map(prop => (
          <div key={prop} style={{ background: 'rgba(253,246,236,0.05)', border: '1px solid rgba(244,162,58,0.2)', borderRadius: 8, padding: 20 }}>
            <p style={{ color: '#F7C05A', fontSize: 12, marginBottom: 8 }}>{prop}</p>
            <p style={{ fontSize: 32, color: '#F4A23A', margin: 0 }}>{status[prop] ?? '—'}</p>
            <p style={{ fontSize: 11, color: 'rgba(253,246,236,0.4)', margin: 0 }}>uploaded to Blob</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <button onClick={migrateAll} disabled={running || envMissing.length > 0}
          style={{ background: running || envMissing.length > 0 ? 'rgba(244,162,58,0.3)' : '#F4A23A', color: '#1E0F45', padding: '14px 32px', fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 4, cursor: running ? 'default' : 'pointer' }}>
          {running ? '⏳ Migrating...' : '🚀 Start Migration'}
        </button>
        <button onClick={fetchStatus}
          style={{ background: 'transparent', color: '#F4A23A', padding: '14px 24px', fontSize: 13, border: '1px solid rgba(244,162,58,0.3)', borderRadius: 4, cursor: 'pointer' }}>
          Refresh Status
        </button>
      </div>

      {log.length > 0 && (
        <div style={{ background: '#100820', border: '1px solid rgba(244,162,58,0.2)', borderRadius: 4, padding: 16, maxHeight: 500, overflowY: 'auto' }}>
          {log.map((l, i) => (
            <p key={i} style={{ fontSize: 12, margin: '2px 0', color: l.includes('❌') || l.includes('✗') ? '#ff6b6b' : l.includes('✓') || l.includes('🎉') ? '#4ade80' : l.includes('⚠️') ? '#fbbf24' : 'rgba(253,246,236,0.7)' }}>
              {l}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
