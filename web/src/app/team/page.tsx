import { redirect } from 'next/navigation'

import { TeamTree } from '@/components/sections/TeamTree'
import { getTeam } from '@/lib/api'
import { getLeaderId } from '@/lib/leader'
import { buildTree } from '@/lib/tree'
import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'

export default async function TeamPage() {
  const leaderId = await getLeaderId()
  if (leaderId === null) redirect('/')

  const team = await getTeam(leaderId)
  const tree = buildTree(team)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 pl-2 pt-4 lg:p-6">
      <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-text">
        <ArrowLeft size={20} aria-hidden="true" /> Voltar
      </Link>
      <div className="flex items-center gap-2">
        <h1 className="font-sans text-2xl font-semibold text-text">Meu time</h1>
      </div>
      {tree.length === 0 ? (
        <p className="text-text-muted">Você ainda não tem liderados.</p>
      ) : (
        <TeamTree nodes={tree} />
      )}
    </main>
  )
}
