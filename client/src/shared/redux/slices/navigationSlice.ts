import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum DayIndex {
  None = -1,
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

interface NavigationValue {
  educationType: string | null
  faculty: string | null
  course: string | null
  week: string | null
  dayIndex: DayIndex
}

const initialState: NavigationValue = {
  educationType: null,
  faculty: null,
  course: null,
  week: null,
  dayIndex: -1,
}

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    educationTypeChanged(state, action: PayloadAction<string | null>) {
      state.educationType = action.payload
    },
    facultyChanged(state, action: PayloadAction<string | null>) {
      state.faculty = action.payload
    },
    courseChanged(state, action: PayloadAction<string | null>) {
      state.course = action.payload
    },
    weekChanged(state, action: PayloadAction<string | null>) {
      state.week = action.payload
    },
    dayIndexChanged(state, action: PayloadAction<DayIndex>) {
      state.dayIndex = action.payload
    },
  },
})

export const {
  educationTypeChanged,
  facultyChanged,
  courseChanged,
  weekChanged,
  dayIndexChanged,
} = navigationSlice.actions

export default navigationSlice.reducer
