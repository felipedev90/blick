import Link from 'next/link'

import type { TeamMemberEvaluation } from '@/types/employee'

type EvaluatedListProps = {
  members: TeamMemberEvaluation[]
}

export function EvaluatedList({ members }: EvaluatedListProps) {
  if (members.length === 0) {
    return <p className="text-sm text-text-muted">Ninguém foi avaliado ainda esta semana.</p>
  }

  return (
    <ul className="flex flex-col gap-1">
      {members.map((member) => (
        <li key={member.id}>
          <Link
            href={`/team/${member.id}`}
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-text transition-colors duration-300 hover:bg-surface"
          >
            <span>{member.name}</span>
            <span className="font-mono text-xs text-text-muted">
              {member.weightedScore?.toFixed(1)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
