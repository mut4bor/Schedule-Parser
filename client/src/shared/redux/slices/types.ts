export type IName = {
  _id: string
  group: string
  index: number
}
export type IGroup = {
  _id: string
  group: string
  index: number
  date: {
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
