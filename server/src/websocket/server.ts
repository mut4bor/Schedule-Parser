import jwt, { JwtPayload } from 'jsonwebtoken'
import WebSocket, { WebSocketServer } from 'ws'
import { IncomingMessage, Server } from 'http'
import { parse } from 'url'
import { LockManager } from './lockManager.js'
import { WSMessage } from '@/types/websocket.js'
import { env } from '@/config/index.js'
import { User } from '@/database/models/user.model.js'

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ noServer: true })
  const lockManager = new LockManager()

  server.on('upgrade', async (request, socket, head) => {
    try {
      const userId = await authenticateWebSocket(request)

      if (!userId) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        socket.destroy()
        return
      }

      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request, userId)
      })
    } catch (error) {
      socket.destroy()
    }
  })

  wss.on('connection', (ws: WebSocket, _: any, userId: string) => {
    lockManager.addClient(userId, ws)

    ws.on('message', (data: Buffer) => {
      try {
        const message: WSMessage = JSON.parse(data.toString())

        if (message.type === 'update' && message.data) {
          lockManager.updateClientLocks(userId, message.data)
        }
      } catch (error) {
        console.error('Error processing message:', error)
      }
    })

    ws.on('close', () => {
      lockManager.removeClient(userId)
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
      lockManager.removeClient(userId)
    })
  })

  return wss
}

async function authenticateWebSocket(request: IncomingMessage): Promise<string | null> {
  const { query } = parse(request.url || '', true)
  const token = query.token as string | undefined
  if (!token) return null

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload

    const user = await User.findById(decoded.id).select('username role isApproved isActive')

    if (!user || !user.isActive || !user.isApproved || !['superadmin', 'admin'].includes(user.role)) {
      return null
    }

    return user.id
  } catch {
    return null
  }
}
