import { createSlice } from '@reduxjs/toolkit'

const navigationSlice = createSlice({
  name: 'navigation',

  initialState: {
    navigationValue: {
      educationType: '',
      faculty: '',
      course: '',
      groupID: '',
      week: '',
      dayIndex: -1,
    },
  },

  reducers: {
    educationTypeChanged(state, action) {
      state.navigationValue.educationType = action.payload
    },
    facultyChanged(state, action) {
      state.navigationValue.faculty = action.payload
    },
    courseChanged(state, action) {
      state.navigationValue.course = action.payload
    },
    groupIDChanged(state, action) {
      state.navigationValue.groupID = action.payload
    },
    weekChanged(state, action) {
      state.navigationValue.week = action.payload
    },
    dayIndexChanged(state, action) {
      state.navigationValue.dayIndex = action.payload
    },
  },
})
export const {
  educationTypeChanged,
  facultyChanged,
  courseChanged,
  groupIDChanged,
  weekChanged,
  dayIndexChanged,
} = navigationSlice.actions
export default navigationSlice.reducer
