import { getDaysInRange } from '@/hooks/getDaysInRange.js'
import { IUnparsedJson } from '@/types/index.js'

export const removePreviousScheduleEntries = (schedule: IUnparsedJson, day: string): IUnparsedJson => {
  const scheduleKeys = Object.keys(schedule)

  const daysRange = scheduleKeys.map((item) => getDaysInRange(item)).filter((item) => item !== null)

  const currentWeekIndex = daysRange.findLastIndex((subArray) => subArray.includes(day))

  if (currentWeekIndex !== -1) {
    const currentDate = new Date()

    const previousWeekIndex = currentDate.getMonth() === 9 ? Math.max(0, currentWeekIndex - 2) : currentWeekIndex

    scheduleKeys.slice(0, previousWeekIndex).forEach((key) => {
      delete schedule[key]
    })
  }

  return schedule
}
