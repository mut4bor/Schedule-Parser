import { IGroupNames, IUnparsedJson } from '@/types/index.js'
import { findObjectWithGroupKeyword } from '../findObjectWithGroupKeyword/index.js'

export const getGroupLetters = (unParsedJson: IUnparsedJson): IGroupNames => {
  const unParsedJsonValues = Object.values(unParsedJson).slice(-1)

  const groupToFind = Object.values(unParsedJsonValues[0])

  const firstObjectWithGroupKeyword = findObjectWithGroupKeyword(groupToFind) ?? groupToFind[2]

  const excludedKeys = ['A', 'B', 'C']

  const result: IGroupNames = {}

  Object.entries(firstObjectWithGroupKeyword)
    .filter(([key, _]) => !excludedKeys.includes(key))
    .forEach(([key, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        const groupKey = typeof value === 'number' ? `Группа ${value}` : value

        if (!result[groupKey]) {
          result[groupKey] = []
        }
        result[groupKey].push(key)
      }
    })

  return result
}
