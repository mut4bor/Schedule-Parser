import { getISODay } from 'date-fns'

export const getTodayIndex = () => {
  const today = new Date()
  const dayIndex: number = getISODay(today)
  return dayIndex - 1
}
