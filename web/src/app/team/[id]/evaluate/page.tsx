import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { EvaluationForm } from '@/components/sections/EvaluationForm'
import { getCurrentEvaluation, getEmployees } from '@/lib/api'
import { getLeaderId } from '@/lib/leader'

type EvaluatePageProps = {
  params: Promise<{ id: string }>
}

export default async function EvaluatePage({ params }: EvaluatePageProps) {
  const { id } = await params
  const employeeId = Number(id)
  if (!Number.isInteger(employeeId) || employeeId <= 0) notFound()

  const leaderId = await getLeaderId()
  if (leaderId === null) redirect('/')

  const [employees, currentEvaluation] = await Promise.all([
    getEmployees(),
    getCurrentEvaluation(employeeId, leaderId),
  ])

  const employee = employees.find((item) => item.id === employeeId)
  if (!employee) notFound()

  const alreadyEvaluatedByMe = currentEvaluation?.leaderId === leaderId

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <Link href="/team" className="flex items-center gap-2 text-text-muted hover:text-text">
        <ArrowLeft aria-hidden="true" size={20} /> Voltar
      </Link>

      <div>
        <h1 className="font-sans text-2xl font-semibold text-text">{employee.name}</h1>
        <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
          {employee.positionName}
        </p>
      </div>

      {alreadyEvaluatedByMe ? (
        <p className="text-text-muted">Você já avaliou essa pessoa essa semana.</p>
      ) : (
        <EvaluationForm employeeId={employeeId} />
      )}
    </main>
  )
}
