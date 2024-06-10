import { getISODay, addDays, format } from 'date-fns'

export const getDayToPick = () => {
  const today = new Date()
  const todayWeekIndex = getISODay(today)

  const tomorrow = addDays(today, 1)
  const tomorrowWeekIndex = getISODay(tomorrow)

  const day = format(todayWeekIndex !== 6 ? today : tomorrow, 'dd.MM')
  const dayWeekIndex = todayWeekIndex !== 6 ? todayWeekIndex : tomorrowWeekIndex

  return {
    day: day,
    dayWeekIndex: dayWeekIndex - 1,
  }
}
