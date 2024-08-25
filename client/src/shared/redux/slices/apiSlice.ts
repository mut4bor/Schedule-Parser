import { API_URL, X_ADMIN_PASSWORD } from '@/shared/config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { IGroup, IName, IFaculties, IDays, ISchedule } from '../types'

const groupsPath = `/groups`
const namesPath = `/names`
const educationTypePath = `/educationType`
const getParams = (params: string | void) => {
  return params ? `?${params}` : ''
}

const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: API_URL,
  }),

  endpoints: (builder) => ({
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

    getGroupNamesThatMatchWithReqParams: builder.query<IName[], string>({
      query: (searchParams) => ({
        url: `${namesPath}/search${getParams(searchParams)}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),

    getGroupByID: builder.query<IGroup, string>({
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
    getWeekScheduleByID: builder.query<
      ISchedule,
      { groupID: string; week: string }
    >({
      query: ({ groupID, week }) => ({
        url: `${groupsPath}/${groupID}/weeks/${week}`,
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
      }),
    }),
  }),
})

export const {
  useGetFacultiesQuery,
  useGetCoursesQuery,
  useGetNamesQuery,
  useGetGroupNamesThatMatchWithReqParamsQuery,
  useGetGroupByIDQuery,
  useGetWeeksByIDQuery,
  useGetWeekScheduleByIDQuery,
} = api

export default api
