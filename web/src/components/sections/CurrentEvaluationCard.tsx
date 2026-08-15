import { QUESTIONS } from '@/data/questions'
import { WeightBar } from '@/components/ui/WeightBar'
import { formatWeekRange } from '@/lib/week'
import type { EvaluationSummary } from '@/types/evaluation'

type CurrentEvaluationCardProps = {
  evaluation: EvaluationSummary | null
}

export function CurrentEvaluationCard({ evaluation }: CurrentEvaluationCardProps) {
  if (!evaluation) {
    return (
      <div className="rounded-md border border-border bg-surface p-4">
        <p className="text-sm text-text-muted">Nenhuma avaliação registrada esta semana.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 rounded-md border border-border bg-surface p-4">
      <div className="flex items-baseline justify-between">
        <span className="text-3xl font-semibold text-text">
          {evaluation.weightedScore.toFixed(1)}
        </span>
        <span className="font-mono text-xs uppercase tracking-wide text-text-muted">
          {formatWeekRange(evaluation.weekKey)}
        </span>
      </div>
      <p className="text-sm text-text-muted">
        Avaliado por <span className="text-text">{evaluation.leaderName}</span>
      </p>

      <div className="flex flex-col gap-3">
        {QUESTIONS.map((question) => {
          const answer = evaluation.answers.find((item) => item.questionKey === question.key)
          return (
            <div key={question.key} className="flex flex-col gap-1">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-text">{question.label}</span>
                <span className="font-mono text-xs text-text-muted">{answer?.score ?? '—'}</span>
              </div>
              <WeightBar weight={question.weight} score={answer?.score} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
