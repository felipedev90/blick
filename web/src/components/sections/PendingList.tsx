import Link from 'next/link'

import type { TeamMemberEvaluation } from '@/types/employee'

type PendingListProps = {
  members: TeamMemberEvaluation[]
}

export function PendingList({ members }: PendingListProps) {
  if (members.length === 0) {
    return <p className="text-sm text-text-muted">Todo o time foi avaliado esta semana.</p>
  }

  return (
    <ul className="flex flex-col gap-1">
      {members.map((member) => (
        <li key={member.id}>
          <Link
            href={`/team/${member.id}/evaluate`}
            className="flex items-center justify-between rounded-md px-3 py-2 text-sm text-text transition-colors duration-300 hover:bg-surface"
          >
            <span>{member.name}</span>
            <span className="font-mono text-xs uppercase tracking-wide text-text-muted">
              {member.positionName}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
