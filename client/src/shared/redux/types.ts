import { ITeacher } from './slices/api/teachersApi'

export interface IName {
  groupName: string
  _id: string
}

export type ILesson = {
  time: string
  classroom: string
  teacher: ITeacher
  subject: string
  lessonType: string
  _id: string
}

export type IDay = ILesson[]
export type IWeek = IDay[]
export type ISchedule = { [key: string]: IWeek }

export interface IGroup {
  educationType: string
  faculty: string
  course: string
  groupName: string
  dates: ISchedule
  createdAt: string
  updatedAt: string
  __v: number
  _id: string
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

// --- Groups ---
export interface CreateGroupDTO {
  educationType: string
  faculty: string
  course: string
  groupName: string
}

export interface UpdateGroupDTO {
  educationType?: string
  faculty?: string
  course?: string
  groupName?: string
}

// --- Weeks ---
export interface CreateWeekDTO {
  id: string
  weekName: string
}

export interface UpdateWeekDTO {
  id: string
  oldWeekName: string
  newWeekName: string
}

export interface DeleteWeekDTO {
  id: string
  weekName: string
}

export interface CreateLessonDTO {
  id: string
  weekName: string
  dayIndex: number
  time: string
  classroom: string
  teacherID: ITeacher['_id']
  subject: string
  lessonType: string
}

export interface UpdateLessonDTO {
  id: string
  weekName: string
  dayIndex: number
  lessonId: string
  time?: string
  classroom?: string
  teacherID?: ITeacher['_id']
  subject?: string
  lessonType?: string
}

export interface DeleteLessonDTO {
  id: string
  weekName: string
  dayIndex: number
  lessonId: string
}
