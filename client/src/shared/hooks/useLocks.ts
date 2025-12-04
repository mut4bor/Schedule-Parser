import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { LockedItemTuple, LockedItems, LockType, setLocked } from '@/shared/redux/slices/locksSlice'

const socket = io('http://localhost:8080')

function filterLocked(items: LockedItemTuple[], userId: string): LockedItemTuple[] {
  return items.filter(([_, meta]) => meta.lockedBy !== userId)
}

export function useLocks() {
  const dispatch = useAppDispatch()
  const userID = useAppSelector((store) => store.auth.user?.id)
  const locked = useAppSelector((store) => store.locked)

  useEffect(() => {
    if (!userID) return

    const handler = (data: LockedItems) => {
      dispatch(
        setLocked({
          groups: filterLocked(data.groups, userID),
          classrooms: filterLocked(data.classrooms, userID),
          teachers: filterLocked(data.teachers, userID),
        }),
      )
    }

    socket.on('locked_items', handler)

    return () => {
      socket.off('locked_items', handler)
    }
  }, [userID, dispatch])

  function lock(type: LockType, id: string) {
    if (!userID) return
    socket.emit('lock', { type, id, userId: userID })
  }

  function unlock(type: LockType, id: string) {
    if (!userID) return
    socket.emit('unlock', { type, id, userId: userID })
  }

  return { locked, lock, unlock }
}
