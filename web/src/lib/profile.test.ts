import { describe, expect, it } from 'vitest'

import { calculateProfile } from './profile'
import type { Answer } from '@/types/question'

function makeAnswers(scores: Record<string, number>): Answer[] {
  return Object.entries(scores).map(([questionKey, score]) => ({
    questionKey: questionKey as Answer['questionKey'],
    score: score as Answer['score'],
  }))
}

describe('calculateProfile', () => {
  it('calcula entrega e crescimento pros valores da Tina Bergmann', () => {
    const answers = makeAnswers({
      delivery_results: 4,
      execution_quality: 3,
      learning_development: 4,
      problem_solving: 2,
      collaboration_leadership: 4,
      strategic_vision: 4,
    })

    const profile = calculateProfile(answers)

    expect(profile.delivery).toBeCloseTo(3.17, 1)
    expect(profile.growth).toBe(4)
    expect(profile.deliveryAxis).toBe('mid')
    expect(profile.growthAxis).toBe('high')
  })

  it('classifica nota mínima em todos os critérios como low-low', () => {
    const answers = makeAnswers({
      delivery_results: 1,
      execution_quality: 1,
      learning_development: 1,
      problem_solving: 1,
      collaboration_leadership: 1,
      strategic_vision: 1,
    })

    const profile = calculateProfile(answers)

    expect(profile.deliveryAxis).toBe('low')
    expect(profile.growthAxis).toBe('low')
  })

  it('classifica nota máxima em todos os critérios como high-high', () => {
    const answers = makeAnswers({
      delivery_results: 4,
      execution_quality: 4,
      learning_development: 4,
      problem_solving: 4,
      collaboration_leadership: 4,
      strategic_vision: 4,
    })

    const profile = calculateProfile(answers)

    expect(profile.deliveryAxis).toBe('high')
    expect(profile.growthAxis).toBe('high')
  })

  it('nota 3 fica na faixa média, não cai pra baixo por erro de fronteira', () => {
    const answers = makeAnswers({
      delivery_results: 3,
      execution_quality: 3,
      learning_development: 3,
      problem_solving: 3,
      collaboration_leadership: 3,
      strategic_vision: 3,
    })

    const profile = calculateProfile(answers)

    expect(profile.deliveryAxis).toBe('mid')
    expect(profile.growthAxis).toBe('mid')
  })
})
