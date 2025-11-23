type LockType = 'groups' | 'classrooms' | 'teachers'

interface LockData {
  lockedBy: string
  expiresAt: number
}

const LOCK_TTL = 1000 * 60 * 60 * 12 // 12 часов

const locks = {
  groups: new Map<string, LockData>(),
  classrooms: new Map<string, LockData>(),
  teachers: new Map<string, LockData>(),
}

export function lockItem(type: LockType, id: string, userId: string) {
  const now = Date.now()
  const store = locks[type]
  const existing = store.get(id)

  if (existing && existing.expiresAt > now && existing.lockedBy !== userId) {
    return { ok: false, lockedBy: existing.lockedBy }
  }

  store.set(id, { lockedBy: userId, expiresAt: now + LOCK_TTL })
  return { ok: true }
}

export function unlockItem(type: LockType, id: string, userId: string) {
  const store = locks[type]
  const existing = store.get(id)
  if (existing && existing.lockedBy === userId) {
    store.delete(id)
  }
}

export function getAllLocks() {
  return {
    groups: Array.from(locks.groups.entries()),
    classrooms: Array.from(locks.classrooms.entries()),
    teachers: Array.from(locks.teachers.entries()),
  }
}
