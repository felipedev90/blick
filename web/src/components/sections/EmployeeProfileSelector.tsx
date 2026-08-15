'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import type { TeamMemberEvaluation } from '@/types/employee'

type EmployeeProfileSelectorProps = {
  members: TeamMemberEvaluation[]
}

export function EmployeeProfileSelector({ members }: EmployeeProfileSelectorProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedId = searchParams.get('employeeId')

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value
    router.push(value ? `/profile?employeeId=${value}` : '/profile')
  }

  return (
    <select
      value={selectedId ?? ''}
      onChange={handleChange}
      className="rounded-md border border-border bg-surface px-3 py-2 text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <option value="">Selecione um funcionário</option>
      {members.map((member) => (
        <option key={member.id} value={member.id}>
          {member.name}
        </option>
      ))}
    </select>
  )
}
