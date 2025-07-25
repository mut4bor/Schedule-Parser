// types/database.ts

export interface User {
  id: number
  username: string
  password_hash: string
  role: string
  created_at: Date
}

export interface EducationType {
  id: number
  name: string
}

export interface Teacher {
  id: number
  first_name: string
  surname: string
  patronymic: string
  created_at: Date
}

export interface Group {
  id: number
  name: string
  course: number
  education_type_id: number
  created_at: Date
  education_type?: EducationType
}

export interface Schedule {
  id: number
  group_id: number
  schedule_date: string // YYYY-MM-DD
  created_at: Date
  updated_at: Date
  group?: Group
  lessons?: Lesson[]
}

export interface Lesson {
  id: number
  schedule_id: number
  start_time: string // HH:MM
  end_time: string // HH:MM
  subject_name: string
  classroom: string
  teacher_id: number | null
  created_at: Date
  teacher?: Teacher
}

// DTO типы для API
export interface CreateTeacherDto {
  first_name: string
  surname: string
  patronymic: string
}

export interface CreateGroupDto {
  name: string
  course: number
  education_type_id: number
}

export interface CreateScheduleDto {
  group_id: number
  schedule_date: string
  lessons: CreateLessonDto[]
}

export interface CreateLessonDto {
  start_time: string
  end_time: string
  subject_name: string
  classroom: string
  teacher_id: number | null
}

export interface AuthDto {
  username: string
  password: string
}
