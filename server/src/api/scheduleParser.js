import excelToJson from 'convert-excel-to-json'
import path from 'path'

const __dirname = path.resolve()
const fileNames = [
  'schedule_1.xlsx',
  'schedule_2.xlsx',
  'schedule_3.xlsx',
  'schedule_4.xlsx',
  'schedule_5.xlsx',
  'schedule_6.xlsx',
  'schedule_7.xlsx',
  'schedule_8.xlsx',
]

const processDataForFile = (fileName) => {
  const filePath = path.join(__dirname, 'docs', 'XLSXFiles', fileName)
  const unParsedJson = excelToJson({
    sourceFile: filePath,
    header: {
      rows: 3,
    },
    range: 'A1:Z35',
  })

  const flatten = (arr) => arr.reduce((acc, item) => acc.concat(item), [])

  const getGroupKeys = () => {
    const swapped = {}
    const obj = flatten(Object.values(unParsedJson))[0]
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key].match(/\d+/)
        if (value !== null) {
          swapped[value] = key
        }
      }
    }
    return swapped
  }

  const getDateKeys = () => {
    const dates = {}
    Object.keys(unParsedJson).forEach((key) => {
      const formattedKey = key.replaceAll('.', '').replaceAll(' ', '')
      const keyWithDots = formattedKey.slice(0, 2) + '.' + formattedKey.slice(2, -2) + '.' + formattedKey.slice(-2)
      dates[keyWithDots] = {}
    })
    return dates
  }

  const extractGroupedData = (data, groupLetter) => {
    const groupedData = {}
    let currentDay = null
    data.forEach((item) => {
      const group = item[groupLetter] || ''
      if (item.A) {
        currentDay = `${item.A.substring(0, 5)} (${item.B})`
        groupedData[currentDay] = { [item.C]: group }
      } else if (currentDay) {
        groupedData[currentDay] = { ...groupedData[currentDay], [item.C]: group }
      }
    })
    return groupedData
  }

  const getGroupWeekDays = (groupNumber) => {
    const data = flatten(Object.values(unParsedJson))
    const groupLetter = getGroupKeys()[groupNumber]
    const groupedData = extractGroupedData(data, groupLetter)
    const weekDates = getDateKeys()
    const weekDatesKeys = Object.keys(weekDates)
    let weekIndex = 0
    let currentWeek = {}

    Object.entries(groupedData).forEach(([date, schedule]) => {
      if (date.includes('Пн.')) {
        const weekKey = weekDatesKeys[weekIndex++]
        currentWeek = {}
        weekDates[weekKey] = currentWeek
      }
      currentWeek[date] = schedule
    })
    return weekDates
  }

  const processData = () => {
    const data = {}
    const groupKeys = Object.keys(getGroupKeys())

    groupKeys.forEach((groupKey) => {
      data[groupKey] = getGroupWeekDays(groupKey)
    })
    return data
  }

  return processData()
}

const processDataForAllFiles = () => {
  let data = {}
  fileNames.forEach((fileName) => {
    Object.entries(processDataForFile(fileName)).forEach(([group, schedule]) => {
      data[group] = schedule
    })
  })
  return data
}

const allData = processDataForAllFiles()

export { allData }
