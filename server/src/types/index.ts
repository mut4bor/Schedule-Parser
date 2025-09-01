import { Document } from 'mongoose'

export interface ITeacher {
  firstName: string
  middleName?: string
  lastName: string
  title?: string
}

export interface ILesson {
  classroom: string
  teacher: ITeacher
  subject: string
  lessonType: string
}

export interface IDay {
  [time: string]: ILesson
}

export type ISchedule = Map<string, IDay[]>

export interface IGroup extends Document {
  educationType: string
  faculty: string
  course: string
  group: string
  dates: ISchedule
}
