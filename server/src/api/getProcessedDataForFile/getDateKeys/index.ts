import { IDate, IUnparsedJson } from '@/types/index.js'

export const getDateKeys = (unParsedJson: IUnparsedJson): IDate => {
  return Object.keys(unParsedJson).reduce((acc, key) => {
    acc[key] = {}
    return acc
  }, {} as IDate)
}
