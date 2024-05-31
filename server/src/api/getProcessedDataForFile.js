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

    const getPreviousWeekRange = () => {
      const today = new Date()
      const dayOfWeek = today.getDay()

      const firstDayOfPreviousWeek = new Date(today)
      const diffToMonday = (dayOfWeek + 6) % 7
      firstDayOfPreviousWeek.setDate(today.getDate() - diffToMonday - 7)

      const lastDayOfPreviousWeek = new Date(firstDayOfPreviousWeek)
      lastDayOfPreviousWeek.setDate(firstDayOfPreviousWeek.getDate() + 5)

      const format = (date) => {
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        return `${day}.${month}`
      }

      return `${format(firstDayOfPreviousWeek)}-${format(lastDayOfPreviousWeek)}`
    }

    function removePreviousScheduleEntries(schedule, targetKey) {
      const scheduleKeys = Object.keys(schedule)
      const targetIndex = scheduleKeys.indexOf(targetKey)

      if (targetIndex !== -1) {
        const keysToRemove = scheduleKeys.slice(0, targetIndex)
        keysToRemove.forEach((key) => {
          delete schedule[key]
        })
      }

      return schedule
    }

    const unParsedJson = removePreviousScheduleEntries(
      jsonWithTrimmedKeys,
      getPreviousWeekRange(),
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

    const getDaysInRange = (range) => {
      const [start, end] = range.split('-')
      const [startDay, startMonth] = start.split('.').map(Number)
      const [endDay, endMonth] = end.split('.').map(Number)

      const startDate = new Date(
        new Date().getFullYear(),
        startMonth - 1,
        startDay,
      )
      const endDate = new Date(new Date().getFullYear(), endMonth - 1, endDay)

      const dates = []
      let currentDate = startDate

      while (currentDate <= endDate) {
        let day = currentDate.getDate().toString().padStart(2, '0')
        let month = (currentDate.getMonth() + 1).toString().padStart(2, '0')
        dates.push(`${day}.${month}`)
        currentDate.setDate(currentDate.getDate() + 1)
      }

      return dates
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
