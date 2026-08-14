import 'server-only'
import { cookies } from 'next/headers'

const LEADER_COOKIE = 'leader_id'

export async function getLeaderId(): Promise<number | null> {
  const store = await cookies()
  const raw = store.get(LEADER_COOKIE)?.value
  if (!raw) return null
  const id = Number(raw)
  return Number.isInteger(id) && id > 0 ? id : null
}
