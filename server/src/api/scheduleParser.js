import path from 'path'
import { getJsonFromXLSX } from './getJsonFromXLSX.js'

const __dirname = path.resolve()

const processDataForFile = ({
  fileSerialNumber: fileSerialNumber,
  rowsToCut: rowsToCut,
  type: type,
}) => {
  const filePath = path.join(
    __dirname,
    'docs',
    'XLSXFiles',
    `schedule_${fileSerialNumber}.xlsx`,
  )

  const unParsedJson = getJsonFromXLSX(filePath, rowsToCut)

  const getGroupLetters = (unParsedJson) => {
    const obj = Object.values(unParsedJson)[0][rowsToCut + 1]
    const excludedKeys = ['A', 'B', 'C']

    return Object.fromEntries(
      Object.entries(obj)
        .filter(([key, _]) => !excludedKeys.includes(key))
        .map(([key, value]) => [value, key]),
    )
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

  function getNextTwoLetters(letter) {
    const charCode = letter.charCodeAt(0)

    if (charCode === 90) {
      return 'YZ'
    }

    const nextLetter1 = String.fromCharCode(charCode + 1)
    const nextLetter2 = String.fromCharCode(charCode + 2)

    return { auditory: nextLetter1, teacher: nextLetter2 }
  }

  const extractGroupedData = (unParsedJson, groupLetter, type) => {
    const groupedData = {}

    const processItem = (item) => {
      const { A, B, C } = item
      const date = `${typeof A === 'string' ? A.substring(0, 5) : A} (${B})`
      const time = C
      const { auditory, teacher } = getNextTwoLetters(groupLetter)
      const className = item[groupLetter] || ''
      const subject =
        type === 'oneCell'
          ? item[groupLetter] || ''
          : `${className} ${item[auditory] || ''} ${item[teacher] || ''}`.trim()

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
    const groupLetter = getGroupLetters(unParsedJson)[groupNumber]
    const groupedData = extractGroupedData(unParsedJson, groupLetter, type)
    const weekDates = getDateKeys(unParsedJson)
    const weekDatesKeys = Object.keys(weekDates)
    let weekIndex = 0
    let currentWeek = {}
    const isWeekday = (date) => /(Пн\.|Вт\.|Ср\.|Чт\.|Пт\.|Сб\.)/.test(date)

    Object.entries(groupedData).forEach(([date, schedule]) => {
      if (isWeekday(date)) {
        if (date.includes('Пн.')) {
          const weekKey = weekDatesKeys[weekIndex++]
          currentWeek = {}
          weekDates[weekKey] = currentWeek
        }

        currentWeek[date] = schedule
      }
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
}

const processDataForAllFiles = ({
  fileSerialNumbers: fileSerialNumbers,
  rowsToCut: rowsToCut,
  type: type,
}) => {
  const data = {}
  fileSerialNumbers.forEach((fileSerialNumber) => {
    Object.entries(
      processDataForFile({
        fileSerialNumber: fileSerialNumber,
        rowsToCut: rowsToCut,
        type: type,
      }),
    ).forEach(([group, schedule]) => {
      data[group] = schedule
    })
  })
  return data
}

const dataToProcess = {
  firstData: {
    fileSerialNumbers: [1, 2, 3, 4, 5, 6, 7, 8],
    rowsToCut: 3,
    type: 'oneCell',
  },
  secondData: {
    fileSerialNumbers: [9, 10, 11, 12],
    rowsToCut: 2,
    type: 'multipleCell',
  },
  thirdData: {
    fileSerialNumbers: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
    rowsToCut: 3,
    type: 'multipleCell',
  },
  fourthData: {
    fileSerialNumbers: [27, 28, 29],
    rowsToCut: 2,
    type: 'multipleCell',
  },
}

const firstData = processDataForAllFiles(dataToProcess.firstData)
const secondData = processDataForAllFiles(dataToProcess.secondData)
const thirdData = processDataForAllFiles(dataToProcess.thirdData)
const fourthData = processDataForAllFiles(dataToProcess.fourthData)

const data = {
  ...firstData,
  ...secondData,
  ...thirdData,
  ...fourthData,
}

// try {
//   fs.writeFileSync(
//     path.join(__dirname, 'docs', 'data.json'),
//     JSON.stringify(data, null, 2),
//     'utf8',
//   )
//   console.log('Data successfully saved to disk')
// } catch (error) {
//   console.log('An error has occurred ', error)
// }

export { data }
