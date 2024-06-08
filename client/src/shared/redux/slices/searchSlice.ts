import { createSlice } from '@reduxjs/toolkit'

const searchSlice = createSlice({
  name: 'search',

  initialState: {
    inputState: {
      value: '',
      focused: false,
    },
    searchValue: '',
  },

  reducers: {
    inputStateChanged(state, action) {
      state.inputState = action.payload
    },
    searchValueChanged(state, action) {
      state.searchValue = action.payload
    },
  },
})
export const { inputStateChanged, searchValueChanged } = searchSlice.actions
export default searchSlice.reducer
