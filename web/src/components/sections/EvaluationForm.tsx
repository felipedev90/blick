'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import { QuestionField } from '@/components/sections/QuestionField'
import { QUESTIONS } from '@/data/questions'
import { evaluationFormSchema } from '@/lib/schemas/evaluation'
import type { EvaluationFormValues } from '@/lib/schemas/evaluation'
import type { Score } from '@/types/question'
import { Button } from '@/components/ui/Button'

type EvaluationFormProps = {
  employeeId: number
}

type ApiErrorBody = {
  error?: string
}

export function EvaluationForm({ employeeId }: EvaluationFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EvaluationFormValues>({
    resolver: zodResolver(evaluationFormSchema),
  })

  async function onSubmit(values: EvaluationFormValues) {
    setSubmitError(null)

    const answers = QUESTIONS.map((question) => ({
      questionKey: question.key,
      score: Number(values[question.key]) as Score,
    }))

    const res = await fetch('/api/evaluations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId, answers }),
    })

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as ApiErrorBody | null
      setSubmitError(body?.error ?? 'Não foi possível enviar a avaliação.')
      return
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-2 rounded-md border border-border bg-surface px-4 py-8 text-center"
      >
        <span className="text-2xl">✓</span>
        <p className="text-text">Avaliação enviada com sucesso.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {QUESTIONS.map((question) => (
        <QuestionField
          key={question.key}
          question={question}
          register={register}
          error={errors[question.key]}
        />
      ))}

      {submitError ? (
        <p role="alert" className="text-sm text-red-500">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Enviando avaliação...' : 'Enviar avaliação'}
      </Button>
    </form>
  )
}
