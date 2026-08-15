import { getLeaderId } from '@/lib/leader'
import { getTeamEvaluations } from '@/lib/api'
import { calculateDashboardStats } from '@/lib/dashboard'
import { StatCard } from '@/components/ui/StatCard'
import { EvaluatedList } from '@/components/sections/EvaluatedList'
import { ScoreDistribution } from '@/components/sections/ScoreDistribution'
import { PendingList } from '@/components/sections/PendingList'

export default async function HomePage() {
  const leaderId = await getLeaderId()

  if (leaderId === null) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 bg-[repeating-linear-gradient(45deg,var(--color-surface)_0,var(--color-surface)_1px,transparent_1px,transparent_12px)] p-6 text-center">
        <h1 className="font-sans text-2xl font-semibold text-text">
          Bem-vindo ao{' '}
          <span className="font-mono uppercase tracking-widest font-bold text-accent ">Blick</span>.
        </h1>
        <p className="text-text-muted">Selecione um líder para começar.</p>
      </div>
    )
  }

  const team = await getTeamEvaluations(leaderId)

  if (team.length === 0) {
    return (
      <main className="mx-auto flex max-w-2xl flex-col gap-2 p-6">
        <h1 className="font-sans text-2xl font-semibold text-text">Avaliações do time</h1>
        <p className="text-text-muted">Você ainda não tem liderados.</p>
      </main>
    )
  }

  const stats = calculateDashboardStats(team)

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-6">
      <h1 className="font-sans text-2xl font-semibold text-text">Avaliações do time</h1>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          label="Avaliados esta semana"
          value={`${stats.evaluatedCount} / ${stats.total}`}
        />
        <StatCard
          label="Nota média do time"
          value={stats.averageScore !== null ? stats.averageScore.toFixed(1) : '—'}
        />
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="font-sans text-sm font-semibold text-text">Distribuição de notas</h2>
        <ScoreDistribution distribution={stats.distribution} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-sans text-sm font-semibold text-text">Pendentes</h2>
        <PendingList members={stats.pendingMembers} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-sans text-sm font-semibold text-text">Avaliados</h2>
        <EvaluatedList members={stats.evaluatedMembers} />
      </section>
    </main>
  )
}
