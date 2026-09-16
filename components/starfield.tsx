'use client'

import { useMemo } from 'react'

// Star colors drawn from the cosmic-mermaid palette: white light, pale blue,
// rose pink, arcane teal, and ceremonial gold.
const STAR_COLORS = ['#ffffff', '#cfe3ff', '#ffd4ec', '#bff3ec', '#f2d478']

// A dense, multi-layered cosmic nebula with scattered jewel-tone stars.
// Purely decorative background evoking the painted deck's starry sky.
export function Starfield() {
  const stars = useMemo(() => {
    const seeded = mulberry32(20260909)
    return Array.from({ length: 220 }, () => {
      const bright = seeded() > 0.86
      return {
        top: seeded() * 100,
        left: seeded() * 100,
        size: (bright ? 1.6 : 0.7) + seeded() * (bright ? 2.4 : 1.6),
        delay: seeded() * 7,
        duration: 2.5 + seeded() * 6,
        color: STAR_COLORS[Math.floor(seeded() * STAR_COLORS.length)],
        bright,
      }
    })
  }, [])

  const sparkles = useMemo(() => {
    const seeded = mulberry32(77712)
    return Array.from({ length: 7 }, () => ({
      top: seeded() * 90,
      left: seeded() * 96,
      size: 12 + seeded() * 16,
      delay: seeded() * 5,
      duration: 4 + seeded() * 4,
    }))
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* layered nebula clouds + deep space base */}
      <div className="cosmic-nebula absolute inset-0" />

      {/* faint galactic band sweeping across */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(1400px 260px at 60% 40%, rgba(197, 150, 255, 0.16), transparent 70%)',
          transform: 'rotate(-18deg) scale(1.4)',
        }}
      />

      {/* scattered stars */}
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            boxShadow: s.bright ? `0 0 ${s.size * 3}px ${s.color}` : `0 0 ${s.size}px ${s.color}`,
            opacity: s.bright ? 0.95 : 0.55,
            animation: `empire-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}

      {/* a few larger four-point sparkle stars */}
      {sparkles.map((s, i) => (
        <span
          key={`sp-${i}`}
          className="absolute"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            background:
              'radial-gradient(closest-side, rgba(255,255,255,0.95), rgba(242,212,120,0.5) 30%, transparent 70%)',
            animation: `empire-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function mulberry32(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
