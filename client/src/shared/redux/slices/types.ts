export interface IName {
  index: number
  _id: string
  educationType: string
  faculty: string
  course: string
  group: string
  createdAt: string
  updatedAt: string
  __v: number
}

interface ISchedule {
  [week: string]: {
    [day: string]: {
      [time: string]: string
    }
  }
}

export interface IGroup extends IName {
  dates: ISchedule
}
