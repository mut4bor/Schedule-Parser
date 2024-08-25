export interface IName {
  group: string
  _id: string
  index: number
}

export interface IGroup extends IName {
  educationType: string
  faculty: string
  course: string
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
