import { NextResponse } from 'next/server'
import { z } from 'zod'

import { ApiError, createEvaluation } from '@/lib/api'
import { QUESTIONS } from '@/data/questions'
import { getLeaderId } from '@/lib/leader'
import type { QuestionKey } from '@/types/question'

const QUESTION_KEYS = QUESTIONS.map((question) => question.key) as [QuestionKey, ...QuestionKey[]]

const answerSchema = z.object({
  questionKey: z.enum(QUESTION_KEYS),
  score: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
})

const requestSchema = z
  .object({
    employeeId: z.number().int().positive(),
    answers: z.array(answerSchema).length(6),
  })
  .refine(
    (data) => {
      const keys = new Set(data.answers.map((answer) => answer.questionKey))
      return keys.size === 6 && QUESTION_KEYS.every((key) => keys.has(key))
    },
    { message: 'As 6 perguntas devem ser respondidas, sem repetição.' },
  )

export async function POST(request: Request) {
  const leaderId = await getLeaderId()
  if (leaderId === null) {
    return NextResponse.json({ error: 'Selecione um líder antes de avaliar.' }, { status: 401 })
  }

  const rawBody = await request.json().catch(() => null)
  const parsed = requestSchema.safeParse(rawBody)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados de avaliação inválidos.' }, { status: 422 })
  }

  try {
    const result = await createEvaluation(parsed.data.employeeId, leaderId, {
      answers: parsed.data.answers,
    })
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status || 502 })
    }
    return NextResponse.json({ error: 'Erro inesperado ao enviar avaliação.' }, { status: 500 })
  }
}
