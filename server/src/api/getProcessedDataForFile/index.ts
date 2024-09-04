import { getJsonFromXLSX } from '@/api/getJsonFromXLSX'
import { getDayToPick } from '@/hooks/getDayToPick'
import { IDate, IUnparsedJson } from '@/types'
import { removePreviousScheduleEntries } from './removePreviousScheduleEntries'
import { getGroupLetters } from './getGroupLetters'
import { getGroupWeekDays } from './getGroupWeekDays'
import { addDays, parse, format } from 'date-fns'

export const getProcessedDataForFile = async (filePath: string) => {
  try {
    const jsonFromXLSX = getJsonFromXLSX(filePath)

    const modifiedJsonFromXLSX = Object.entries(jsonFromXLSX).reduce((acc, [key, value]) => {
      const sheetName = key.replace(/\D/g, '')
      const modifiedKey = sheetName.slice(0, 2) + '.' + sheetName.slice(2)
      const substringedKey = modifiedKey.substring(0, 5)

      const dateFormat = 'dd.MM'
      const startDate = parse(substringedKey, dateFormat, new Date())
      const endDate = addDays(startDate, 5)

      const formattedStartDate = format(startDate, dateFormat)
      const formattedEndDate = format(endDate, dateFormat)

      acc[`${formattedStartDate}-${formattedEndDate}`] = value
      return acc
    }, {} as IUnparsedJson)

    const { day: dayToPick } = getDayToPick()

    const unParsedJson = removePreviousScheduleEntries(modifiedJsonFromXLSX, dayToPick)

    const data: Record<string, IDate> = Object.keys(getGroupLetters(unParsedJson)).reduce(
      (acc, groupKey) => {
        acc[groupKey] = getGroupWeekDays(unParsedJson, groupKey)
        return acc
      },
      {} as Record<string, IDate>,
    )

    return data
  } catch (error) {
    throw new Error(`Ошибка при обработке файла ${filePath}: ${error}`)
  }
}
