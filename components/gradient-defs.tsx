// Shared SVG gradient palette for the magik-world card art.
// Mounted once so every SuitEmblem can reference these by id via `fill="url(#...)"`.
// Keeps the Vault's gold/purple chrome on the frame while the suit art blooms iridescent.
export function GradientDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden focusable="false">
      <defs>
        {/* Wands: sunflower fire, gold to rose */}
        <linearGradient id="emblem-wands" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f9e7a0" />
          <stop offset="55%" stopColor="#e8912d" />
          <stop offset="100%" stopColor="#e86ca0" />
        </linearGradient>
        {/* Cups: blooming-sound heart, teal to aqua to pink */}
        <linearGradient id="emblem-cups" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8ff3e6" />
          <stop offset="50%" stopColor="#3fd6c8" />
          <stop offset="100%" stopColor="#f0a6d0" />
        </linearGradient>
        {/* Swords: cosmic mind, violet to indigo to gold */}
        <linearGradient id="emblem-swords" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c9b6ff" />
          <stop offset="55%" stopColor="#7a6ee8" />
          <stop offset="100%" stopColor="#f2d478" />
        </linearGradient>
        {/* Pentacles: crystal earth, emerald to mint to gold */}
        <linearGradient id="emblem-pentacles" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a7f0cf" />
          <stop offset="55%" stopColor="#4fd39a" />
          <stop offset="100%" stopColor="#f2d478" />
        </linearGradient>
        {/* Major Arcana: the dragon's rainbow halo */}
        <linearGradient id="emblem-major" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd36e" />
          <stop offset="30%" stopColor="#f0a6d0" />
          <stop offset="60%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#5fe0d6" />
        </linearGradient>
        {/* The Empire's wings: bright gold feathers */}
        <linearGradient id="wing-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff4c4" />
          <stop offset="45%" stopColor="#f2c94c" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
        {/* The Empire's wings: black feathers */}
        <linearGradient id="wing-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3320" />
          <stop offset="60%" stopColor="#171310" />
          <stop offset="100%" stopColor="#0b0908" />
        </linearGradient>
      </defs>
    </svg>
  )
}
