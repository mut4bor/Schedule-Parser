export interface IName {
  _id: string
  group: string
  index: number
}
export interface IGroup {
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
