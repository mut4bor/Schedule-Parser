import { getJsonFromXLSX } from '@/api/getJsonFromXLSX'
import { getDayToPick } from '@/hooks/getDayToPick'
import { IDate } from '@/types'
import { removePreviousScheduleEntries } from './removePreviousScheduleEntries'
import { getGroupLetters } from './getGroupLetters'
import { getGroupWeekDays } from './getGroupWeekDays'

export const getProcessedDataForFile = async (filePath: string) => {
  try {
    const jsonFromXLSX = getJsonFromXLSX(filePath)

    const { day: dayToPick } = getDayToPick()

    const unParsedJson = removePreviousScheduleEntries(jsonFromXLSX, dayToPick)

    const data: Record<string, IDate> = {}

    const groupNames = Object.keys(getGroupLetters(unParsedJson))

    groupNames.forEach((groupKey) => {
      data[groupKey] = getGroupWeekDays(unParsedJson, groupKey)
    })

    return data
  } catch (error) {
    throw new Error(`Ошибка при обработке файла ${filePath}: ${error}`)
  }
}
