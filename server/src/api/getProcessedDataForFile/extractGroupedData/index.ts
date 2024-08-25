import { IColumnLetter, IDay, IUnparsedJson } from '@/types'

export const extractGroupedData = (unParsedJson: IUnparsedJson, groupLetters: string[]) => {
  const groupedData: IDay = {}

  const processItem = (item: IColumnLetter) => {
    const { A, B, C } = item
    const day = `${A ?? ''} (${B})`.trim()
    const time = C

    const subject = groupLetters
      .map((letter) => {
        return item[letter] || ''
      })
      .join(' ')
      .trim()

    return { day, time, subject }
  }

  Object.values(unParsedJson).forEach((row) => {
    Object.values(row).forEach((item) => {
      const { day, time, subject } = processItem(item)

      if (!groupedData[day]) {
        groupedData[day] = {}
      }

      if (!!time && typeof time !== 'boolean') {
        groupedData[day][time] = subject
      }
    })
  })

  return groupedData
}
