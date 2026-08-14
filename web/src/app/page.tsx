import { getEmployees } from '@/lib/api'
import { getLeaderId } from '@/lib/leader'
import { LeaderSelector } from '@/components/sections/LeaderSelector'

export default async function HomePage() {
  const [employees, leaderId] = await Promise.all([getEmployees(), getLeaderId()])
  const currentLeader = employees.find((employee) => employee.id === leaderId) ?? null

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <h1 className="font-sans text-2xl font-semibold text-text">Blick</h1>
      <LeaderSelector employees={employees} currentLeaderId={currentLeader?.id ?? null} />
      {currentLeader ? (
        <p className="text-text-muted">
          Avaliando como <strong className="text-text">{currentLeader.name}</strong>.
        </p>
      ) : (
        <p className="text-text-muted">Selecione um líder pra começar.</p>
      )}
    </main>
  )
}
