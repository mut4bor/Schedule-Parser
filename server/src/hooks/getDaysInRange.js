import { eachDayOfInterval, format, parse } from 'date-fns'

export const getDaysInRange = (range) => {
  const [startStr, endStr] = range.split('-')

  const dateFormat = 'dd.MM'
  const startDate = parse(startStr, dateFormat, new Date())
  const endDate = parse(endStr, dateFormat, new Date())

  const daysBetween = eachDayOfInterval({ start: startDate, end: endDate })
  const formattedDays = daysBetween.map((day) => format(day, dateFormat))

  return formattedDays
}
