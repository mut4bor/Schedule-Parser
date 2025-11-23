import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

type LockType = 'groups' | 'classrooms' | 'teachers'

const socket = io('http://localhost:8080')

type LockedItemTuple = [
  itemId: string,
  {
    lockedBy: string
    expiresAt: Date
  },
]

interface LockedItems {
  groups: LockedItemTuple[]
  classrooms: LockedItemTuple[]
  teachers: LockedItemTuple[]
}

function filterLocked(items: LockedItemTuple[], userId: string): LockedItemTuple[] {
  return items.filter(([_, meta]) => meta.lockedBy !== userId)
}

export function useLocks(userID?: string) {
  const [locked, setLocked] = useState<LockedItems>({
    groups: [],
    classrooms: [],
    teachers: [],
  })

  useEffect(() => {
    if (!userID) return

    const handler = (data: LockedItems) => {
      setLocked({
        groups: filterLocked(data.groups, userID),
        classrooms: filterLocked(data.classrooms, userID),
        teachers: filterLocked(data.teachers, userID),
      })
    }

    socket.on('locked_items', handler)

    return () => {
      socket.off('locked_items', handler)
    }
  }, [userID])

  function lock(type: LockType, id: string, userId: string) {
    socket.emit('lock', { type, id, userId })
  }

  function unlock(type: LockType, id: string, userId: string) {
    socket.emit('unlock', { type, id, userId })
  }

  return { locked, lock, unlock }
}
