import WebSocket from 'ws'
import { WSConnection, WSMessage, AggregatedLocks, ClientConnection } from '@/types/websocket.js'

export class LockManager {
  private clients: Map<string, ClientConnection> = new Map()

  addClient(userId: string, ws: WebSocket) {
    this.clients.set(userId, {
      userId,
      ws,
      locks: { classroomsIDs: [], teachersIDs: [], groupsIDs: [] },
    })
  }

  removeClient(userId: string) {
    this.clients.delete(userId)
    this.broadcastAggregatedLocks()
  }

  updateClientLocks(userId: string, locks: WSConnection) {
    const client = this.clients.get(userId)
    if (client) {
      client.locks = locks
      this.broadcastAggregatedLocks()
    }
  }

  private getAggregatedLocks(): WSConnection {
    const aggregated: AggregatedLocks = {
      classroomsIDs: new Set(),
      teachersIDs: new Set(),
      groupsIDs: new Set(),
    }

    this.clients.forEach((client) => {
      client.locks.classroomsIDs.forEach((id) => aggregated.classroomsIDs.add(id))
      client.locks.teachersIDs.forEach((id) => aggregated.teachersIDs.add(id))
      client.locks.groupsIDs.forEach((id) => aggregated.groupsIDs.add(id))
    })

    return {
      classroomsIDs: Array.from(aggregated.classroomsIDs),
      teachersIDs: Array.from(aggregated.teachersIDs),
      groupsIDs: Array.from(aggregated.groupsIDs),
    }
  }

  private broadcastAggregatedLocks() {
    const aggregated = this.getAggregatedLocks()
    const message: WSMessage = {
      type: 'sync',
      data: aggregated,
    }

    this.clients.forEach((client) => {
      if (client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message))
      }
    })
  }
}
