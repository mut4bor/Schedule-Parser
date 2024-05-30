import { createSlice } from '@reduxjs/toolkit'

const searchSlice = createSlice({
  name: 'search',

  initialState: {
    searchValue: '',
  },

  reducers: {
    searchValueChanged(state, action) {
      state.searchValue = action.payload
    },
  },
})
export const { searchValueChanged } = searchSlice.actions
export default searchSlice.reducer
