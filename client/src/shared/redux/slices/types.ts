export type IName = {
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

export type IGroup = {
  index: number
  _id: string
  educationType: string
  faculty: string
  course: string
  group: string
  dates: {
    [week: string]: {
      [day: string]: {
        [time: string]: string
      }
    }
  }
  createdAt: string
  updatedAt: string
  __v: number
}
