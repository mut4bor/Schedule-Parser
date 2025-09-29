export const getWeekDates = (weekStr: string | undefined | null) => {
  if (!weekStr) return []

  if (typeof weekStr !== 'string' || weekStr.trim() === '') {
    return []
  }

  if (weekStr === 'even' || weekStr === 'odd') {
    return ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
  }

  const match = /^(\d{4})-W(\d{2})$/.exec(weekStr)
  if (!match) {
    console.error('Неверный формат. Используйте YYYY-Www (например, 2025-W33)')

    return []
  }

  const year = parseInt(match[1], 10)
  const week = parseInt(match[2], 10)

  // Находим первый четверг года (ISO 8601)
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const dayOfWeek = jan4.getUTCDay() || 7
  const firstThursday = new Date(Date.UTC(year, 0, 4 + (4 - dayOfWeek)))

  // Первая неделя ISO начинается с понедельника
  const weekStart = new Date(
    firstThursday.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000,
  )
  weekStart.setUTCDate(weekStart.getUTCDate() - 3)

  const daysOfWeek = ['Вс.', 'Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.']

  const days: string[] = []
  for (let i = 0; i < 6; i++) {
    const d = new Date(weekStart)
    d.setUTCDate(weekStart.getUTCDate() + i)

    const day = String(d.getUTCDate()).padStart(2, '0')
    const month = String(d.getUTCMonth() + 1).padStart(2, '0')
    const weekday = daysOfWeek[d.getUTCDay()]

    days.push(`${day}.${month} (${weekday})`)
  }

  return days
}
