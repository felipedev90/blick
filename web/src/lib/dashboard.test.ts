import { describe, expect, it } from 'vitest'

import { calculateDashboardStats } from './dashboard'
import type { TeamMemberEvaluation } from '@/types/employee'

function makeMember(overrides: Partial<TeamMemberEvaluation> = {}): TeamMemberEvaluation {
  return {
    id: 1,
    name: 'Teste',
    positionName: 'Cargo',
    depth: 1,
    parentId: null,
    evaluationId: null,
    evaluationLeaderId: null,
    evaluationLeaderName: null,
    weekKey: null,
    weightedScore: null,
    ...overrides,
  }
}

describe('calculateDashboardStats', () => {
  it('separa avaliados de pendentes corretamente', () => {
    const team = [
      makeMember({ id: 1, weightedScore: 80 }),
      makeMember({ id: 2, weightedScore: null }),
      makeMember({ id: 3, weightedScore: 60 }),
    ]

    const stats = calculateDashboardStats(team)

    expect(stats.total).toBe(3)
    expect(stats.evaluatedCount).toBe(2)
    expect(stats.pendingMembers).toHaveLength(1)
    expect(stats.pendingMembers[0]?.id).toBe(2)
  })

  it('calcula a média só sobre quem foi avaliado', () => {
    const team = [
      makeMember({ id: 1, weightedScore: 80 }),
      makeMember({ id: 2, weightedScore: 60 }),
      makeMember({ id: 3, weightedScore: null }),
    ]

    const stats = calculateDashboardStats(team)

    expect(stats.averageScore).toBe(70)
  })

  it('devolve média nula quando ninguém foi avaliado', () => {
    const team = [makeMember({ id: 1 }), makeMember({ id: 2 })]

    const stats = calculateDashboardStats(team)

    expect(stats.averageScore).toBeNull()
  })

  it('inclui nota 100 no último bucket, não deixa de fora', () => {
    const team = [makeMember({ id: 1, weightedScore: 100 })]

    const stats = calculateDashboardStats(team)

    const lastBucket = stats.distribution.at(-1)
    expect(lastBucket?.count).toBe(1)
  })

  it('coloca nota exatamente no limite no bucket superior', () => {
    const team = [makeMember({ id: 1, weightedScore: 75 })]

    const stats = calculateDashboardStats(team)

    const bucket50to75 = stats.distribution.find((b) => b.label === '50–75')
    const bucket75to100 = stats.distribution.find((b) => b.label === '75–100')

    expect(bucket50to75?.count).toBe(0)
    expect(bucket75to100?.count).toBe(1)
  })
})
