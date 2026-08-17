import { notFound, redirect } from 'next/navigation'

import { CurrentEvaluationCard } from '@/components/sections/CurrentEvaluationCard'
import { EvaluationForm } from '@/components/sections/EvaluationForm'
import { BackButton } from '@/components/ui/BackButton'
import { getCurrentEvaluation, getEmployees, getEvaluationHistory, getTeam } from '@/lib/api'
import { getLeaderId } from '@/lib/leader'

type EmployeeDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function EmployeeDetailPage({ params }: EmployeeDetailPageProps) {
  const { id } = await params
  const employeeId = Number(id)
  if (!Number.isInteger(employeeId) || employeeId <= 0) notFound()

  const leaderId = await getLeaderId()
  if (leaderId === null) redirect('/')

  const [employees, team, currentEvaluation, history] = await Promise.all([
    getEmployees(),
    getTeam(leaderId),
    getCurrentEvaluation(employeeId, leaderId),
    getEvaluationHistory(employeeId, leaderId),
  ])

  const employee = employees.find((item) => item.id === employeeId)
  if (!employee) notFound()

  const teamMember = team.find((item) => item.id === employeeId)
  const parent = teamMember ? employees.find((item) => item.id === teamMember.parentId) : undefined

  const alreadyEvaluatedByMe = history.some(
    (entry) => entry.leaderId === leaderId && entry.weekKey === currentEvaluation?.weekKey,
  )

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <BackButton />

      <div>
        <h1 className="font-sans text-2xl font-semibold text-text">{employee.name}</h1>
        <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
          {employee.positionName}
        </p>
        {parent ? (
          <p className="text-sm text-text-muted">Liderado por {parent.name}</p>
        ) : teamMember ? (
          <p className="text-sm text-text-muted">Liderado direto</p>
        ) : null}
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-sans text-sm font-semibold text-text">Avaliação vigente</h2>
        <CurrentEvaluationCard evaluation={currentEvaluation} />
      </section>

      <section>
        {alreadyEvaluatedByMe ? (
          <p className="text-text-muted">Você já avaliou essa pessoa essa semana.</p>
        ) : (
          <EvaluationForm employeeId={employeeId} />
        )}
      </section>
    </main>
  )
}
