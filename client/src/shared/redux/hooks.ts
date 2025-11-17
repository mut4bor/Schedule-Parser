import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from './store'
import { useMemo } from 'react'
import { useSubscribeToLocksQuery, useUpdateLocksMutation } from '@/shared/redux/slices/api/wsApi'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

type ResourseType = 'classroom' | 'teacher' | 'group'

export function useResourceLocks() {
  const { data: lockedResources } = useSubscribeToLocksQuery()
  const [updateLocks] = useUpdateLocksMutation()

  const isResourceLocked = useMemo(
    () => (type: ResourseType, id: string) => {
      if (!lockedResources) return false

      switch (type) {
        case 'classroom':
          return lockedResources.classroomsIDs.includes(id)
        case 'teacher':
          return lockedResources.teachersIDs.includes(id)
        case 'group':
          return lockedResources.groupsIDs.includes(id)
        default:
          return false
      }
    },
    [lockedResources],
  )

  const lockResource = async (type: ResourseType, id: string) => {
    const currentLocks = lockedResources || {
      classroomsIDs: [],
      teachersIDs: [],
      groupsIDs: [],
    }

    const newLocks = { ...currentLocks }

    switch (type) {
      case 'classroom':
        if (!newLocks.classroomsIDs.includes(id)) {
          newLocks.classroomsIDs = [...newLocks.classroomsIDs, id]
        }
        break
      case 'teacher':
        if (!newLocks.teachersIDs.includes(id)) {
          newLocks.teachersIDs = [...newLocks.teachersIDs, id]
        }
        break
      case 'group':
        if (!newLocks.groupsIDs.includes(id)) {
          newLocks.groupsIDs = [...newLocks.groupsIDs, id]
        }
        break
    }

    await updateLocks(newLocks)
  }

  const unlockResource = async (type: ResourseType, id: string) => {
    const currentLocks = lockedResources || {
      classroomsIDs: [],
      teachersIDs: [],
      groupsIDs: [],
    }

    const newLocks = { ...currentLocks }

    switch (type) {
      case 'classroom':
        newLocks.classroomsIDs = newLocks.classroomsIDs.filter((lockId) => lockId !== id)
        break
      case 'teacher':
        newLocks.teachersIDs = newLocks.teachersIDs.filter((lockId) => lockId !== id)
        break
      case 'group':
        newLocks.groupsIDs = newLocks.groupsIDs.filter((lockId) => lockId !== id)
        break
    }

    await updateLocks(newLocks)
  }

  const unlockAll = async () => {
    await updateLocks({
      classroomsIDs: [],
      teachersIDs: [],
      groupsIDs: [],
    })
  }

  return {
    lockedResources: lockedResources || {
      classroomsIDs: [],
      teachersIDs: [],
      groupsIDs: [],
    },
    isResourceLocked,
    lockResource,
    unlockResource,
    unlockAll,
  }
}
