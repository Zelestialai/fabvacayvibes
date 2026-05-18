'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface PhotoGalleryProps {
  photos: string[]
  propertyName: string
}

export default function PhotoGallery({ photos, propertyName }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [showAll, setShowAll] = useState(false)

  const visiblePhotos = showAll ? photos : photos.slice(0, 9)

  const openLightbox = (idx: number) => setLightboxIndex(idx)
  const closeLightbox = () => setLightboxIndex(null)

  const prev = useCallback(() => {
    setLightboxIndex(i => (i === null ? null : (i - 1 + photos.length) % photos.length))
  }, [photos.length])

  const next = useCallback(() => {
    setLightboxIndex(i => (i === null ? null : (i + 1) % photos.length))
  }, [photos.length])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') closeLightbox()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, prev, next])

  if (!photos || photos.length === 0) return null

  // URLs from Vercel Blob are already properly encoded
  const encodePhoto = (url: string) => url

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <p style={{ fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: 'var(--orange)' }}>
          Photo Gallery · {photos.length} Photos
        </p>
        {photos.length > 9 && (
          <button
            onClick={() => setShowAll(s => !s)}
            style={{
              background: 'transparent', border: '1px solid rgba(244,162,58,0.3)',
              color: 'var(--orange)', padding: '8px 18px', fontSize: 11,
              letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2,
            }}
          >
            {showAll ? 'Show Less' : `View All ${photos.length}`}
          </button>
        )}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 3,
      }}>
        {visiblePhotos.map((photo, idx) => (
          <div
            key={photo}
            onClick={() => openLightbox(idx)}
            style={{
              position: 'relative',
              aspectRatio: '4/3',
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'var(--purple-mid)',
            }}
          >
            <Image
              src={encodePhoto(photo)}
              alt={`${propertyName} photo ${idx + 1}`}
              fill
              sizes="(max-width: 768px) 33vw, 25vw"
              style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
              onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
              onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
            />
            {/* Hover overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(30,15,69,0)',
              transition: 'background 0.3s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
              onMouseOver={e => (e.currentTarget.style.background = 'rgba(30,15,69,0.3)')}
              onMouseOut={e => (e.currentTarget.style.background = 'rgba(30,15,69,0)')}
            >
              <span style={{ color: 'white', fontSize: 24, opacity: 0 }}
                onMouseOver={e => (e.currentTarget.style.opacity = '1')}
                onMouseOut={e => (e.currentTarget.style.opacity = '0')}
              >⊕</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(10,5,25,0.97)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute', top: 24, right: 24,
              background: 'transparent', border: '1px solid rgba(244,162,58,0.3)',
              color: 'var(--orange)', width: 44, height: 44,
              fontSize: 20, cursor: 'pointer', borderRadius: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>

          {/* Counter */}
          <div style={{
            position: 'absolute', top: 28, left: '50%', transform: 'translateX(-50%)',
            fontSize: 12, letterSpacing: 3, color: 'var(--text-muted)',
          }}>
            {lightboxIndex + 1} / {photos.length}
          </div>

          {/* Prev */}
          <button
            onClick={e => { e.stopPropagation(); prev() }}
            style={{
              position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(244,162,58,0.1)', border: '1px solid rgba(244,162,58,0.3)',
              color: 'var(--orange)', width: 52, height: 52,
              fontSize: 22, cursor: 'pointer', borderRadius: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >←</button>

          {/* Image */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '85vw', height: '80vh',
              maxWidth: 1200,
            }}
          >
            <Image
              src={encodePhoto(photos[lightboxIndex])}
              alt={`${propertyName} photo ${lightboxIndex + 1}`}
              fill
              sizes="85vw"
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>

          {/* Next */}
          <button
            onClick={e => { e.stopPropagation(); next() }}
            style={{
              position: 'absolute', right: 24, top: '50%', transform: 'translateY(-50%)',
              background: 'rgba(244,162,58,0.1)', border: '1px solid rgba(244,162,58,0.3)',
              color: 'var(--orange)', width: 52, height: 52,
              fontSize: 22, cursor: 'pointer', borderRadius: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >→</button>

          {/* Thumbnail strip */}
          <div style={{
            position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 4, overflowX: 'auto', maxWidth: '90vw', padding: '4px 0',
          }}>
            {photos.map((p, i) => (
              <div
                key={p}
                onClick={e => { e.stopPropagation(); setLightboxIndex(i) }}
                style={{
                  position: 'relative', width: 56, height: 40, flexShrink: 0,
                  cursor: 'pointer', borderRadius: 2, overflow: 'hidden',
                  border: i === lightboxIndex ? '2px solid var(--orange)' : '2px solid transparent',
                  opacity: i === lightboxIndex ? 1 : 0.5,
                  transition: 'opacity 0.2s, border 0.2s',
                }}
              >
                <Image
                  src={encodePhoto(p)}
                  alt=""
                  fill
                  sizes="56px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
