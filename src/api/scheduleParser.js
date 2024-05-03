import excelToJson from 'convert-excel-to-json'
import path from 'path'

const __dirname = path.resolve()
const filePath = path.join(__dirname, 'fileBase', 'schedule_2.xlsx')

const unParsedJson = excelToJson({
  sourceFile: filePath,
  header: {
    rows: 3,
  },
  range: 'A1:Z35',
})
const groupedData = {}
const parsedJson = {}
const weeks = {}

const flatten = (arr) => arr.reduce((acc, item) => acc.concat(item), [])

const groupByDay = (data, groupNumber) => {
  let currentDay = null
  const groupLetter = getGroupKeys()[groupNumber]
  data.forEach((item) => {
    const group = item[groupLetter] || ''
    if (item.A) {
      currentDay = `${item.A}(${item.B})`
      groupedData[currentDay] = { [item.C]: group }
    } else if (currentDay) {
      groupedData[currentDay] = { ...groupedData[currentDay], [item.C]: group }
    }
  })
}

const getDateKeys = (data) => {
  const dates = []
  Object.keys(data).forEach((key) => {
    const formattedKey = key.replaceAll('.', '').replaceAll(' ', '')
    const keyWithDots = formattedKey.slice(0, 2) + '.' + formattedKey.slice(2, -2) + '.' + formattedKey.slice(-2)
    dates.push(keyWithDots)
  })
  return dates
}

const groupByWeek = (groupedData) => {
  let currentWeek = {}
  let weekIndex = 0
  const dateKeys = getDateKeys(unParsedJson)
  Object.entries(groupedData).forEach(([date, times]) => {
    if (date.includes('Пн.')) {
      currentWeek = {}
      const key = dateKeys[weekIndex++]
      weeks[key] = currentWeek
    }
    currentWeek[date] = times
  })
}

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

const processData = () => {
  const data = flatten(Object.values(unParsedJson))
  groupByDay(data, 203)
  groupByWeek(groupedData)
  Object.keys(getGroupKeys(unParsedJson)).forEach((key) => {
    parsedJson[key] = weeks
  })
}

processData()

export { parsedJson, unParsedJson }
