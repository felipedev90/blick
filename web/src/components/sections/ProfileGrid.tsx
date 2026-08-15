import { cn } from '@/lib/cn'
import type { ProfileAxis, ProfileResult } from '@/lib/profile'

type ProfileGridProps = {
  profile: ProfileResult
}

const AXES: ProfileAxis[] = ['high', 'mid', 'low']

export function ProfileGrid({ profile }: ProfileGridProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="flex w-6 flex-col justify-end pb-1">
          <span className="rotate-180 whitespace-nowrap text-xs text-text-muted [writing-mode:vertical-lr]">
            Crescimento
          </span>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-1">
          {AXES.map((rowAxis) =>
            AXES.map((colAxis) => {
              const isActive = profile.growthAxis === rowAxis && profile.deliveryAxis === colAxis
              return (
                <div
                  key={`${rowAxis}-${colAxis}`}
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-md border border-border bg-surface',
                    isActive && 'border-accent bg-accent/20',
                  )}
                >
                  {isActive ? (
                    <span aria-hidden="true" className="h-3 w-3 rounded-full bg-accent" />
                  ) : null}
                </div>
              )
            }),
          )}
        </div>
      </div>

      <div className="pl-8 text-xs text-text-muted">Entrega</div>
    </div>
  )
}
