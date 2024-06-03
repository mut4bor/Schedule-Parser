import { createSlice } from '@reduxjs/toolkit'

const routerSlice = createSlice({
  name: 'router',

  initialState: {
    routerValue: {
      educationType: '',
      faculty: '',
      course: '',
    },
  },

  reducers: {
    routerValueChanged(state, action) {
      state.routerValue = action.payload
    },
  },
})
export const { routerValueChanged } = routerSlice.actions
export default routerSlice.reducer
