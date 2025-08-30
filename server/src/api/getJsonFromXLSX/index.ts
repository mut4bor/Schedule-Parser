import XLSX from 'xlsx'
import { fillMergedCells } from './fillMergedCells/index.js'
import { sheetToJson } from './sheetToJson/index.js'
import { IUnparsedJson } from '@/types/index.js'

// Эту хуйню писал ChatGPT, настоятельно советую даже не пробовать это понять. Она работает исключительно по воле Божьей

export const getJsonFromXLSX = (filePath: string, skipRows: number = 0): IUnparsedJson => {
  try {
    // Чтение книги из указанного файла
    const workbook: XLSX.WorkBook = XLSX.readFile(filePath)

    // Объект для хранения всех листов
    const result: IUnparsedJson = {}

    // Итерация по каждому листу в книге
    workbook.SheetNames.forEach((sheetName) => {
      // Доступ к листу по его имени
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName]

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
