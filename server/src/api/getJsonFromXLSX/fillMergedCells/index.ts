import XLSX from 'xlsx'
import { MergedCell } from '@/types/index.js'

// Функция для заполнения объединенных ячеек
export const fillMergedCells = (sheet: XLSX.WorkSheet): void => {
  const merges = sheet['!merges'] as MergedCell[] | undefined
  if (merges) {
    merges.forEach((merge) => {
      const startCell = merge.s
      const endCell = merge.e
      const startCellRef = XLSX.utils.encode_cell(startCell)
      const startValue = sheet[startCellRef] ? sheet[startCellRef].v : null

      for (let R = startCell.r; R <= endCell.r; ++R) {
        for (let C = startCell.c; C <= endCell.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ c: C, r: R })
          if (startValue !== null) {
            sheet[cellRef] = { v: startValue }
          }
        }
      }
    })
  }
}
