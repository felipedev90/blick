import { getEmployees } from '@/lib/api'
import { getLeaderId } from '@/lib/leader'
import { LeaderSelector } from '@/components/sections/LeaderSelector'

export default async function HomePage() {
  const [employees, leaderId] = await Promise.all([getEmployees(), getLeaderId()])

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <div className="flex items-center justify-center gap-2 flex-col">
        <h1 className="font-sans text-2xl font-semibold text-text ">
          Bem vindo ao{' '}
          <span className="font-mono uppercase tracking-widest text-accent">Blick</span>
        </h1>
        <p className="text-text-muted">Selecione um líder para começar.</p>
      </div>
      <LeaderSelector employees={employees} currentLeaderId={leaderId} />
    </main>
  )
}
