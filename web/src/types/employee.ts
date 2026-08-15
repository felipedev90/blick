export type Employee = {
  id: number
  name: string
  positionName: string
}

export type TeamMember = Employee & {
  depth: number
  parentId: number | null
}

export type TeamMemberEvaluation = TeamMember & {
  evaluationId: number | null
  evaluationLeaderId: number | null
  evaluationLeaderName: string | null
  weekKey: string | null
  weightedScore: number | null
}
