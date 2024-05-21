import fs from 'fs'
import excelToJson from 'convert-excel-to-json'
import path from 'path'
const __dirname = path.resolve()

const processDataForFile = (fileSerialNumber, rowsToCut, type) => {
  const filePath = path.join(__dirname, 'docs', 'XLSXFiles', `schedule_${fileSerialNumber}.xlsx`)
  const unParsedJson = excelToJson({
    sourceFile: filePath,
    header: {
      rows: rowsToCut,
    },
  })

  const flatten = (arr) => arr.reduce((acc, item) => acc.concat(item), [])

  const getGroupKeys = () => {
    const swapped = {}
    const obj = flatten(Object.values(unParsedJson))[0]
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
    Object.keys(unParsedJson).forEach((key) => {
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
      const subject = type === 'oneCell' ? item[groupLetter] || '' : `${className} ${auditory} ${teacher}`.trim()
      if (time !== undefined) {
        if (date && date.length < 7) {
          currentDay = `${date.substring(0, 5)} (${weekDay})`
          groupedData[currentDay] = { [time]: subject }
        } else if (currentDay) {
          groupedData[currentDay] = { ...groupedData[currentDay], [time]: subject }
        }
      }
    })
    return groupedData
  }

  const getGroupWeekDays = (groupNumber) => {
    const data = flatten(Object.values(unParsedJson))
    const groupLetter = getGroupKeys(unParsedJson)[groupNumber]
    const groupedData = extractGroupedData(data, groupLetter, type)
    const weekDates = getDateKeys(unParsedJson)
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
    const groupKeys = Object.keys(getGroupKeys(unParsedJson))

    groupKeys.forEach((groupKey) => {
      data[groupKey] = getGroupWeekDays(groupKey)
    })
    return data
  }

  return processData()
}

const processDataForAllFiles = ({ fileNames: fileNames, rowsToCut: rowsToCut, type: type }) => {
  let data = {}
  fileNames.forEach((fileName) => {
    Object.entries(processDataForFile(fileName, rowsToCut, type)).forEach(([group, schedule]) => {
      data[group] = schedule
    })
  })
  return data
}

const dataToProcess = {
  firstData: {
    fileNames: [1, 2, 3, 4, 5, 6, 7, 8],
    rowsToCut: 3,
    type: 'oneCell',
  },
  secondData: {
    fileNames: [9, 10, 11, 12],
    rowsToCut: 2,
    type: 'multipleCell',
  },
  thirdData: {
    fileNames: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    rowsToCut: 3,
    type: 'multipleCell',
  },
}

const firstData = processDataForAllFiles(dataToProcess.firstData)
const secondData = processDataForAllFiles(dataToProcess.secondData)
const thirdData = processDataForAllFiles(dataToProcess.thirdData)

const data = {
  ...firstData,
  ...secondData,
  ...thirdData,
}

// try {
//   fs.writeFileSync(path.join(__dirname, 'docs', 'data.json'), JSON.stringify(data, null, 2), 'utf8')
//   console.log('Data successfully saved to disk')
// } catch (error) {
//   console.log('An error has occurred ', error)
// }
export { data }
