import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { jwtDecode } from 'jwt-decode'

export type JwtPayload = {
  id: string
  username: string
  role: string
  exp: number
  iat: number
}

export function decodeAccessToken(token: string | null) {
  if (!token) return null
  try {
    const payload = jwtDecode<JwtPayload>(token)
    return {
      id: payload.id,
      username: payload.username,
      role: payload.role,
    }
  } catch {
    return null
  }
}

export interface User {
  id: string
  username: string
  role: string
}

interface AuthState {
  accessToken: string | null
  user: User | null
}

const storedToken = localStorage.getItem('accessToken')

const initialState: AuthState = {
  accessToken: storedToken,
  user: decodeAccessToken(storedToken),
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload
      localStorage.setItem('accessToken', action.payload)

      const user = decodeAccessToken(action.payload)
      state.user = user
    },
    logout: (state) => {
      state.accessToken = null
      state.user = null
      localStorage.removeItem('accessToken')
    },
  },
})

export const { setAccessToken, logout } = authSlice.actions
export default authSlice
