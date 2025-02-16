import { getJsonFromXLSX } from '@/api/getJsonFromXLSX'
import { getDayToPick } from '@/hooks/getDayToPick'
import { IDate, IUnparsedJson } from '@/types'
import { removePreviousScheduleEntries } from './removePreviousScheduleEntries'
import { getGroupLetters } from './getGroupLetters'
import { getGroupWeekDays } from './getGroupWeekDays'
import { addDays, parse, format } from 'date-fns'
import fs from 'fs'

export const getProcessedDataForFile = async (filePath: string) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Файл не найден: ${filePath}`)
    }

    const jsonFromXLSX = getJsonFromXLSX(filePath)

    if (!jsonFromXLSX) {
      throw new Error(`getProcessedDataForFile: jsonFromXLSX is null or undefined ${filePath}`)
    }

    const modifiedJsonFromXLSX = await Promise.all(
      Object.entries(jsonFromXLSX).map(async ([key, value]) => {
        const sheetName = key.replace(/\D/g, '')
        const modifiedKey = sheetName.slice(0, 2) + '.' + sheetName.slice(2)
        const substringedKey = modifiedKey.substring(0, 5)

        const dateFormat = 'dd.MM'

        const parseDate = (key: string) => {
          if (key.length !== 5) {
            console.warn(`parseDate: Invalid key length for ${key}`)
            return null
          }

          const date = parse(key, dateFormat, new Date())

          if (isNaN(date.getTime())) {
            console.warn(`parseDate: Invalid Date for ${key}`)
            return null
          }

          return date
        }

        const start = parseDate(substringedKey)
        if (!start) {
          return null
        }

        const end = addDays(start, 5)
        if (!end) {
          return null
        }

        return {
          key: `${format(start, dateFormat)}-${format(end, dateFormat)}`,
          value,
        }
      }),
    ).then((results) => results.filter((result) => result !== null))

    if (!modifiedJsonFromXLSX) {
      throw new Error(`getProcessedDataForFile: modifiedJsonFromXLSX is null or undefined ${filePath}`)
    }

    const modifiedJson: IUnparsedJson = modifiedJsonFromXLSX.reduce((acc, { key, value }) => {
      acc[key] = value
      return acc
    }, {} as IUnparsedJson)

    if (!modifiedJson) {
      throw new Error(`getProcessedDataForFile: modifiedJson is null or undefined ${filePath}`)
    }

    const { day: dayToPick } = getDayToPick()

    const unParsedJson = removePreviousScheduleEntries(modifiedJson, dayToPick)

    if (!unParsedJson) {
      throw new Error(`getProcessedDataForFile: unParsedJson is null or undefined ${filePath}`)
    }

    const data: Record<string, IDate> = Object.keys(getGroupLetters(unParsedJson)).reduce(
      (acc, groupKey) => {
        acc[groupKey] = getGroupWeekDays(unParsedJson, groupKey)
        return acc
      },
      {} as Record<string, IDate>,
    )

    if (!data) {
      throw new Error(`getProcessedDataForFile: data is null or undefined ${filePath}`)
    }

    return data
  } catch (error) {
    throw new Error(`getProcessedDataForFile: Ошибка при обработке файла ${filePath}: ${error}`)
  }
}
