import { EmployeeProfileSelector } from '@/components/sections/EmployeeProfileSelector'
import { ProfileGrid } from '@/components/sections/ProfileGrid'
import { getCurrentEvaluation, getTeamEvaluations } from '@/lib/api'
import { redirect } from 'next/navigation'
import { getLeaderId } from '@/lib/leader'
import { calculateProfile } from '@/lib/profile'

type ProfilePageProps = {
  searchParams: Promise<{ employeeId?: string }>
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const { employeeId } = await searchParams
  const leaderId = await getLeaderId()
  if (leaderId === null) redirect('/')

  const team = await getTeamEvaluations(leaderId)
  const evaluatedMembers = team.filter((member) => member.weightedScore !== null)

  const selectedId = employeeId ? Number(employeeId) : null
  const isValidSelection =
    selectedId !== null && evaluatedMembers.some((member) => member.id === selectedId)

  const currentEvaluation = isValidSelection
    ? await getCurrentEvaluation(selectedId, leaderId)
    : null

  const profile = currentEvaluation ? calculateProfile(currentEvaluation.answers) : null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <h1 className="font-sans text-2xl font-semibold text-text">Avaliação de Perfil</h1>
      <EmployeeProfileSelector members={evaluatedMembers} />

      {profile ? (
        <div className="flex flex-col gap-4">
          <ProfileGrid profile={profile} />
          <p className="text-center text-sm text-text-muted">
            Entrega {profile.delivery.toFixed(2)} · Crescimento {profile.growth.toFixed(2)}
          </p>
          <p className="text-center text-sm text-text-muted">{profile.description}</p>
        </div>
      ) : isValidSelection ? (
        <p className="text-text-muted">Sem avaliação vigente para esta pessoa.</p>
      ) : (
        <p className="text-text-muted">Selecione um funcionário para ver a análise do perfil.</p>
      )}
    </main>
  )
}
