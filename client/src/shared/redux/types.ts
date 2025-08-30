export interface IRefreshSchedule {
  message: string
}

export interface IName {
  group: string
  _id: string
  index: number
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

export interface ISchedule {
  [week: string]: {
    [day: string]: {
      [time: string]: string
    }
  }
}

// --- Groups ---
export interface CreateGroupDTO {
  educationType: string
  faculty: string
  course: string
  group: string
  index?: number
}

export interface UpdateGroupDTO {
  educationType?: string
  faculty?: string
  course?: string
  group?: string
  index?: number
}

// --- Faculties ---
export interface UpdateFacultyDTO {
  oldFaculty: string
  newFaculty: string
}

// --- Courses ---
export interface UpdateCourseDTO {
  oldCourse: string
  newCourse: string
}

// --- Education Types ---
export interface UpdateEducationTypeDTO {
  oldEducationType: string
  newEducationType: string
}

// --- Weeks ---
export interface AddWeekDTO {
  id: string
  week: string
  weekData: ISchedule
}

export interface UpdateWeekDTO {
  id: string
  week: string
  weekData: ISchedule
}

export interface DeleteWeekDTO {
  id: string
  week: string
}
