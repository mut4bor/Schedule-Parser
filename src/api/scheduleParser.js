import excelToJson from 'convert-excel-to-json'
import path from 'path'

const __dirname = path.resolve()
const filePath = path.join(__dirname, 'src', 'api', 'files', 'schedule_2.xlsx')

// https://www.npmjs.com/package/convert-excel-to-json

export const result = excelToJson({
  sourceFile: filePath,
  header: {
    rows: 4,
  },
  sheets: ['29.04.- 04.05.'],
  columnToKey: {
    A: 'Дата',
    B: 'День недели',
    C: 'Время',
    D: 'Группа 201',
    E: 'Группа 202',
    F: 'Группа 203',
    G: 'Группа 204',
    H: 'Группа 205',
    I: 'Группа 206',
    J: 'Группа 207',
    K: 'Группа 208',
    L: 'Группа 209',
    M: 'Группа 210',
    N: 'Группа 211',
    O: 'Группа 212',
    P: 'Группа 213',
    Q: 'Группа 214',
  },
})

// console.log(result)
