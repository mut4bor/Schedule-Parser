import { createSlice } from '@reduxjs/toolkit'

const navigationSlice = createSlice({
  name: 'navigation',

  initialState: {
    navigationValue: {
      group: '',
      week: '',
      day: '',
    },
  },

  reducers: {
    navigationValueChanged(state, action) {
      state.navigationValue = action.payload
    },
  },
})
export const { navigationValueChanged } = navigationSlice.actions
export default navigationSlice.reducer
