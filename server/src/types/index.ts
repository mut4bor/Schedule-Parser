import { Types, Document } from 'mongoose'

export interface ITeacher extends Document {
  firstName: string
  middleName: string
  lastName: string
  title: string
}

export interface IEducationType extends Document {
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface ICourse {
  courseNumber: number
  name?: string
}

export interface IFaculty extends Document {
  name: string
  educationType: Types.ObjectId
  courses: ICourse[]
  createdAt: Date
  updatedAt: Date
}

export interface IGroup extends Document {
  name: string
  educationType: Types.ObjectId
  faculty: Types.ObjectId
  course: number
  createdAt: Date
  updatedAt: Date
}

export interface ISchedule extends Document {
  group: Types.ObjectId
  teacher: Types.ObjectId
  date: Date
  time: string
  classroom: string
  subject: string
  lessonType: 'Лекция' | 'Практика' | 'Лабораторная' | 'Семинар'
  createdAt: Date
  updatedAt: Date
}
