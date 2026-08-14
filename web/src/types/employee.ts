export type Employee = {
  id: number
  name: string
  positionName: string
}

export type TeamMember = Employee & {
  depth: number
}
