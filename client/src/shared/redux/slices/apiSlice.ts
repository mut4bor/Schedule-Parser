import { API_URL, X_ADMIN_PASSWORD } from '@/shared/config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IName, IGroup, IFaculties, IDays, ISchedule } from './types'

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
    getEducationTypes: builder.query<string[], void>({
      query: () => ({
        url: `${educationTypePath}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),

    getFaculties: builder.query<IFaculties, void>({
      query: () => ({
        url: `/faculty`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),

    getCourses: builder.query<string[], string>({
      query: (searchParams) => ({
        url: `/course${getParams(searchParams)}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),

    getNames: builder.query<IName[], string | void>({
      query: (searchParams) => ({
        url: `${namesPath}${getParams(searchParams)}`,
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

    getGroupByID: builder.query<IName, string>({
      query: (groupID) => ({
        url: `${groupsPath}/${groupID}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),

    getWeeksByID: builder.query<string[], string>({
      query: (groupID) => ({
        url: `${groupsPath}/${groupID}/weeks`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),

    getWeekDaysByID: builder.query<string[], { groupID: string; week: string }>({
      query: ({ groupID, week }) => ({
        url: `${groupsPath}/${groupID}/weeks/${week}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
    getScheduleByID: builder.query<ISchedule, { groupID: string; week: string; dayIndex: number }>({
      query: ({ groupID, week, dayIndex }) => ({
        url: `${groupsPath}/${groupID}/weeks/${week}/${dayIndex}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
  }),
})

export const {
  useGetEducationTypesQuery,
  useGetFacultiesQuery,
  useGetCoursesQuery,
  useGetNamesQuery,
  useGetGroupsQuery,
  useGetGroupByIDQuery,
  useGetWeeksByIDQuery,
  useGetWeekDaysByIDQuery,
  useGetScheduleByIDQuery,
} = api

export default api
