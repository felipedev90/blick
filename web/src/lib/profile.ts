import type { Answer, QuestionKey } from '@/types/question'

export type ProfileAxis = 'low' | 'mid' | 'high'

export type ProfileResult = {
  delivery: number
  growth: number
  deliveryAxis: ProfileAxis
  growthAxis: ProfileAxis
  description: string
}

const DELIVERY_KEYS: Record<QuestionKey, number> = {
  delivery_results: 25,
  execution_quality: 20,
  problem_solving: 15,
  learning_development: 0,
  collaboration_leadership: 0,
  strategic_vision: 0,
}

const GROWTH_KEYS: Record<QuestionKey, number> = {
  learning_development: 20,
  collaboration_leadership: 10,
  strategic_vision: 10,
  delivery_results: 0,
  execution_quality: 0,
  problem_solving: 0,
}

function weightedAverage(answers: Answer[], weights: Record<QuestionKey, number>): number {
  const relevant = answers.filter((answer) => weights[answer.questionKey] > 0)
  const totalWeight = relevant.reduce((sum, answer) => sum + weights[answer.questionKey], 0)
  if (totalWeight === 0) return 0

  const weightedSum = relevant.reduce(
    (sum, answer) => sum + answer.score * weights[answer.questionKey],
    0,
  )
  return weightedSum / totalWeight
}

function axisFor(value: number): ProfileAxis {
  if (value < 2.34) return 'low'
  if (value < 3.67) return 'mid'
  return 'high'
}

const DESCRIPTIONS: Record<`${ProfileAxis}-${ProfileAxis}`, string> = {
  'low-low': 'Entrega abaixo do esperado e pouco sinal de crescimento nesta avaliação.',
  'low-mid': 'Entrega abaixo do esperado, com sinais de crescimento a acompanhar.',
  'low-high': 'Entrega abaixo do esperado, mas com forte potencial de crescimento.',
  'mid-low': 'Entrega consistente, com pouco espaço de crescimento identificado.',
  'mid-mid': 'Entrega consistente e crescimento equilibrado.',
  'mid-high': 'Entrega consistente, com espaço de crescimento acima da média.',
  'high-low': 'Entrega forte, com crescimento estável nesta avaliação.',
  'high-mid': 'Entrega forte e bom sinal de crescimento.',
  'high-high': 'Entrega forte e alto potencial de crescimento.',
}

export function calculateProfile(answers: Answer[]): ProfileResult {
  const delivery = weightedAverage(answers, DELIVERY_KEYS)
  const growth = weightedAverage(answers, GROWTH_KEYS)
  const deliveryAxis = axisFor(delivery)
  const growthAxis = axisFor(growth)

  return {
    delivery,
    growth,
    deliveryAxis,
    growthAxis,
    description: DESCRIPTIONS[`${deliveryAxis}-${growthAxis}`],
  }
}
