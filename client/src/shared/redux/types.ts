import { ITeacher } from '@/shared/redux/slices/api/teachersApi'
import { LessonType } from './slices/api/scheduleApi'

export enum DayOfWeek {
  None = -1,
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
}

export interface ILesson {
  time: string
  classroom: string
  subject: string
  teacher: ITeacher
  lessonType: LessonType
}

export interface IDay {
  dayOfWeek: DayOfWeek
  lessons: ILesson[]
}

export interface ISchedule {
  _id: string
  weekName: string
  isActive: boolean
  group: string
  days: IDay[]
  createdAt?: string
  updatedAt?: string
}

export interface IGroupsSchedule {
  groups: { id: string; name: string }[]
  weeks: {
    weekName: string
    days: {
      dayName: string
      dayIndex: number
      timeSlots: {
        time: string
        lessons: (ILesson | null)[]
      }[]
    }[]
  }[]
}
