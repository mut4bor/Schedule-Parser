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

export interface IFaculties {
  [educationType: string]: string[]
}

export interface IDays {
  [day: string]: {
    [time: string]: string
  }
}

export interface ISchedule {
  [week: string]: IDays
}

export interface IGroup extends IName {
  dates: ISchedule
}
