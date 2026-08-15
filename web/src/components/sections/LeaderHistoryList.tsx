import Link from 'next/link'

import { formatWeekRange } from '@/lib/week'
import type { LeaderEvaluationHistoryEntry } from '@/types/evaluation'

type LeaderHistoryListProps = {
  entries: LeaderEvaluationHistoryEntry[]
}

export function LeaderHistoryList({ entries }: LeaderHistoryListProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-text-muted">Você ainda não avaliou ninguém.</p>
  }

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((entry) => (
        <li key={entry.id}>
          <Link
            href={`/team/${entry.employeeId}`}
            className="flex items-center justify-between rounded-md border border-border px-3 py-2 transition-colors duration-300 hover:bg-surface"
          >
            <div className="flex flex-col">
              <span className="text-sm text-text">{entry.employeeName}</span>
              <span className="font-mono text-xs uppercase tracking-wide text-text-muted">
                {formatWeekRange(entry.weekKey)}
              </span>
            </div>
            <span className="font-mono text-sm text-text">{entry.weightedScore.toFixed(1)}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
