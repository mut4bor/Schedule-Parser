import { addYears, eachDayOfInterval, format, parse } from 'date-fns'

export const getDaysInRange = (range: string): string[] => {
  const regex = /(\d{2}\.\d{2})-(\d{2}\.\d{2})/

  if (!regex.test(range)) {
    console.error(
      `${range}: Invalid range format. Expected format is "dd.MM-dd.MM".`,
    )
    return [range]
  }

  const [startStr, endStr] = range.split('-')

  if (!startStr || !endStr) {
    console.error(
      `${range}: Invalid range format. Both start and end dates must be provided.`,
    )
    return [range]
  }

  const dateFormat = 'dd.MM'

  let startDate = parse(startStr, dateFormat, new Date())
  let endDate = parse(endStr, dateFormat, new Date())

  if (endDate < startDate) {
    endDate = addYears(endDate, 1)
  }

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error(
      `${range}: Invalid date format provided. Expected format is "dd.MM".`,
    )
    return [range]
  }

  const daysBetween = eachDayOfInterval({ start: startDate, end: endDate })
  const formattedDays = daysBetween.map((day) => format(day, dateFormat))

  return formattedDays
}
