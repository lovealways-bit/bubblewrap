import type { Suit } from '@/lib/tarot/types'

interface Props {
  suit?: Suit
  className?: string
}

const GRAD: Record<string, string> = {
  wands: 'url(#emblem-wands)',
  cups: 'url(#emblem-cups)',
  swords: 'url(#emblem-swords)',
  pentacles: 'url(#emblem-pentacles)',
  major: 'url(#emblem-major)',
}

// True-to-sign suit glyphs in the magik-world style: a sunflower-topped wand for
// Wands, a blooming-sound chalice for Cups, a cool winged sword for Swords, and a
// pentagram coin for Pentacles. The Major Arcana keeps its dragon-mandala sunburst.
// Fills come from the shared <GradientDefs /> so every emblem reads iridescent.
export function SuitEmblem({ suit, className }: Props) {
  const fill = GRAD[suit ?? 'major']
  const facet = 'rgba(255,255,255,0.5)'
  const glint = 'rgba(255,255,255,0.9)'
  const wood = '#4a2f16'

  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-hidden>
      {!suit && (
        // Major Arcana: dragon-mandala sunburst + octagram
        <g>
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x="23"
              y="1.5"
              width="2"
              height="8.5"
              rx="1"
              fill={fill}
              opacity={0.9}
              transform={`rotate(${i * 30} 24 24)`}
            />
          ))}
          <path
            d="M24 7 L28 20 L41 24 L28 28 L24 41 L20 28 L7 24 L20 20 Z"
            fill={fill}
            stroke={facet}
            strokeWidth="0.6"
          />
          <circle cx="24" cy="24" r="4.6" fill={fill} stroke={facet} strokeWidth="0.8" />
          <circle cx="24" cy="24" r="1.8" fill={glint} />
        </g>
      )}

      {suit === 'wands' && (
        // Wand: a bound staff crowned with a sunflower bloom
        <g>
          <path d="M22.7 18 L25.3 18 L24.8 44 L23.2 44 Z" fill={wood} stroke={facet} strokeWidth="0.4" />
          <rect x="22.2" y="26" width="3.6" height="1.5" rx="0.4" fill={fill} opacity="0.85" />
          <rect x="22.2" y="34" width="3.6" height="1.5" rx="0.4" fill={fill} opacity="0.85" />
          {Array.from({ length: 10 }).map((_, i) => (
            <ellipse
              key={i}
              cx="24"
              cy="6.5"
              rx="2.2"
              ry="5"
              fill={fill}
              stroke={facet}
              strokeWidth="0.35"
              transform={`rotate(${i * 36} 24 14)`}
            />
          ))}
          <circle cx="24" cy="14" r="4.4" fill={wood} stroke={facet} strokeWidth="0.5" />
          <circle cx="24" cy="14" r="4.4" fill={fill} opacity="0.3" />
          <circle cx="22.5" cy="12.6" r="1" fill={glint} opacity="0.85" />
        </g>
      )}

      {suit === 'cups' && (
        // Chalice: a rimmed bowl on a stem, holding a blooming-sound heart-gem
        <g>
          <path
            d="M13 13 L35 13 Q34 27 24 31 Q14 27 13 13 Z"
            fill={fill}
            stroke={facet}
            strokeWidth="0.6"
          />
          <ellipse
            cx="24"
            cy="13"
            rx="11"
            ry="2.4"
            fill={glint}
            opacity="0.5"
            stroke={facet}
            strokeWidth="0.4"
          />
          <path
            d="M24 22 C21.4 19.6 19.4 21 20.5 22.9 C21.3 24.2 24 26 24 26 C24 26 26.7 24.2 27.5 22.9 C28.6 21 26.6 19.6 24 22 Z"
            fill={glint}
            opacity="0.7"
          />
          <rect x="22.5" y="31" width="3" height="7" fill={fill} stroke={facet} strokeWidth="0.4" />
          <circle cx="24" cy="34.2" r="2" fill={fill} stroke={facet} strokeWidth="0.4" />
          <path d="M16.5 44 Q24 38.5 31.5 44 Z" fill={fill} stroke={facet} strokeWidth="0.5" />
        </g>
      )}

      {suit === 'swords' && (
        // A cool winged sword: shining blade, curled crossguard, wrapped grip, gem pommel
        <g>
          <path
            d="M24 2 L27.5 13 L26 30 L22 30 L20.5 13 Z"
            fill={fill}
            stroke={facet}
            strokeWidth="0.5"
          />
          <path d="M24 4.5 L24 29" stroke={glint} strokeWidth="0.8" opacity="0.7" />
          <path
            d="M11 30 Q6.5 27 5.5 31 Q5.5 33.6 9.5 33 L38.5 33 Q42.5 33.6 42.5 31 Q41.5 27 37 30 Z"
            fill={fill}
            stroke={facet}
            strokeWidth="0.5"
          />
          <rect x="22" y="33" width="4" height="7" rx="1" fill={wood} stroke={facet} strokeWidth="0.4" />
          <path d="M22 35.2 L26 35.2 M22 37.2 L26 37.2" stroke={facet} strokeWidth="0.4" />
          <circle cx="24" cy="42.5" r="3" fill={fill} stroke={facet} strokeWidth="0.5" />
          <circle cx="22.9" cy="41.5" r="0.9" fill={glint} />
        </g>
      )}

      {suit === 'pentacles' && (
        // Pentacle: a faceted gold coin inscribed with a pentagram star
        <g>
          <circle cx="24" cy="24" r="19" fill={fill} stroke={facet} strokeWidth="0.7" />
          <circle cx="24" cy="24" r="15.5" fill="none" stroke={facet} strokeWidth="0.5" opacity="0.7" />
          <path
            d="M24 11 L31.6 34.5 L11.6 20 L36.4 20 L16.4 34.5 Z"
            fill={glint}
            fillOpacity="0.18"
            stroke={glint}
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
          <circle cx="24" cy="24" r="1.6" fill={glint} />
        </g>
      )}
    </svg>
  )
}
