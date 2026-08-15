import type { TeamMemberEvaluation } from '@/types/employee'

export type ScoreBucket = {
  label: string
  min: number
  max: number
  count: number
}

export type DashboardStats = {
  total: number
  evaluatedCount: number
  pendingMembers: TeamMemberEvaluation[]
  averageScore: number | null
  distribution: ScoreBucket[]
}

const BUCKET_RANGES = [
  { label: '0–25', min: 0, max: 25 },
  { label: '25–50', min: 25, max: 50 },
  { label: '50–75', min: 50, max: 75 },
  { label: '75–100', min: 75, max: 100 },
] as const

export function calculateDashboardStats(team: TeamMemberEvaluation[]): DashboardStats {
  const evaluated = team.filter((member) => member.weightedScore !== null)
  const pendingMembers = team.filter((member) => member.weightedScore === null)

  const averageScore =
    evaluated.length === 0
      ? null
      : Math.round(
          (evaluated.reduce((sum, member) => sum + (member.weightedScore ?? 0), 0) /
            evaluated.length) *
            100,
        ) / 100

  const distribution = BUCKET_RANGES.map((range) => ({
    ...range,
    count: evaluated.filter(
      (member) =>
        (member.weightedScore ?? -1) >= range.min &&
        (range.max === 100
          ? (member.weightedScore ?? -1) <= range.max
          : (member.weightedScore ?? -1) < range.max),
    ).length,
  }))

  return {
    total: team.length,
    evaluatedCount: evaluated.length,
    pendingMembers,
    averageScore,
    distribution,
  }
}
