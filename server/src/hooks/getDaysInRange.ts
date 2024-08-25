import { eachDayOfInterval, format, parse } from 'date-fns'

export const getDaysInRange = (range: string) => {
  if (typeof range !== 'string' || !range.includes('-')) {
    throw new TypeError('Invalid range format. Expected format is "dd.MM-dd.MM".')
  }

  const [startStr, endStr] = range.split('-')

  // Проверяем, что обе даты были определены
  if (!startStr || !endStr) {
    throw new TypeError('Invalid range format. Both start and end dates must be provided.')
  }

  const dateFormat = 'dd.MM'
  const startDate = parse(startStr, dateFormat, new Date())
  const endDate = parse(endStr, dateFormat, new Date())

  // Проверяем, что даты корректно распарсились
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid date format provided. Expected format is "dd.MM".')
  }

  const daysBetween = eachDayOfInterval({ start: startDate, end: endDate })
  const formattedDays = daysBetween.map((day) => format(day, dateFormat))

  return formattedDays
}
