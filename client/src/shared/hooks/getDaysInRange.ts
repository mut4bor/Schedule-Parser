export const getDaysInRange = (range: string): string[] => {
  const regex = /^\d{2}\.\d{2}-\d{2}\.\d{2}$/

  if (!regex.test(range)) {
    return [range]
  }

  const [start, end] = range.split('-')
  const [startDay, startMonth] = start.split('.').map(Number)
  const [endDay, endMonth] = end.split('.').map(Number)
  const currentYear = new Date().getFullYear()

  const startDate = new Date(currentYear, startMonth - 1, startDay)
  const endDate = new Date(currentYear, endMonth - 1, endDay)

  if (startDate > endDate) {
    throw new Error('The start date must be before the end date.')
  }

  const dates = []
  const currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const day = String(currentDate.getDate()).padStart(2, '0')
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    dates.push(`${day}.${month}`)
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}
