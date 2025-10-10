import { useMemo } from 'react'

const formatWeekRange = (weekValue: string) => {
  // Ожидаем формат "YYYY-Www"
  const match = /^(\d{4})-W(\d{2})$/.exec(weekValue)
  if (!match) return weekValue

  const year = parseInt(match[1], 10)
  const week = parseInt(match[2], 10)

  // Находим первый день недели (понедельник)
  const simple = new Date(year, 0, 1 + (week - 1) * 7)
  const dayOfWeek = simple.getDay()
  const ISOweekStart = new Date(simple)
  if (dayOfWeek <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
  }

  // Конец недели (суббота)
  const ISOweekEnd = new Date(ISOweekStart)
  ISOweekEnd.setDate(ISOweekStart.getDate() + 5)

  const formatDate = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`

  return `${formatDate(ISOweekStart)} - ${formatDate(ISOweekEnd)}`
}

const getWeekValue = (value: string) => {
  if (value === 'odd') return 'Нечетная неделя'
  if (value === 'even') return 'Четная неделя'
  return formatWeekRange(value)
}

const getWeekNumber = (date: Date): { year: number; week: number } => {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = tmp.getUTCDay() || 7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((+tmp - +yearStart) / 86400000 + 1) / 7)
  return { year: tmp.getUTCFullYear(), week: weekNo }
}

const parseWeek = (w: string) => {
  const [year, weekStr] = w.split('-W')
  return { year: Number(year), week: Number(weekStr) }
}

const useProcessedWeeks = (weeksData: string[] | undefined) => {
  return useMemo(() => {
    if (!weeksData) return undefined

    const now = getWeekNumber(new Date())

    const filtered = weeksData.filter((week) => {
      if (week === 'even' || week === 'odd') return true

      const candidate = parseWeek(week)
      if (
        candidate.year > now.year ||
        (candidate.year === now.year && candidate.week >= now.week)
      ) {
        return true
      }

      return false
    })

    const isCurrent = (w: string) => {
      if (w === 'even' || w === 'odd') return false
      const candidate = parseWeek(w)
      return candidate.year === now.year && candidate.week === now.week
    }

    const priority = (w: string) => {
      if (isCurrent(w)) return 0
      if (w === 'odd') return 1
      if (w === 'even') return 2
      return 3
    }

    const sorted = filtered.sort((a, b) => {
      if (isCurrent(a) && !isCurrent(b)) return -1
      if (!isCurrent(a) && isCurrent(b)) return 1
      return priority(a) - priority(b)
    })

    return sorted
  }, [weeksData])
}

export { getWeekNumber, getWeekValue, parseWeek, useProcessedWeeks }
