import { baseApi } from '@/shared/redux/slices/baseApi'

interface WSConnection {
  classroomsIDs: string[]
  teachersIDs: string[]
  groupsIDs: string[]
}

interface WSMessage {
  type: 'update' | 'sync'
  data: WSConnection
}

export const wsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    subscribeToLocks: builder.query<WSConnection, void>({
      queryFn: () => ({
        data: {
          classroomsIDs: [],
          teachersIDs: [],
          groupsIDs: [],
        },
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved, getState },
      ) {
        let ws: WebSocket | null = null

        try {
          await cacheDataLoaded

          const state = getState() as any
          const token = state.auth.accessToken

          ws = new WebSocket(`ws://localhost:8080?token=${token}`)

          ws.onopen = () => {
            console.log('WebSocket connected')
          }

          ws.onmessage = (event) => {
            const message: WSMessage = JSON.parse(event.data)

            if (message.type === 'sync') {
              updateCachedData(() => message.data)
            }
          }

          ws.onerror = (error) => {
            console.error('WebSocket error:', error)
          }

          await cacheEntryRemoved
        } catch (error) {
          console.error('WebSocket subscription error:', error)
        } finally {
          ws?.close()
        }
      },
    }),

    // Отправка обновлений блокировок
    updateLocks: builder.mutation<void, WSConnection>({
      queryFn: (locks) => {
        // Получаем WebSocket из глобального состояния
        const ws = (window as any).__ws__

        if (ws?.readyState === WebSocket.OPEN) {
          ws.send(
            JSON.stringify({
              type: 'update',
              data: locks,
            }),
          )
          return { data: undefined }
        }

        return { error: { status: 'CUSTOM_ERROR', error: 'WebSocket not connected' } }
      },
    }),
  }),
  overrideExisting: false,
})

export const { useSubscribeToLocksQuery, useUpdateLocksMutation } = wsApi
