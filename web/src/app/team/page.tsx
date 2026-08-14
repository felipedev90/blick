import { redirect } from 'next/navigation'

import { TeamTree } from '@/components/sections/TeamTree'
import { getTeam } from '@/lib/api'
import { getLeaderId } from '@/lib/leader'
import { buildTree } from '@/lib/tree'

export default async function TeamPage() {
  const leaderId = await getLeaderId()
  if (leaderId === null) redirect('/')

  const team = await getTeam(leaderId)
  const tree = buildTree(team)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <h1 className="font-sans text-2xl font-semibold text-text">Meu time</h1>
      {tree.length === 0 ? (
        <p className="text-text-muted">Você ainda não tem liderados.</p>
      ) : (
        <TeamTree nodes={tree} />
      )}
    </main>
  )
}
