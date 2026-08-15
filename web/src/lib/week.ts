const DAY_MS = 24 * 60 * 60 * 1000

// week_key vem no formato ISO 8601 week date: "2026-33" = ano 2026, semana 33.
// Converte pro intervalo de segunda a domingo daquela semana, em pt-BR.
export function formatWeekRange(weekKey: string): string {
  const [yearStr, weekStr] = weekKey.split('-')
  const year = Number(yearStr)
  const week = Number(weekStr)

  // 4 de janeiro está sempre na semana 1 do calendário ISO.
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const jan4DayOfWeek = jan4.getUTCDay() || 7
  const monday = new Date(jan4.getTime() - (jan4DayOfWeek - 1) * DAY_MS)
  const targetMonday = new Date(monday.getTime() + (week - 1) * 7 * DAY_MS)
  const targetSunday = new Date(targetMonday.getTime() + 6 * DAY_MS)

  const dayFormatter = new Intl.DateTimeFormat('pt-BR', { day: 'numeric' })
  const fullFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return `${dayFormatter.format(targetMonday)} a ${fullFormatter.format(targetSunday)}`
}
