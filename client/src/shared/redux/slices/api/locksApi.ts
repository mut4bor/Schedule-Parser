import { baseApi } from '@/shared/redux/slices/baseApi'

export interface Locks {
  classroomsIDs: string[]
  teachersIDs: string[]
  groupsIDs: string[]
}

export interface UpdateLocksDTO {
  id: string
  locks: Locks
}

export interface ClearLocksDTO {
  id: string
}

export const locksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLocks: build.query<Locks, string>({
      query: (userId) => ({
        url: `/locks?userId=${userId}`,
        method: 'GET',
      }),
      providesTags: ['Locks'],
    }),
    updateLocks: build.mutation<void, UpdateLocksDTO>({
      query: ({ id, ...body }) => ({
        url: `/locks/${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Locks'],
    }),
    clearLocks: build.mutation<void, ClearLocksDTO>({
      query: ({ id }) => ({
        url: `/locks/${id}/clear`,
        method: 'POST',
      }),
      invalidatesTags: ['Locks'],
    }),
  }),
  overrideExisting: false,
})

export const { useGetLocksQuery, useUpdateLocksMutation, useClearLocksMutation } = locksApi
