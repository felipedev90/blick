import { redirect } from 'next/navigation'

import { LeaderHistoryList } from '@/components/sections/LeaderHistoryList'
import { getLeaderEvaluationsGiven } from '@/lib/api'
import { getLeaderId } from '@/lib/leader'

export default async function HistoryPage() {
  const leaderId = await getLeaderId()
  if (leaderId === null) redirect('/')

  const entries = await getLeaderEvaluationsGiven(leaderId)

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 p-6">
      <h1 className="font-sans text-2xl font-semibold text-text">Histórico</h1>
      <LeaderHistoryList entries={entries} />
    </main>
  )
}
