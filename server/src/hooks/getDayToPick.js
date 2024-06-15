import { getISODay, addDays, format } from 'date-fns'

export const getDayToPick = () => {
  const today = new Date()
  const todayWeekIndex = getISODay(today)

  const tomorrow = addDays(today, 1)
  const tomorrowWeekIndex = getISODay(tomorrow)

  const day = format(todayWeekIndex !== 7 ? today : tomorrow, 'dd.MM')
  const dayWeekIndex = todayWeekIndex !== 7 ? todayWeekIndex : tomorrowWeekIndex

  return {
    day: day,
    dayWeekIndex: dayWeekIndex - 1,
  }
}
