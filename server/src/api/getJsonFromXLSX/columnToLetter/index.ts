// Функция для преобразования номера столбца в буквенное обозначение
export const columnToLetter = (column: number): string => {
  let letter = ''
  while (column >= 0) {
    letter = String.fromCharCode((column % 26) + 65) + letter
    column = Math.floor(column / 26) - 1
  }
  return letter
}
