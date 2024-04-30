import excelToJson from 'convert-excel-to-json'
import path from 'path'

const __dirname = path.resolve()
const filePath = path.join(__dirname, 'fileBase', 'schedule_8.xlsx')

// https://www.npmjs.com/package/convert-excel-to-json

export const result = excelToJson({
  sourceFile: filePath,
  header: {
    rows: 5,
  },
  range: 'A1:Z35',
})
export const content = Object.values(result).map((item) => {
  const group = item.map((item, index) => {
    const date = item.A
    const day = item.B
    const time = item.C
    const name = item.F || ''
    const classDate = date || day ? `${date} - ${day}` : undefined
    const classTimeName = time || name ? `${time} - ${name}` : undefined
    return {
      date: classDate,
      class: classTimeName,
    }
  })
  const combined = []
  for (let i = 0; i < group.length; i += 5) {
    combined.push({
      date: group[i]?.date,
      1: group[i]?.class,
      2: group[i + 1]?.class,
      3: group[i + 2]?.class,
      4: group[i + 3]?.class,
      5: group[i + 4]?.class,
    })
  }
  return combined
})
