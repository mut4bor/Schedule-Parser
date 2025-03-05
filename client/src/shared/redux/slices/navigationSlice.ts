import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type dayIndexType = -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6

interface NavigationValue {
  educationType: string | null
  faculty: string | null
  course: string | null
  week: string | null
  dayIndex: number
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
    dayIndexChanged(state, action: PayloadAction<number>) {
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
