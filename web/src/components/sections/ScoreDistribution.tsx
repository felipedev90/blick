import type { ScoreBucket } from '@/lib/dashboard'

type ScoreDistributionProps = {
  distribution: ScoreBucket[]
}

export function ScoreDistribution({ distribution }: ScoreDistributionProps) {
  const max = Math.max(...distribution.map((bucket) => bucket.count), 1)

  return (
    <div className="flex flex-col gap-3">
      {distribution.map((bucket) => (
        <div key={bucket.label} className="flex items-center gap-3">
          <span className="w-16 shrink-0 font-mono text-xs text-text-muted">{bucket.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full bg-accent transition-all duration-300"
              style={{ width: `${(bucket.count / max) * 100}%` }}
            />
          </div>
          <span className="w-6 shrink-0 text-right font-mono text-xs text-text-muted">
            {bucket.count}
          </span>
        </div>
      ))}
    </div>
  )
}
