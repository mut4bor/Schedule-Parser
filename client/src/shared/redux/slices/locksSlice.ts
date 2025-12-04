import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type LockType = 'groups' | 'classrooms' | 'teachers'

export type LockedItemTuple = [
  itemId: string,
  {
    lockedBy: string
    expiresAt: Date
  },
]

export interface LockedItems {
  groups: LockedItemTuple[]
  classrooms: LockedItemTuple[]
  teachers: LockedItemTuple[]
}

const initialState: LockedItems = {
  groups: [],
  classrooms: [],
  teachers: [],
}

const lockedSlice = createSlice({
  name: 'locked',
  initialState,
  reducers: {
    setLocked(state, action: PayloadAction<LockedItems>) {
      state.groups = action.payload.groups
      state.classrooms = action.payload.classrooms
      state.teachers = action.payload.teachers
    },
    clearLocked(state) {
      state.groups = []
      state.classrooms = []
      state.teachers = []
    },
  },
})

export const { setLocked, clearLocked } = lockedSlice.actions
export default lockedSlice
