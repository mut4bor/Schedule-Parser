import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum DayIndex {
  None = -1,
  Monday = 0,
  Tuesday = 1,
  Wednesday = 2,
  Thursday = 3,
  Friday = 4,
  Saturday = 5,
  Sunday = 6,
}

interface NavigationValue {
  week: string | null
  dayIndex: DayIndex
}

const initialState: NavigationValue = {
  week: null,
  dayIndex: DayIndex.None,
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
