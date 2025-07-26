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
