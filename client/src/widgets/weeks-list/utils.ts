import { useMemo } from 'react'
import {
  getISOWeek,
  getISOWeekYear,
  parseISO,
  startOfISOWeek,
  endOfISOWeek,
  format,
} from 'date-fns'

const formatWeekRange = (weekValue: string) => {
  const match = /^(\d{4})-W(\d{2})$/.exec(weekValue)
  if (!match) return weekValue

  const [_, year, week] = match
  const date = parseISO(`${year}-W${week}`)

  const start = startOfISOWeek(date)
  const end = endOfISOWeek(date)

  return `${format(start, 'dd.MM')} - ${format(end, 'dd.MM')}`
}

const getWeekValue = (value: string) => {
  if (value === 'odd') return 'Нечетная неделя'
  if (value === 'even') return 'Четная неделя'
  return formatWeekRange(value)
}

const getWeekNumber = (date: Date) => ({
  year: getISOWeekYear(date),
  week: getISOWeek(date),
})

const parseWeek = (week: string) => {
  const date = parseISO(week)
  return { year: getISOWeekYear(date), week: getISOWeek(date) }
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
