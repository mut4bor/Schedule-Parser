import { getJsonFromXLSX } from './getJsonFromXLSX.js'

export const getProcessedDataForFile = async (filePath) => {
  try {
    const jsonFromXLSX = getJsonFromXLSX(filePath)

    const jsonWithTrimmedKeys = {}
    Object.entries(jsonFromXLSX).forEach(([key, value]) => {
      const formattedKey = key.replace(/\./g, '').replace(/\s+/g, '').trim()
      const keyWithDots = `${formattedKey.slice(0, 2)}.${formattedKey.slice(2, -2)}.${formattedKey.slice(-2)}`
      jsonWithTrimmedKeys[keyWithDots] = value
    })

    const getCurrentWeekRange = () => {
      const today = new Date()
      const dayOfWeek = today.getDay()

      const diffToMonday = (dayOfWeek + 6) % 7

      const mondayOfCurrentWeek = new Date(today)
      mondayOfCurrentWeek.setDate(today.getDate() - diffToMonday)

      const saturdayOfCurrentWeek = new Date(mondayOfCurrentWeek)
      saturdayOfCurrentWeek.setDate(mondayOfCurrentWeek.getDate() + 5)

      const format = (date) => {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        return `${day}.${month}`
      }

      return {
        monday: format(mondayOfCurrentWeek),
        saturday: format(saturdayOfCurrentWeek),
      }
    }

    const getDaysInRange = (range) => {
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

    const removePreviousScheduleEntries = (schedule, { monday, saturday }) => {
      const scheduleKeys = Object.keys(schedule)

      const daysRange = scheduleKeys.map((item) => getDaysInRange(item))

      const currentWeekIndex = daysRange.findIndex(
        (subArray) => subArray.includes(monday) && subArray.includes(saturday),
      )

      if (currentWeekIndex !== -1) {
        const previousWeekIndex = Math.max(0, currentWeekIndex - 1)

        scheduleKeys.slice(0, previousWeekIndex).forEach((key) => {
          delete schedule[key]
        })
      }

      return schedule
    }

    const unParsedJson = removePreviousScheduleEntries(
      jsonWithTrimmedKeys,
      getCurrentWeekRange(),
    )

    const getGroupLetters = (unParsedJson) => {
      const findObjectWithGroupKeyword = (objects) => {
        for (let obj of objects) {
          for (let value of Object.values(obj)) {
            if (typeof value === 'string' && value.includes('Группа')) {
              return obj
            }
          }
        }
        return null
      }
      const [unParsedJsonValues] = Object.values(unParsedJson)
      const groupToFind = Object.values(unParsedJsonValues)
      const firstObjectWithGroupKeyword =
        findObjectWithGroupKeyword(groupToFind) ?? unParsedJsonValues[3]

      const excludedKeys = ['A', 'B', 'C']

      const result = {}

      Object.entries(firstObjectWithGroupKeyword)
        .filter(([key, _]) => !excludedKeys.includes(key))
        .forEach(([key, value]) => {
          if (!result[value]) {
            result[value] = []
          }
          result[value].push(key)
        })

      return result
    }

    const getDateKeys = (unParsedJson) => {
      return Object.fromEntries(
        Object.keys(unParsedJson).map((key) => {
          const formattedKey = key.replace(/\./g, '').replace(/\s+/g, '').trim()
          const keyWithDots = `${formattedKey.slice(0, 2)}.${formattedKey.slice(2, -2)}.${formattedKey.slice(-2)}`
          return [keyWithDots, {}]
        }),
      )
    }

    const extractGroupedData = (unParsedJson, groupLetters) => {
      const groupedData = {}

      const processItem = (item) => {
        const { A, B, C } = item
        const date = `${A} (${B})`
        const time = C

        const subject = groupLetters
          .map((letter) => {
            return item[letter] || ''
          })
          .join(' ')
          .trim()

        return { date, time, subject }
      }

      Object.values(unParsedJson).forEach((row) => {
        Object.values(row).forEach((item) => {
          const { date, time, subject } = processItem(item)

          if (!groupedData[date]) {
            groupedData[date] = {}
          }

          groupedData[date][time] = subject
        })
      })

      return groupedData
    }

    const getGroupWeekDays = (unParsedJson, groupNumber) => {
      const groupLetters = getGroupLetters(unParsedJson)[groupNumber]
      const groupedData = extractGroupedData(unParsedJson, groupLetters)
      const weekDates = getDateKeys(unParsedJson)
      const weekDatesKeys = Object.keys(weekDates)

      const days = {}

      weekDatesKeys.forEach((item) => {
        days[item] = getDaysInRange(item)
      })

      Object.entries(groupedData).forEach(([date, schedule]) => {
        Object.entries(days).forEach(([key, value]) => {
          if (value.includes(date.substring(0, 5))) {
            weekDates[key][date] = schedule
          }
        })
      })

      return weekDates
    }

    const processData = () => {
      const data = {}
      const groupNames = Object.keys(getGroupLetters(unParsedJson))

      groupNames.forEach((groupKey) => {
        data[groupKey] = getGroupWeekDays(unParsedJson, groupKey)
      })
      return data
    }
    return processData()
  } catch (error) {
    throw new Error(`Ошибка при обработке файла ${filePath}: ${error}`)
  }
}
