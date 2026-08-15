const MAX_WEIGHT = 25
const MAX_SCORE = 4

type WeightBarProps = {
  weight: number
  score?: number
}

export function WeightBar({ weight, score }: WeightBarProps) {
  const isScoreMode = score !== undefined
  const percentage = isScoreMode ? (score / MAX_SCORE) * 100 : (weight / MAX_WEIGHT) * 100

  return (
    <div aria-hidden="true" className="h-1 w-full overflow-hidden rounded-full bg-surface">
      <div className="h-full bg-accent" style={{ width: `${percentage}%` }} />
    </div>
  )
}
