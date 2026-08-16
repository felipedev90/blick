const DAY_MS = 24 * 60 * 60 * 1000

export function formatWeekRange(weekKey: string): string {
  const [yearStr, weekStr] = weekKey.split('-')
  const year = Number(yearStr)
  const week = Number(weekStr)

  const jan4 = new Date(Date.UTC(year, 0, 4))
  const jan4DayOfWeek = jan4.getUTCDay() || 7
  const monday = new Date(jan4.getTime() - (jan4DayOfWeek - 1) * DAY_MS)
  const targetMonday = new Date(monday.getTime() + (week - 1) * 7 * DAY_MS)
  const targetSunday = new Date(targetMonday.getTime() + 6 * DAY_MS)

  const dayFormatter = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', timeZone: 'UTC' })
  const fullFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  return `${dayFormatter.format(targetMonday)} a ${fullFormatter.format(targetSunday)}`
}
