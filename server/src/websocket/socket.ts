import { Server } from 'socket.io'
import { lockItem, unlockItem, getAllLocks } from './lockService.js'

export function initSocket(httpServer: any) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  })

  io.on('connection', (socket) => {
    socket.emit('locked_items', getAllLocks())

    socket.on('lock', ({ type, id, userId }) => {
      const res = lockItem(type, id, userId)
      if (res.ok) {
        io.emit('locked_items', getAllLocks())
      } else {
        socket.emit('lock_denied', {
          type,
          id,
          lockedBy: res.lockedBy,
        })
      }
    })

    socket.on('unlock', ({ type, id, userId }) => {
      unlockItem(type, id, userId)
      io.emit('locked_items', getAllLocks())
    })
  })
}
