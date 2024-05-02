import excelToJson from 'convert-excel-to-json'
import path from 'path'

const __dirname = path.resolve()
const filePath = path.join(__dirname, 'fileBase', 'schedule_6.xlsx')

const unParsedJson = excelToJson({
  sourceFile: filePath,
  header: {
    rows: 5,
  },
  range: 'A1:Z35',
})

const parsedJson = {}
Object.values(unParsedJson).forEach((item, index) => {
  const group = item.map((item, index) => {
    const { A: date, B: day, C: time, F: name } = item
    const classDate = `${date ? date : ''} - ${day ? day : ''}`
    const classTimeName = `${time ? time : ''} - ${name ? name : ''}`
    return {
      date: classDate,
      class: classTimeName,
    }
  })

  const combined = {}
  for (let i = 0; i < group.length; i += 5) {
    combined[group[i]?.date] = {
      1: group[i]?.class,
      2: group[i + 1]?.class,
      3: group[i + 2]?.class,
      4: group[i + 3]?.class,
      5: group[i + 4]?.class,
    }
  }
  const key = Object.keys(unParsedJson)[index]
  parsedJson[key] = combined
})

export { parsedJson, unParsedJson }
