interface IBase {
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

export type IName = IBase

export interface IGroup extends IBase {
  dates: ISchedule
}
