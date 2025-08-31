import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum DayIndex {
  None = -1,
  Sunday = 0,
  Monday = 1,
  Tuesday = 2,
  Wednesday = 3,
  Thursday = 4,
  Friday = 5,
  Saturday = 6,
}

interface NavigationValue {
  week: string | null
  dayIndex: DayIndex
}

const initialState: NavigationValue = {
  week: null,
  dayIndex: -1,
}

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    weekChanged(state, action: PayloadAction<string | null>) {
      state.week = action.payload
    },
    dayIndexChanged(state, action: PayloadAction<DayIndex>) {
      state.dayIndex = action.payload
    },
  },
})

export const { weekChanged, dayIndexChanged } = navigationSlice.actions

export default navigationSlice.reducer
