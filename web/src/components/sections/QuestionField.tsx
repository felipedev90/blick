import type { FieldError, UseFormRegister } from 'react-hook-form'

import { ScoreRadioGroup } from '@/components/ui/ScoreRadioGroup'
import { WeightBar } from '@/components/ui/WeightBar'
import type { QuestionDefinition } from '@/data/questions'
import type { EvaluationFormValues } from '@/lib/schemas/evaluation'

type QuestionFieldProps = {
  question: QuestionDefinition
  register: UseFormRegister<EvaluationFormValues>
  error?: FieldError
}

export function QuestionField({ question, register, error }: QuestionFieldProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="flex w-full items-baseline justify-between gap-2 text-sm text-text">
        <span>{question.label}</span>
        <span className="font-mono text-xs text-text-muted">peso {question.weight}</span>
      </legend>

      <WeightBar weight={question.weight} />
      <ScoreRadioGroup name={question.key} register={register} />

      {error ? (
        <p role="alert" className="text-sm text-red-500">
          {error.message}
        </p>
      ) : null}
    </fieldset>
  )
}
