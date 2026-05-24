'use client'
import { useState } from 'react'

export default function ExpandableDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false)

  const paragraphs = description.split('\n\n').filter(p => p.trim())
  const preview = paragraphs.slice(0, 2)
  const rest = paragraphs.slice(2)
  const hasMore = rest.length > 0

  const paraStyle = {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: 18,
    lineHeight: 1.8,
    color: 'var(--cream)',
    marginBottom: 20,
  } as const

  return (
    <div style={{ marginBottom: 40 }}>
      {preview.map((para, i) => (
        <p key={i} style={paraStyle}>{para.trim()}</p>
      ))}

      {hasMore && (
        <>
          {expanded && rest.map((para, i) => (
            <p key={i} style={paraStyle}>{para.trim()}</p>
          ))}

          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--orange)',
              fontSize: 13,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: expanded ? 8 : -8,
            }}
          >
            {expanded ? '▲ Show Less' : `▼ Read More`}
          </button>
        </>
      )}
    </div>
  )
}
