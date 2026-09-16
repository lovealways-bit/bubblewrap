// The living Sunflower Compass Clock — the Empire's growth emblem.
// Petals illuminate with the reader's progress, the compass needle favors
// the current direction, and the inner clock marks reached milestones.
// Purely presentational; it reads its state from props computed by the
// Reader Growth Model.

interface Props {
  /** 0..1 overall integration across the seven realms. */
  progress: number
  /** Cardinal the needle points to, or null to rest at center. */
  cardinal: 'n' | 'e' | 's' | 'w' | null
  /** Milestones reached, drives the inner clock ticks. */
  milestonesReached: number
  milestonesTotal: number
  className?: string
}

const PETALS = 16
const CENTER = 100

const CARDINALS: { key: 'n' | 'e' | 's' | 'w'; label: string; x: number; y: number; angle: number }[] = [
  { key: 'n', label: 'N', x: 100, y: 15, angle: 0 },
  { key: 'e', label: 'E', x: 185, y: 104, angle: 90 },
  { key: 's', label: 'S', x: 100, y: 193, angle: 180 },
  { key: 'w', label: 'W', x: 15, y: 104, angle: 270 },
]

export function SunflowerCompass({
  progress,
  cardinal,
  milestonesReached,
  milestonesTotal,
  className,
}: Props) {
  const litPetals = Math.round(progress * PETALS)
  const needle = cardinal ? CARDINALS.find((c) => c.key === cardinal) : null

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={`Growth compass: ${Math.round(progress * 100)} percent integrated`}
    >
      <defs>
        <radialGradient id="sun-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff4c4" />
          <stop offset="55%" stopColor="#f2c94c" />
          <stop offset="100%" stopColor="#b8860b" />
        </radialGradient>
        <linearGradient id="sun-petal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff4c4" />
          <stop offset="50%" stopColor="#f2c94c" />
          <stop offset="100%" stopColor="#c9962b" />
        </linearGradient>
      </defs>

      {/* faint outer compass ring */}
      <circle cx={CENTER} cy={CENTER} r="94" fill="none" stroke="rgba(242,201,76,0.22)" strokeWidth="1" />
      <circle cx={CENTER} cy={CENTER} r="88" fill="none" stroke="rgba(242,201,76,0.12)" strokeWidth="1" />

      {/* petals radiating from the center — lit ones carry the reader's progress */}
      {Array.from({ length: PETALS }).map((_, i) => {
        const angle = (360 / PETALS) * i
        const lit = i < litPetals
        return (
          <path
            key={i}
            d="M100 26 C 109 52, 109 66, 100 82 C 91 66, 91 52, 100 26 Z"
            transform={`rotate(${angle} ${CENTER} ${CENTER})`}
            fill={lit ? 'url(#sun-petal)' : 'rgba(242,201,76,0.07)'}
            stroke={lit ? 'rgba(255,244,196,0.55)' : 'rgba(242,201,76,0.18)'}
            strokeWidth="0.75"
            style={lit ? { filter: 'drop-shadow(0 0 3px rgba(242,201,76,0.45))' } : undefined}
          />
        )
      })}

      {/* inner clock ring with milestone ticks */}
      <circle cx={CENTER} cy={CENTER} r="30" fill="rgba(20,12,40,0.85)" stroke="rgba(242,201,76,0.4)" strokeWidth="1" />
      {Array.from({ length: milestonesTotal }).map((_, i) => {
        const angle = (360 / milestonesTotal) * i - 90
        const rad = (angle * Math.PI) / 180
        const on = i < milestonesReached
        const x1 = CENTER + Math.cos(rad) * 24
        const y1 = CENTER + Math.sin(rad) * 24
        const x2 = CENTER + Math.cos(rad) * 30
        const y2 = CENTER + Math.sin(rad) * 30
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={on ? '#fff4c4' : 'rgba(242,201,76,0.25)'}
            strokeWidth={on ? 2 : 1}
            strokeLinecap="round"
          />
        )
      })}

      {/* compass needle toward current direction */}
      {needle && (
        <line
          x1={CENTER}
          y1={CENTER}
          x2={needle.x}
          y2={needle.y}
          stroke="#5fe0d6"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.85"
        />
      )}

      {/* center star core */}
      <circle cx={CENTER} cy={CENTER} r="12" fill="url(#sun-core)" />
      <path
        d="M100 88 L103 97 L112 100 L103 103 L100 112 L97 103 L88 100 L97 97 Z"
        fill="#1a1030"
        opacity="0.75"
      />

      {/* cardinal labels */}
      {CARDINALS.map((c) => (
        <text
          key={c.key}
          x={c.x}
          y={c.y + 4}
          textAnchor="middle"
          className="font-display"
          fontSize="10"
          fill={cardinal === c.key ? '#5fe0d6' : 'rgba(242,201,76,0.55)'}
        >
          {c.label}
        </text>
      ))}
    </svg>
  )
}
