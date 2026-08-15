const MAX_WEIGHT = 25

type WeightBarProps = {
  weight: number
}

export function WeightBar({ weight }: WeightBarProps) {
  return (
    <div aria-hidden="true" className="h-1 w-full overflow-hidden rounded-full bg-surface">
      <div className="h-full bg-accent" style={{ width: `${(weight / MAX_WEIGHT) * 100}%` }} />
    </div>
  )
}
