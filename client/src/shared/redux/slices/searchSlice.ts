import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const searchSlice = createSlice({
  name: 'search',

  initialState: {
    inputIsFocused: false,
    searchValue: '',
  },

  reducers: {
    inputIsFocusedChanged(state, action: PayloadAction<boolean>) {
      state.inputIsFocused = action.payload
    },
    searchValueChanged(state, action: PayloadAction<string>) {
      state.searchValue = action.payload
    },
  },
})
export const { inputIsFocusedChanged, searchValueChanged } = searchSlice.actions
export default searchSlice.reducer
