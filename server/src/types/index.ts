export interface IDate {
  [week: string]: {
    [day: string]: {
      [time: string]: string
    }
  }
}

export interface IGroup {
  educationType: string
  faculty: string
  course: string
  group: string
  index?: number
  dates: IDate
}

export interface IPathMap {
  [fileName: string]: {
    educationType: string
    faculty: string
    course: string
    fileName: string
  }
}

export interface IUnparsedJson {
  [sheetName: string]: {
    [rowNumber: string]: {
      [columnLetter: string]: string | number | boolean | null
    }
  }
}
