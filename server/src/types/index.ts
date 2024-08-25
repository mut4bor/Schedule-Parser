export interface CellAddress {
  c: number
  r: number
}

export interface MergedCell {
  s: CellAddress
  e: CellAddress
}

export type CellValue = string | number | boolean | null

export interface IColumnLetter {
  [columnLetter: string]: CellValue
}

export interface ISheet {
  [rowNumber: string]: IColumnLetter
}

export interface IUnparsedJson {
  [sheetName: string]: ISheet
}

export type IWeekRange = string[]

export interface ITime {
  [time: string]: string
}

export interface IDay {
  [day: string]: ITime
}

export interface IDate {
  [week: string]: IDay
}

export interface IGroup {
  educationType: string
  faculty: string
  course: string
  group: string
  index?: number
  dates: IDate
}

export interface IGroupNames {
  [groupName: string]: string[]
}

export interface IPathMap {
  [fileName: string]: {
    educationType: string
    faculty: string
    course: string
    fileName: string
  }
}
