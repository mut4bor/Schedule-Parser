import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  accessToken: string | null
}

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      localStorage.setItem('accessToken', action.payload)
    },
    logout: (state) => {
      state.accessToken = null
      localStorage.removeItem('accessToken')
    },
  },
})

export const { setAccessToken, logout } = authSlice.actions
export default authSlice
