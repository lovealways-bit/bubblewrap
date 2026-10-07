// The living Sunflower Compass Clock - the Empire's growth emblem.
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
        <radialGradient id="sun¶»§q«^