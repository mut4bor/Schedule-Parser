export function getDatesOfISOWeek(year: number, week: number): string[] {
  // 4 января всегда в первой ISO-неделе
  const simple = new Date(Date.UTC(year, 0, 4))

  // день недели (1 = понедельник, ..., 7 = воскресенье)
  let dayOfWeek = simple.getUTCDay()
  if (dayOfWeek === 0) dayOfWeek = 7

  // находим понедельник первой ISO-недели
  const isoWeekStart = new Date(simple)
  isoWeekStart.setUTCDate(simple.getUTCDate() - dayOfWeek + 1 + (week - 1) * 7)

  // собираем только понедельник–субботу (6 дней)
  const days: string[] = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(isoWeekStart)
    d.setUTCDate(isoWeekStart.getUTCDate() + i)
    days.push(d.toISOString().split('T')[0]) // YYYY-MM-DD (UTC)
  }
  return days
}
