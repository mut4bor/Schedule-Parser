import { startOfWeek, addDays, format } from 'date-fns'

export const getCurrentWeekRange = (): { monday: string; saturday: string } => {
  const today = new Date()
  const monday = startOfWeek(today, { weekStartsOn: 1 })
  const saturday = addDays(monday, 5)
  const formattedMonday = format(monday, 'dd.MM')
  const formattedSaturday = format(saturday, 'dd.MM')

  return { monday: formattedMonday, saturday: formattedSaturday }
}
