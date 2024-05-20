import fs from 'fs'
import excelToJson from 'convert-excel-to-json'
import path from 'path'
const __dirname = path.resolve()

const processDataForFile = (fileName, rowsToCut, type) => {
  const getUnparsedJson = () => {
    const filePath = path.join(__dirname, 'docs', 'XLSXFiles', fileName)
    const unParsedJson = excelToJson({
      sourceFile: filePath,
      header: {
        rows: rowsToCut,
      },
    })
    return unParsedJson
  }

  const flatten = (arr) => arr.reduce((acc, item) => acc.concat(item), [])

  const getGroupKeys = () => {
    const swapped = {}
    const obj = flatten(Object.values(getUnparsedJson()))[0]
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'string' && value.includes('Группа') && value !== null) {
        const trimmedValue = value.replace('Группа', '').trim()
        swapped[trimmedValue] = key
      } else {
        delete swapped[value]
      }
    })
    return swapped
  }

  const getDateKeys = () => {
    const dates = {}
    Object.keys(getUnparsedJson()).forEach((key) => {
      const formattedKey = key.replaceAll('.', '').replaceAll(' ', '')
      const keyWithDots = formattedKey.slice(0, 2) + '.' + formattedKey.slice(2, -2) + '.' + formattedKey.slice(-2)
      dates[keyWithDots] = {}
    })
    return dates
  }

  function parseSubjectTime(dateString) {
    const date = new Date(dateString)

    if (!isNaN(date.getTime())) {
      date.setHours(date.getHours() + 3)
      let minutes = date.getUTCMinutes()
      minutes = Math.ceil(minutes / 15) * 15
      if (minutes === 60) {
        date.setHours(date.getHours() + 1)
        minutes = 0
      }
      const hours = date.getUTCHours().toString().padStart(2, '0')
      return `${hours}:${minutes.toString().padStart(2, '0')}`
    }
    return dateString
  }

  function getNextTwoLetters(letter) {
    let charCode = letter.charCodeAt(0)

    if (charCode === 90) {
      return 'YZ'
    }

    let nextLetter1 = String.fromCharCode(charCode + 1)
    let nextLetter2 = String.fromCharCode(charCode + 2)

    return { class: nextLetter1, teacher: nextLetter2 }
  }

  const extractGroupedData = (data, groupLetter, type) => {
    const groupedData = {}
    let currentDay = null
    data.forEach((item) => {
      const date = item.A
      const weekDay = item.B
      const time = parseSubjectTime(item.C)
      const className = item[groupLetter] || ''
      const auditory = item[getNextTwoLetters(groupLetter).class] || ''
      const teacher = item[getNextTwoLetters(groupLetter).teacher] || ''
      const subject = type === 1 ? item[groupLetter] || '' : `${className} ${auditory} ${teacher}`.trim()

      if (date && date.length < 7) {
        currentDay = `${date.substring(0, 5)} (${weekDay})`
        groupedData[currentDay] = { [time]: subject }
      } else if (currentDay) {
        groupedData[currentDay] = { ...groupedData[currentDay], [time]: subject }
      }
    })
    return groupedData
  }

  const getGroupWeekDays = (groupNumber) => {
    const data = flatten(Object.values(getUnparsedJson()))
    const groupLetter = getGroupKeys(getUnparsedJson())[groupNumber]
    const groupedData = extractGroupedData(data, groupLetter, type)
    const weekDates = getDateKeys(getUnparsedJson())
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
    const groupKeys = Object.keys(getGroupKeys(getUnparsedJson()))

    groupKeys.forEach((groupKey) => {
      data[groupKey] = getGroupWeekDays(groupKey)
    })
    return data
  }

  return processData()
}

const processDataForAllFiles = (fileNames, rowsToCut, type) => {
  let data = {}
  fileNames.forEach((fileName) => {
    Object.entries(processDataForFile(fileName, rowsToCut, type)).forEach(([group, schedule]) => {
      data[group] = schedule
    })
  })
  return data
}

const fileNames1 = [
  'schedule_1.xlsx',
  'schedule_2.xlsx',
  'schedule_3.xlsx',
  'schedule_4.xlsx',
  'schedule_5.xlsx',
  'schedule_6.xlsx',
  'schedule_7.xlsx',
  'schedule_8.xlsx',
]
const fileNames2 = ['schedule_9.xlsx', 'schedule_10.xlsx', 'schedule_11.xlsx', 'schedule_12.xlsx']
const fileNames3 = [
  'schedule_13.xlsx',
  'schedule_14.xlsx',
  'schedule_15.xlsx',
  'schedule_16.xlsx',
  'schedule_17.xlsx',
  'schedule_18.xlsx',
  'schedule_19.xlsx',
  'schedule_20.xlsx',
  'schedule_21.xlsx',
  'schedule_22.xlsx',
  'schedule_23.xlsx',
  'schedule_24.xlsx',
  'schedule_25.xlsx',
  'schedule_26.xlsx',
  'schedule_27.xlsx',
  'schedule_28.xlsx',
  'schedule_29.xlsx',
]
const allData = processDataForAllFiles(fileNames1, 3, 1)
// const secondData = processDataForAllFiles(fileNames2, 2, 2)
// const thirdData = processDataForAllFiles(fileNames3, 3, 2)

// const data = {
//   ...allData,
//   ...secondData,
//   ...thirdData,
// }

try {
  fs.writeFileSync(path.join(__dirname, 'docs', 'allData.json'), JSON.stringify(allData, null, 2), 'utf8')
  // fs.writeFileSync(path.join(__dirname, 'docs', 'secondData.json'), JSON.stringify(secondData, null, 2), 'utf8')
  // fs.writeFileSync(path.join(__dirname, 'docs', 'thirdData.json'), JSON.stringify(thirdData, null, 2), 'utf8')
  console.log('Data successfully saved to disk')
} catch (error) {
  console.log('An error has occurred ', error)
}
// export { data }
