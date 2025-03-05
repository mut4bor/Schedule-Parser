import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const loginSlice = createSlice({
  name: 'login',

  initialState: {
    isLoginModalOpened: false,
  },

  reducers: {
    loginValueChanged(state, action: PayloadAction<boolean>) {
      state.isLoginModalOpened = action.payload
    },
  },
})
export const { loginValueChanged } = loginSlice.actions
export default loginSlice.reducer
