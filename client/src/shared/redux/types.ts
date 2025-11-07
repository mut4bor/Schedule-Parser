import { ITeacher } from '@/shared/redux/slices/api/teachersApi'

export interface IWeek {
  _id: string
  weekNumber: number
  startDate: string
  endDate: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ILesson {
  _id: string
  week: string | IWeek
  group: string
  teacher: ITeacher
  dayOfWeek: number
  time: string
  classroom: string
  subject: string
  lessonType: 'Лекция' | 'Практика' | 'Лабораторная' | 'Семинар'
  createdAt: string
  updatedAt: string
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
