const formatWeekRange = (weekValue: string) => {
  // Ожидаем формат "YYYY-Www"

  const match = /^(\d{4})-W(\d{2})$/.exec(weekValue)
  if (!match) return weekValue

  const year = parseInt(match[1], 10)
  const week = parseInt(match[2], 10)

  // Находим первый день недели (понедельник)
  const simple = new Date(year, 0, 1 + (week - 1) * 7)
  const dayOfWeek = simple.getDay()
  const ISOweekStart = new Date(simple)
  if (dayOfWeek <= 4) {
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1)
  } else {
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay())
  }

  // Конец недели (суббота)
  const ISOweekEnd = new Date(ISOweekStart)
  ISOweekEnd.setDate(ISOweekStart.getDate() + 5)

  const formatDate = (d: Date) =>
    `${String(d.getDate()).padStart(2, '0')}.${String(
      d.getMonth() + 1,
    ).padStart(2, '0')}`

  return `${formatDate(ISOweekStart)} - ${formatDate(ISOweekEnd)}`
}

const getWeekNumber = (date: Date): { year: number; week: number } => {
  const tmp = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  )
  const dayNum = tmp.getUTCDay() || 7
  tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((+tmp - +yearStart) / 86400000 + 1) / 7)
  return { year: tmp.getUTCFullYear(), week: weekNo }
}

export { formatWeekRange, getWeekNumber }
