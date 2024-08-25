import { getJsonFromXLSX } from '@/api/getJsonFromXLSX'
import { getDayToPick } from '@/hooks/getDayToPick'
import { getDaysInRange } from '@/hooks/getDaysInRange'
import { IGroup, IUnparsedJson } from '@/types'
import path from 'path'

export const getProcessedDataForFile = async (filePath: string) => {
  try {
    const jsonFromXLSX = getJsonFromXLSX(filePath)

    console.log(jsonFromXLSX)

    const removePreviousScheduleEntries = (schedule: IUnparsedJson, day: string) => {
      const scheduleKeys = Object.keys(schedule)

      //!Ошибка тут
      const daysRange = scheduleKeys.map((item) => {
        console.log(item)
        return getDaysInRange(item)
      })
      //!

      const currentWeekIndex = daysRange.findIndex((subArray) => subArray.includes(day))

      if (currentWeekIndex !== -1) {
        const previousWeekIndex = Math.max(0, currentWeekIndex - 1)

        scheduleKeys.slice(0, previousWeekIndex).forEach((key) => {
          delete schedule[key]
        })
      }

      return schedule
    }

    const { day: dayToPick } = getDayToPick()

    const unParsedJson = removePreviousScheduleEntries(jsonFromXLSX, dayToPick)

    // const getGroupLetters = (unParsedJson: IUnparsedJson): Record<string, string[]> => {
    //   const findObjectWithGroupKeyword = (objects: Record<string, string | number | boolean | null>[]) => {
    //     for (let obj of objects) {
    //       for (let value of Object.values(obj)) {
    //         if (typeof value === 'string' && value.includes('Группа')) {
    //           return obj
    //         }
    //       }
    //     }
    //     return null
    //   }

    //   const [_, unParsedJsonValues] = Object.values(unParsedJson)
    //   const groupToFind = Object.values(unParsedJsonValues)

    //   const firstObjectWithGroupKeyword =
    //     findObjectWithGroupKeyword(groupToFind) ?? Object.values(unParsedJsonValues)[3]

    //   const excludedKeys = ['A', 'B', 'C']

    //   const result: Record<string, string[]> = {}

    //   Object.entries(firstObjectWithGroupKeyword)
    //     .filter(([key, _]) => !excludedKeys.includes(key))
    //     .forEach(([key, value]) => {
    //       if (typeof value === 'string') {
    //         if (!result[value]) {
    //           result[value] = []
    //         }
    //         result[value].push(key)
    //       }
    //     })

    //   return result
    // }

    // const getDateKeys = (unParsedJson: IUnparsedJson) => {
    //   return Object.fromEntries(
    //     Object.keys(unParsedJson).map((key) => {
    //       if (key) {
    //         const formattedKey = key.replace(/\./g, '').replace(/\s+/g, '').trim()
    //         const keyWithDots = `${formattedKey.slice(0, 2)}.${formattedKey.slice(2, -2)}.${formattedKey.slice(-2)}`
    //         unParsedJson[keyWithDots] = value
    //       } else {
    //         console.error('Unexpected key:', key)
    //       }
    //     }),
    //   )
    // }

    // const extractGroupedData = (unParsedJson: ArrayLike<unknown> | { [s: string]: unknown }, groupLetters: any[]) => {
    //   const groupedData = {}

    //   const processItem = (item) => {
    //     const { A, B, C } = item
    //     const date = `${A} (${B})`
    //     const time = C

    //     const subject = groupLetters
    //       .map((letter) => {
    //         return item[letter] || ''
    //       })
    //       .join(' ')
    //       .trim()

    //     return { date, time, subject }
    //   }

    //   Object.values(unParsedJson).forEach((row) => {
    //     Object.values(row).forEach((item) => {
    //       const { date, time, subject } = processItem(item)

    //       if (!groupedData[date]) {
    //         groupedData[date] = {}
    //       }

    //       groupedData[date][time] = subject
    //     })
    //   })

    //   return groupedData
    // }

    // const getGroupWeekDays = (unParsedJson, groupNumber) => {
    //   const groupLetters = getGroupLetters(unParsedJson)[groupNumber]
    //   const groupedData = extractGroupedData(unParsedJson, groupLetters)
    //   const weekDates = getDateKeys(unParsedJson)
    //   const weekDatesKeys = Object.keys(weekDates)

    //   const days = {}

    //   weekDatesKeys.forEach((item) => {
    //     days[item] = getDaysInRange(item)
    //   })

    //   Object.entries(groupedData).forEach(([date, schedule]) => {
    //     Object.entries(days).forEach(([key, value]) => {
    //       if (value.includes(date.substring(0, 5))) {
    //         weekDates[key][date] = schedule
    //       }
    //     })
    //   })

    //   return weekDates
    // }

    // const processData = () => {
    //   const data = {}
    //   const groupNames = Object.keys(getGroupLetters(unParsedJson))

    //   groupNames.forEach((groupKey) => {
    //     data[groupKey] = getGroupWeekDays(unParsedJson, groupKey)
    //   })
    //   return data
    // }
    // return processData()
  } catch (error) {
    throw new Error(`Ошибка при обработке файла ${filePath}: ${error}`)
  }
}
;(async () => {
  const __XLSXFilesDir = path.join(path.resolve(), 'docs', 'XLSXFiles')

  const fullPath = path.join(__XLSXFilesDir, '2be40a153ff4c910bebea6be73b12bd0.xlsx')
  const data = await getProcessedDataForFile(fullPath)
  console.log(data)
})()
