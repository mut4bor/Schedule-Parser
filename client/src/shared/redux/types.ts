export interface IName {
  group: string
  _id: string
}

export interface IFaculties {
  [educationType: string]: string[]
}

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
  _id: string
}

export type IDay = ILesson[]
export type IWeek = IDay[]
export type ISchedule = { [key: string]: IWeek }

export interface IGroup {
  educationType: string
  faculty: string
  course: string
  group: string
  dates: ISchedule
  createdAt: string
  updatedAt: string
  __v: number
  _id: string
}

export interface IGroupsSchedule {
  weekName: 'even' | 'odd' | string
  dates: {
    time: string // ключ = время пары
    lessons: {
      groupName: string
      groupID: string
      lesson: ILesson
    }[]
  }[][]
}

// --- Education Types ---
export interface CreateEducationTypeDTO {
  educationType: string
}

export interface UpdateEducationTypeDTO {
  oldEducationType: string
  newEducationType: string
}

// --- Faculties ---
export interface CreateFacultyDTO {
  educationType: string
  faculty: string
}

export interface UpdateFacultyDTO {
  educationType: string
  oldFaculty: string
  newFaculty: string
}

export interface DeleteFacultyDTO {
  educationType: string
  faculty: string
}

// --- Courses ---
export interface CreateCourseDTO {
  educationType: string
  faculty: string
  course: string
}

export interface UpdateCourseDTO {
  educationType: string
  faculty: string
  oldCourse: string
  newCourse: string
}

export interface DeleteCourseDTO {
  educationType: string
  faculty: string
  course: string
}

// --- Groups ---
export interface CreateGroupDTO {
  educationType: string
  faculty: string
  course: string
  group: string
}

export interface UpdateGroupDTO {
  educationType?: string
  faculty?: string
  course?: string
  group?: string
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
}

export interface UpdateLessonDTO {
  id: string
  weekName: string
  dayIndex: number
  lessonId: string
  time?: string
  classroom?: string
  teacher?: ITeacher
  subject?: string
  lessonType?: string
}

export interface DeleteLessonDTO {
  id: string
  weekName: string
  dayIndex: number
  lessonId: string
}
