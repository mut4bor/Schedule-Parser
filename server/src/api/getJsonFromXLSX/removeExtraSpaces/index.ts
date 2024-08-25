// Функция для удаления лишних пробелов и других пробельных символов в строке
export const removeExtraSpaces = (str: string): string => {
  return str.replace(/\s+/g, ' ').trim()
}
