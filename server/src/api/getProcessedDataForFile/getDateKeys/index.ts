import { IDate, IUnparsedJson } from '@/types'

export const getDateKeys = (unParsedJson: IUnparsedJson): IDate => {
  return Object.keys(unParsedJson).reduce((acc, key) => {
    acc[key] = {}
    return acc
  }, {} as IDate)
}
