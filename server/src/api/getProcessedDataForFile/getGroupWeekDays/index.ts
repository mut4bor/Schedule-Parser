import { getDaysInRange } from '@/hooks/getDaysInRange.js'
import { extractGroupedData } from '../extractGroupedData/index.js'
import { getDateKeys } from '../getDateKeys/index.js'
import { getGroupLetters } from '../getGroupLetters/index.js'
import { IDate, IUnparsedJson, IWeekRange } from '@/types/index.js'
import { removeEmptyObjects } from '@/hooks/removeEmptyObjects.js'

export const getGroupWeekDays = (unParsedJson: IUnparsedJson, groupNumber: string): IDate => {
  const groupLetters = getGroupLetters(unParsedJson)[groupNumber]
  const groupedData = extractGroupedData(unParsedJson, groupLetters)
  const weekDates = getDateKeys(unParsedJson)
  const weekDatesKeys = Object.keys(weekDates)

  const days = weekDatesKeys.reduce(
    (acc, item) => {
      const daysInRange = getDaysInRange(item)

      if (!daysInRange) {
        return acc
      }

      acc[item] = daysInRange
      return acc
    },
    {} as Record<string, IWeekRange>,
  )

  Object.entries(groupedData).forEach(([day, schedule]) => {
    const datePrefix = day.substring(0, 5)

    const week = Object.keys(days).find((key) => key && days[key].includes(datePrefix))

    const weekDays = ['Пн.', 'Вт.', 'Ср.', 'Чт.', 'Пт.', 'Сб.']

    const containsDay = (str: string) => {
      return weekDays.some((day) => str.includes(day))
    }

    if (week && day && containsDay(day) && schedule) {
      if (!weekDates[week]) {
        weekDates[week] = {}
      }
      weekDates[week][day] = schedule
    }
  })

  removeEmptyObjects(weekDates)

  return weekDates
}
