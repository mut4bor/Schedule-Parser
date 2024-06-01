export const getCurrentWeekRange = (): { monday: string; saturday: string } => {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const firstDayOfWeek = new Date(today)
  const lastDayOfWeek = new Date(today)

  const diffToMonday = (dayOfWeek + 6) % 7
  firstDayOfWeek.setDate(today.getDate() - diffToMonday)

  const diffToSunday = 6 - dayOfWeek
  lastDayOfWeek.setDate(today.getDate() + diffToSunday)

  const format = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    return `${day}.${month}`
  }

  return {
    monday: format(firstDayOfWeek),
    saturday: format(lastDayOfWeek),
  }
}
