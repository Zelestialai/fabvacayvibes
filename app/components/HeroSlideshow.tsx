'use client'
import { useState, useEffect } from 'react'

const SLIDES = [
  {
    url: 'https://ffxdvjgwnh5dbwtv.public.blob.vercel-storage.com/images/casa-grande/38-038_18%20Maywood%20Ave_by_Johnruzphoto.com.jpg',
    label: 'Casa Grandè',
    location: 'Clearwater, FL',
  },
  {
    url: 'https://ffxdvjgwnh5dbwtv.public.blob.vercel-storage.com/images/owl-and-hare/8283ViaRecosaJoshuaTreeCa4_3_25--55.jpg',
    label: 'Owl & Hare',
    location: 'Joshua Tree, CA',
  },
  {
    url: 'https://ffxdvjgwnh5dbwtv.public.blob.vercel-storage.com/images/sierra-crest-haven/DRONE/Drone001.jpg',
    label: 'Sierra Crest Haven',
    location: 'Oakhurst, CA',
  },
]

const INTERVAL = 5000

export default function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(c => (c + 1) % SLIDES.length)
        setFading(false)
      }, 800)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [])

  return (
    <>
      {/* Slideshow background images */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.url}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${slide.url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'opacity 1.2s ease-in-out',
            opacity: i === current ? (fading ? 0 : 0.45) : 0,
            zIndex: 0,
          }}
        />
      ))}

      {/* Dark overlay for text readability */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, rgba(10,4,30,0.55) 0%, rgba(10,4,30,0.3) 50%, rgba(10,4,30,0.7) 100%)',
        zIndex: 1,
      }} />

      {/* Property indicator dots */}
      <div style={{
        position: 'absolute',
        bottom: 260,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        zIndex: 3,
      }}>
        {SLIDES.map((slide, i) => (
          <button
            key={i}
            onClick={() => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false) }, 400) }}
            title={slide.label}
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current ? '#F4A23A' : 'rgba(253,246,236,0.35)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* Current property label */}
      <div style={{
        position: 'absolute',
        bottom: 278,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3,
        textAlign: 'center',
        transition: 'opacity 0.4s ease',
        opacity: fading ? 0 : 1,
        whiteSpace: 'nowrap',
      }}>
        <p style={{
          fontSize: 9,
          letterSpacing: 3,
          textTransform: 'uppercase',
          color: 'rgba(244,162,58,0.8)',
          marginBottom: 2,
        }}>
          {SLIDES[current].label} · {SLIDES[current].location}
        </p>
      </div>
    </>
  )
}
