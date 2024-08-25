import { getDaysInRange } from '@/hooks/getDaysInRange'
import { IUnparsedJson } from '@/types'

export const removePreviousScheduleEntries = (schedule: IUnparsedJson, day: string): IUnparsedJson => {
  const scheduleKeys = Object.keys(schedule)

  const daysRange = scheduleKeys.map((item) => getDaysInRange(item))

  const currentWeekIndex = daysRange.findIndex((subArray) => subArray.includes(day))

  if (currentWeekIndex !== -1) {
    const previousWeekIndex = Math.max(0, currentWeekIndex - 1)

    scheduleKeys.slice(0, previousWeekIndex).forEach((key) => {
      delete schedule[key]
    })
  }

  return schedule
}
