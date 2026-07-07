'use client'
import { useState, useEffect } from 'react'

const SLIDES = [
  {
    url: 'https://ffxdvjgwnh5dbwtv.public.blob.vercel-storage.com/images/casa-grande/38-038_18%20Maywood%20Ave_by_Johnruzphoto.com.jpg',
    label: 'Casa Grandè',
    location: 'Clearwater, FL',
    type: 'Beach',
  },
  {
    url: 'https://ffxdvjgwnh5dbwtv.public.blob.vercel-storage.com/images/owl-and-hare/8283ViaRecosaJoshuaTreeCa4_3_25--55.jpg',
    label: 'Owl & Hare',
    location: 'Joshua Tree, CA',
    type: 'Desert',
  },
  {
    url: 'https://ffxdvjgwnh5dbwtv.public.blob.vercel-storage.com/images/sierra-crest-haven/DRONE/Drone001.jpg',
    label: 'Sierra Crest Haven',
    location: 'Oakhurst, CA',
    type: 'Mountain',
  },
]

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = (i: number) => {
    if (i === current || transitioning) return
    setTransitioning(true)
    setPrev(current)
    setTimeout(() => {
      setCurrent(i)
      setPrev(null)
      setTransitioning(false)
    }, 1200)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % SLIDES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [current, transitioning])

  return (
    <>
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1.08) translateX(0px); }
          100% { transform: scale(1.18) translateX(-20px); }
        }
        @keyframes kenBurns2 {
          0%   { transform: scale(1.08) translateX(0px); }
          100% { transform: scale(1.18) translateX(20px); }
        }
        @keyframes kenBurns3 {
          0%   { transform: scale(1.1) translateY(0px); }
          100% { transform: scale(1.2) translateY(-15px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Slides */}
      {SLIDES.map((slide, i) => {
        const isActive = i === current
        const isPrev = i === prev
        const anim = ['kenBurns', 'kenBurns2', 'kenBurns3'][i]
        return (
          <div
            key={slide.url}
            style={{
              position: 'absolute',
              inset: 0,
              overflow: 'hidden',
              opacity: isActive ? 1 : isPrev ? 0 : 0,
              transition: isActive ? 'opacity 1.4s ease-in-out' : isPrev ? 'opacity 1.4s ease-in-out' : 'none',
              zIndex: isActive ? 1 : isPrev ? 0 : -1,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '-10%',
                backgroundImage: `url(${slide.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                animation: isActive ? `${anim} 8s ease-in-out forwards` : 'none',
              }}
            />
          </div>
        )
      })}

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(to bottom, rgba(10,4,30,0.25) 0%, rgba(10,4,30,0.15) 40%, rgba(10,4,30,0.55) 75%, rgba(10,4,30,0.85) 100%)',
      }} />
      {/* Side vignettes */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: 'linear-gradient(to right, rgba(10,4,30,0.5) 0%, transparent 30%, transparent 70%, rgba(10,4,30,0.5) 100%)',
      }} />

      {/* Bottom property strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4,
        padding: '0 48px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
      }}>
        {/* Property cards */}
        <div style={{ display: 'flex', gap: 16 }}>
          {SLIDES.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              style={{
                background: i === current ? 'rgba(244,162,58,0.15)' : 'rgba(10,4,30,0.4)',
                border: `1px solid ${i === current ? 'rgba(244,162,58,0.6)' : 'rgba(253,246,236,0.12)'}`,
                borderRadius: 3,
                padding: '10px 16px',
                cursor: 'pointer',
                textAlign: 'left',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.4s ease',
                minWidth: 120,
              }}
            >
              <p style={{
                fontSize: 8, letterSpacing: 2.5, textTransform: 'uppercase',
                color: i === current ? '#F4A23A' : 'rgba(253,246,236,0.4)',
                marginBottom: 3, transition: 'color 0.4s',
              }}>{slide.type}</p>
              <p style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 14, color: i === current ? 'white' : 'rgba(253,246,236,0.55)',
                fontWeight: 400, transition: 'color 0.4s',
              }}>{slide.label}</p>
              <p style={{
                fontSize: 8, color: 'rgba(253,246,236,0.4)',
                marginTop: 2, letterSpacing: 1,
              }}>{slide.location}</p>
            </button>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{
              height: 2, borderRadius: 1,
              width: i === current ? 32 : 16,
              background: i === current ? '#F4A23A' : 'rgba(253,246,236,0.25)',
              transition: 'all 0.4s ease',
              cursor: 'pointer',
            }} onClick={() => goTo(i)} />
          ))}
        </div>
      </div>
    </>
  )
}
