// The Empire's wingset: a symmetric fan of layered gold-and-black feathers,
// echoing the winged trophy emblem. Sits BEHIND each card's suit hero symbol.
// Feather fills reference the shared gradients mounted by <GradientDefs />.

const FEATHERS = Array.from({ length: 6 }).map((_, i) => ({
  angle: 14 + i * 12.5, // near-vertical (inner) fanning out toward horizontal
  len: 40 - i * 2, // inner feathers are the longest, like real wings
  w: 5 - i * 0.35,
  gold: i % 2 === 0, // alternate gold / near-black layering
}))

function feather(len: number, w: number): string {
  return `M0 0 C ${-w} ${-len * 0.35}, ${-w * 0.8} ${-len * 0.78}, 0 ${-len} C ${w * 0.8} ${-len * 0.78}, ${w} ${-len * 0.35}, 0 0 Z`
}

export function Wings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 84" className={className} role="img" aria-hidden focusable="false">
      {(['right', 'left'] as const).map((side) => (
        <g
          key={side}
          transform={side === 'right' ? 'translate(80 66)' : 'translate(80 66) scale(-1 1)'}
        >
          {FEATHERS.map((f, i) => (
            <path
              key={i}
              d={feather(f.len, f.w)}
              fill={f.gold ? 'url(#wing-gold)' : 'url(#wing-dark)'}
              stroke="rgba(255,220,130,0.45)"
              strokeWidth="0.5"
              transform={`rotate(${f.angle})`}
            />
          ))}
        </g>
      ))}
    </svg>
  )
}
