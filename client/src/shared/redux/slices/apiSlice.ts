import { API_URL, X_ADMIN_PASSWORD } from '@/shared/config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IName, IGroup } from './types'

const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),

  endpoints: (builder) => ({
    getNames: builder.query<IName[], void>({
      query: () => ({
        url: '/names',
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
    getGroupByName: builder.query<IGroup, string>({
      query: (groupNumber) => ({
        url: `/names/${groupNumber}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
    getGroups: builder.query<IGroup[], void>({
      query: () => ({
        url: '/groups',
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
    getGroupByID: builder.query<IGroup, string>({
      query: (groupNumber) => ({
        url: `/groups/${groupNumber}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
  }),
})

export const { useGetNamesQuery, useGetGroupByNameQuery, useGetGroupsQuery, useGetGroupByIDQuery } = api

export default api
