import { utils, readFile, WorkBook, WorkSheet } from 'xlsx'

// Эту хуйню писал ChatGPT, настоятельно советую даже не пробовать это понять. Она работает исключительно по воле Божьей

type CellValue = string | number | boolean | null

interface CellAddress {
  c: number
  r: number
}

interface MergedCell {
  s: CellAddress
  e: CellAddress
}

interface SheetData {
  [key: string]: {
    [key: string]: CellValue
  }
}

export const getJsonFromXLSX = (filePath: string, skipRows: number = 0): { [sheetName: string]: SheetData } => {
  try {
    // Чтение книги из указанного файла
    const workbook: WorkBook = readFile(filePath)

    // Функция для преобразования номера столбца в буквенное обозначение
    function columnToLetter(column: number): string {
      let letter = ''
      while (column >= 0) {
        letter = String.fromCharCode((column % 26) + 65) + letter
        column = Math.floor(column / 26) - 1
      }
      return letter
    }

    // Функция для заполнения объединенных ячеек
    function fillMergedCells(sheet: WorkSheet): void {
      const merges = sheet['!merges'] as MergedCell[] | undefined
      if (merges) {
        merges.forEach((merge) => {
          const startCell = merge.s
          const endCell = merge.e
          const startCellRef = utils.encode_cell(startCell)
          const startValue = sheet[startCellRef] ? sheet[startCellRef].v : null

          for (let R = startCell.r; R <= endCell.r; ++R) {
            for (let C = startCell.c; C <= endCell.c; ++C) {
              const cellRef = utils.encode_cell({ c: C, r: R })
              if (startValue !== null) {
                sheet[cellRef] = { v: startValue }
              }
            }
          }
        })
      }
    }

    function numberToTime(number: number): string {
      const hours = Math.floor(number * 24)
      const minutes = Math.round((number * 24 - hours) * 60)
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }

    // Функция для удаления лишних пробелов и других пробельных символов в строке
    function removeExtraSpaces(str: string): string {
      return str.replace(/\s+/g, ' ').trim()
    }

    // Функция для преобразования листа в JSON в нужном формате
    function sheetToJson(sheet: WorkSheet, skipRows: number): SheetData {
      const result: SheetData = {}
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

    // Объект для хранения всех листов
    const result: { [sheetName: string]: SheetData } = {}

    // Итерация по каждому листу в книге
    workbook.SheetNames.forEach((sheetName) => {
      // Доступ к листу по его имени
      const worksheet: WorkSheet = workbook.Sheets[sheetName]

      // Заполнение объединенных ячеек
      fillMergedCells(worksheet)

      // Преобразование листа в JSON с пропуском первых N строк
      result[sheetName] = sheetToJson(worksheet, skipRows)
    })

    return result
  } catch (error) {
    throw new Error(`Ошибка при обработке файла ${filePath}: ${(error as Error).message}`)
  }
}
