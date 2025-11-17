import WebSocket from 'ws'

export interface WSConnection {
  classroomsIDs: string[]
  teachersIDs: string[]
  groupsIDs: string[]
}

export interface WSMessage {
  type: 'update' | 'sync'
  data: WSConnection
}

export interface AggregatedLocks {
  classroomsIDs: Set<string>
  teachersIDs: Set<string>
  groupsIDs: Set<string>
}

export interface ClientConnection {
  userId: string
  ws: WebSocket
  locks: WSConnection
}
