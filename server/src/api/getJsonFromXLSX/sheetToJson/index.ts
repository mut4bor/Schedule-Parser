import { utils, WorkSheet, CellAddress } from 'xlsx'
import { CellValue, ISheet } from '@/types'
import { numberToTime } from '../numberToTime'
import { removeExtraSpaces } from '../removeExtraSpaces'
import { columnToLetter } from '../columnToLetter'

// Функция для преобразования листа в JSON в нужном формате
export const sheetToJson = (sheet: WorkSheet, skipRows: number): ISheet => {
  const result: ISheet = {}
  const range = utils.decode_range(sheet['!ref'] || '')

  for (let R = range.s.r + skipRows; R <= range.e.r; ++R) {
    const rowKey = `${R + 1}`
    const row: { [key: string]: CellValue } = {}

    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress: CellAddress = { c: C, r: R }
      const cellRef = utils.encode_cell(cellAddress)
      const cell = sheet[cellRef]

      if (cell) {
        let value: CellValue = cell.v
        // Если значение ячейки является числом в диапазоне от 0 до 1,
        // то преобразовываем его в соответствующее время
        if (typeof value === 'number' && value >= 0 && value <= 1) {
          value = numberToTime(value)
        } else if (typeof value === 'string') {
          value = removeExtraSpaces(value)
        }
        const colLetter = columnToLetter(C)
        row[colLetter] = value
      }
    }

    // Добавляем строку в результат только если она не пустая
    if (Object.keys(row).length > 0) {
      result[rowKey] = row
    }
  }

  return result
}
