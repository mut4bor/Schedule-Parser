import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const searchSlice = createSlice({
  name: 'search',

  initialState: {
    isSearchInputFocused: false,
    searchValue: '',
  },

  reducers: {
    isSearchInputFocusedChanged(state, action: PayloadAction<boolean>) {
      state.isSearchInputFocused = action.payload
    },
    searchValueChanged(state, action: PayloadAction<string>) {
      state.searchValue = action.payload
    },
  },
})
export const { isSearchInputFocusedChanged, searchValueChanged } =
  searchSlice.actions
export default searchSlice.reducer
