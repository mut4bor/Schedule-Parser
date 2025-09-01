import { Document, ObjectId } from 'mongoose'

export interface ITeacher {
  firstName: string
  middleName: string
  lastName: string
  title?: string
}

export interface ILesson {
  time: string
  classroom: string
  teacher: ITeacher
  subject: string
  lessonType: string
  _id?: ObjectId
}

export type IDay = ILesson[]
export type IWeek = IDay[]

export type ISchedule = Map<string, IWeek>

export interface IGroup extends Document {
  educationType: string
  faculty: string
  course: string
  group: string
  dates: ISchedule
}
