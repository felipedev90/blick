import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { z } from 'zod'

import { getEmployees } from '@/lib/api'

const LEADER_COOKIE = 'leader_id'
const LEADER_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

const setLeaderSchema = z.object({
  leaderId: z.number().int().positive(),
})

export async function POST(request: Request) {
  const rawBody = await request.json().catch(() => null)
  const parsed = setLeaderSchema.safeParse(rawBody)

  if (!parsed.success) {
    return NextResponse.json({ error: 'leaderId inválido' }, { status: 422 })
  }

  const employees = await getEmployees()
  const leader = employees.find((employee) => employee.id === parsed.data.leaderId)

  if (!leader) {
    return NextResponse.json({ error: 'Funcionário não encontrado' }, { status: 404 })
  }

  const store = await cookies()
  store.set(LEADER_COOKIE, String(leader.id), {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    maxAge: LEADER_COOKIE_MAX_AGE,
  })

  return NextResponse.json({ leaderId: leader.id })
}
