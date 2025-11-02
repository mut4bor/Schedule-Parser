import { ITeacher } from '@/database/models/teacher.model.js'
import { Document, ObjectId } from 'mongoose'

export type ILesson = {
  time: string
  classroom: string
  teacher: ITeacher['_id']
  subject: string
  lessonType: string
  _id?: ObjectId
} | null

export type IDay = ILesson[]
export type IWeek = IDay[]

export type ISchedule = Map<string, IWeek>

export interface IGroup extends Document {
  educationType: string | null
  faculty: string | null
  course: string | null
  groupName: string | null
  dates: ISchedule
}

export interface User {
  id: string
  email: string
  password: string
  role: 'admin' | 'user'
}

export interface JwtPayload {
  userId: string
  email: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}
