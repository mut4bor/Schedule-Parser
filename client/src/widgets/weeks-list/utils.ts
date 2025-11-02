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

export { getWeekNumber, getWeekValue, parseWeek }
