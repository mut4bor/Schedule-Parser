import { IWeekRange } from '@/types'
import { eachDayOfInterval, format, parse } from 'date-fns'

export const getDaysInRange = (range: string): IWeekRange => {
  const regex = /^\d{2}\.\d{2}-\d{2}\.\d{2}$/

  if (!regex.test(range)) {
    console.error('Invalid range format. Expected format is "dd.MM-dd.MM".')
    return [range]
  }

  const [startStr, endStr] = range.split('-')

  if (!startStr || !endStr) {
    throw new TypeError('Invalid range format. Both start and end dates must be provided.')
  }

  const dateFormat = 'dd.MM'
  const startDate = parse(startStr, dateFormat, new Date())
  const endDate = parse(endStr, dateFormat, new Date())

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    throw new Error('Invalid date format provided. Expected format is "dd.MM".')
  }

  const daysBetween = eachDayOfInterval({ start: startDate, end: endDate })
  const formattedDays = daysBetween.map((day) => format(day, dateFormat))

  return formattedDays
}
