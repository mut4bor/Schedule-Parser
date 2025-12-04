import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import { RootState } from '@/shared/redux/store'
import { env } from '@/shared/config'
import { logout, setAccessToken } from '@/shared/redux/slices/authSlice'

const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken
    if (token) headers.set('authorization', `Bearer ${token}`)
    return headers
  },
})

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    const refreshResult = await rawBaseQuery({ url: '/refresh', method: 'POST' }, api, extraOptions)

    if (refreshResult.data) {
      const accessToken = (refreshResult.data as any).accessToken
      api.dispatch(setAccessToken(accessToken))
      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }

  return result
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    'EducationTypes',
    'Faculties',
    'Courses',
    'Groups',
    'Names',
    'Weeks',
    'Schedule',
    'GroupsSchedule',
    'Teachers',
    'Classrooms',
    'AdminUsers',
    'Locks',
  ],
  endpoints: () => ({}),
})

export default baseApi
