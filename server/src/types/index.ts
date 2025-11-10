export interface ITeacher {
  firstName: string
  middleName: string
  lastName: string
  title?: string
  _id: string
}

export enum LessonType {
  Lecture = 'Лекция',
  Practice = 'Практика',
  Laboratory = 'Лабораторная',
  Seminar = 'Семинар',
}

export enum DayOfWeek {
  None = -1,
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
}

export const TimeSlots = ['09:45', '11:30', '13:30', '15:15', '17:00']

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
