export interface IRefreshSchedule {
  message: string
}

export interface IName {
  group: string
  _id: string
}

export interface IGroup extends IName {
  educationType: string
  faculty: string
  course: string
  createdAt: string
  updatedAt: string
  __v: number
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
  classroom: string
  teacher: ITeacher
  subject: string
  lessonType: string
}

export interface IWeek {
  [day: string]: {
    [time: string]: ILesson
  }
}

export interface ISchedule {
  [week: string]: IWeek
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
export interface AddWeekDTO {
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

// DTO для обновления/добавления урока
export interface UpdateLessonDTO {
  id: string
  weekName: string
  day: string
  time: string
  newTime?: string
  classroom: string
  teacher: {
    firstName: string
    middleName?: string
    lastName: string
    title?: string
  }
  subject: string
  lessonType: string
}

// DTO для удаления урока
export interface DeleteLessonDTO {
  id: string
  weekName: string
  day: string
  time: string
}
