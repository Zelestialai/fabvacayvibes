'use client'
import { useState } from 'react'
import { properties } from '../lib/properties'

const BLOB_BASE = 'https://ffxdvjgwnh5dbwtv.public.blob.vercel-storage.com'

export default function ReorderPage() {
  const [selectedProp, setSelectedProp] = useState('casa-grande')
  const property = properties.find(p => p.slug === selectedProp)!
  const [order, setOrder] = useState<string[]>([])
  const [dragSrc, setDragSrc] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [showOutput, setShowOutput] = useState(false)

  const photos = order.length ? order : (property?.photos || [])

  const handleDragStart = (url: string) => setDragSrc(url)
  const handleDrop = (targetUrl: string) => {
    if (!dragSrc || dragSrc === targetUrl) return
    const curr = order.length ? order : (property?.photos || [])
    const arr = [...curr]
    const fi = arr.indexOf(dragSrc), ti = arr.indexOf(targetUrl)
    arr.splice(fi, 1)
    arr.splice(ti, 0, dragSrc)
    setOrder(arr)
  }

  const generate = () => {
    setShowOutput(true)
  }

  const outputText = photos.map(u => `    '${u}',`).join('\n')

  const copy = () => {
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const reset = () => {
    setOrder([])
    setShowOutput(false)
  }

  return (
    <div style={{ background: '#1E0F45', minHeight: '100vh', padding: '80px 32px 40px', color: '#FDF6EC' }}>
      <h1 style={{ fontFamily: "'Georgia',serif", fontSize: 28, color: '#F4A23A', marginBottom: 8 }}>Photo Reorder Tool</h1>
      <p style={{ fontSize: 13, color: 'rgba(253,246,236,0.6)', marginBottom: 24 }}>Drag photos into the order you want, then copy the result.</p>

      {/* Property selector */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {properties.map(p => (
          <button key={p.slug} onClick={() => { setSelectedProp(p.slug); setOrder([]); setShowOutput(false) }}
            style={{ padding: '8px 20px', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', border: '1px solid rgba(244,162,58,0.4)', borderRadius: 2, cursor: 'pointer', fontFamily: 'inherit', background: selectedProp === p.slug ? '#F4A23A' : 'transparent', color: selectedProp === p.slug ? '#1E0F45' : '#F4A23A' }}>
            {p.name} ({p.photos?.length ?? 0})
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={generate} style={{ padding: '10px 20px', background: '#F4A23A', color: '#1E0F45', border: 'none', cursor: 'pointer', fontSize: 12, letterSpacing: 1, fontFamily: 'inherit', borderRadius: 2 }}>Generate List</button>
        <button onClick={copy} style={{ padding: '10px 20px', background: 'transparent', color: '#F4A23A', border: '1px solid rgba(244,162,58,0.4)', cursor: 'pointer', fontSize: 12, letterSpacing: 1, fontFamily: 'inherit', borderRadius: 2 }}>{copied ? 'Copied!' : 'Copy'}</button>
        <button onClick={reset} style={{ padding: '10px 20px', background: 'transparent', color: 'rgba(253,246,236,0.6)', border: '1px solid rgba(253,246,236,0.2)', cursor: 'pointer', fontSize: 12, letterSpacing: 1, fontFamily: 'inherit', borderRadius: 2 }}>Reset</button>
        <span style={{ fontSize: 12, color: 'rgba(253,246,236,0.5)', marginLeft: 'auto' }}>{photos.length} photos</span>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8, marginBottom: 24 }}>
        {photos.map((url, i) => (
          <div key={url} draggable
            onDragStart={() => handleDragStart(url)}
            onDragOver={e => e.preventDefault()}
            onDrop={() => handleDrop(url)}
            style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', borderRadius: 4, cursor: 'grab', border: '1.5px solid rgba(244,162,58,0.2)' }}>
            <img src={url} alt={`photo ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }} />
            <span style={{ position: 'absolute', top: 4, left: 4, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: 11, borderRadius: 3, padding: '2px 5px' }}>{i+1}</span>
          </div>
        ))}
      </div>

      {/* Output */}
      {showOutput && (
        <div style={{ background: '#100820', border: '1px solid rgba(244,162,58,0.2)', borderRadius: 4, padding: 16, maxHeight: 300, overflowY: 'auto' }}>
          <p style={{ fontSize: 11, color: '#F4A23A', marginBottom: 8, letterSpacing: 2 }}>PASTE THIS INTO CLAUDE:</p>
          <pre style={{ fontSize: 11, color: 'rgba(253,246,236,0.8)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', margin: 0 }}>{outputText}</pre>
        </div>
      )}
    </div>
  )
}
