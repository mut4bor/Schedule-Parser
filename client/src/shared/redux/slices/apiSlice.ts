import { API_URL, X_ADMIN_PASSWORD } from '@/shared/config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IName, IGroup } from './types'

const groupsPath = `/groups`
const namesPath = `/names`
const educationTypePath = `/educationType`
const getParams = (params: string | void) => {
  return `${params ? `?${params}` : ''}`
}

const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),

  endpoints: (builder) => ({
    getNames: builder.query<IName[], string | void>({
      query: (params) => ({
        url: `${namesPath}${getParams(params)}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
    getGroupByName: builder.query<IGroup, string>({
      query: (groupNumber) => ({
        url: `${namesPath}/${groupNumber}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
    getGroups: builder.query<IGroup[], void>({
      query: () => ({
        url: `${groupsPath}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
    getGroupByID: builder.query<IGroup, string>({
      query: (groupNumber) => ({
        url: `${groupsPath}/${groupNumber}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
    getEducationTypes: builder.query<string[], void>({
      query: () => ({
        url: `${educationTypePath}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
    getFaculties: builder.query<{ [educationType: string]: [faculties: string][] }, void>({
      query: (params) => ({
        url: `/faculty`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
    getCourses: builder.query<string[], string>({
      query: (params) => ({
        url: `/course${getParams(params)}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
  }),
})

export const {
  useGetNamesQuery,
  useGetGroupByNameQuery,
  useGetGroupsQuery,
  useGetGroupByIDQuery,
  useGetEducationTypesQuery,
  useGetFacultiesQuery,
  useGetCoursesQuery,
} = api

export default api
