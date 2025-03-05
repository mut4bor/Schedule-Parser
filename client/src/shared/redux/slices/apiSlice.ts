import { API_URL, X_ADMIN_PASSWORD } from '@/shared/config'
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react'
import {
  IGroup,
  IName,
  IFaculties,
  ISchedule,
  IRefreshSchedule,
  ApiLogoutResponse,
  ApiLoginResponse,
  ApiLoginRequest,
  ApiChangeProfileInfoResponse,
  ApiChangeProfileInfoRequest,
  ApiGetProfileInfoResponse,
  ApiRegisterRequest,
  ApiRegisterResponse,
} from '../types'

const groupsPath = `groups`
const namesPath = `names`

const getParams = (params: string | void) => {
  return params ? `?${params}` : ''
}

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  // credentials: 'include',
  prepareHeaders: (headers) =>
    headers.set('x-admin-password', X_ADMIN_PASSWORD),
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    const route = typeof args === 'string' ? args : args.url

    if (!route?.includes('/get_profile_information')) {
      api.dispatch(apiSlice.util.invalidateTags(['fetchProfileInfo']))
    }

    return { data: null }
  }

  return result
}

const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: baseQueryWithReauth,

  tagTypes: ['fetchProfileInfo'],

  endpoints: (builder) => ({
    register: builder.mutation<ApiRegisterResponse, ApiRegisterRequest>({
      query: ({ phone_number, password }) => ({
        url: '/register',
        method: 'POST',
        body: {
          phone_number,
          password,
          status: 'user',
        },
      }),
      invalidatesTags: ['fetchProfileInfo'],
    }),

    login: builder.mutation<ApiLoginResponse, ApiLoginRequest>({
      query: ({ phone_number, password }) => ({
        url: '/login',
        method: 'POST',
        body: {
          phone_number,
          password,
        },
      }),
      invalidatesTags: ['fetchProfileInfo'],
    }),

    logout: builder.mutation<ApiLogoutResponse, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['fetchProfileInfo'],
    }),

    getProfileInfo: builder.query<ApiGetProfileInfoResponse, void>({
      query: () => ({
        url: '/get_profile_information',
        method: 'GET',
      }),
      providesTags: ['fetchProfileInfo'],
    }),

    changeProfileInfo: builder.mutation<
      ApiChangeProfileInfoResponse,
      ApiChangeProfileInfoRequest
    >({
      query: (profileInfo) => ({
        url: '/change_profile_information',
        method: 'POST',
        body: profileInfo,
      }),
      invalidatesTags: ['fetchProfileInfo'],
    }),

    refreshSchedule: builder.mutation<IRefreshSchedule, string>({
      query: (password) => ({
        url: `/refresh`,
        method: 'POST',

        body: { password },
      }),
    }),

    getFaculties: builder.query<IFaculties, void>({
      query: () => ({
        url: `/faculty`,
      }),
    }),

    getCourses: builder.query<string[], string>({
      query: (searchParams) => ({
        url: `/course${getParams(searchParams)}`,
      }),
    }),

    getNames: builder.query<IName[], string | void>({
      query: (searchParams) => ({
        url: `/${namesPath}${getParams(searchParams)}`,
      }),
    }),

    getGroupNamesThatMatchWithReqParams: builder.query<IName[], string>({
      query: (searchParams) => ({
        url: `/${namesPath}/search${getParams(searchParams)}`,
      }),
    }),

    getGroupByID: builder.query<IGroup, string>({
      query: (groupID) => ({
        url: `/${groupsPath}/${groupID}`,
      }),
    }),

    getWeeksByID: builder.query<string[], string>({
      query: (groupID) => ({
        url: `/${groupsPath}/${groupID}/weeks`,
      }),
    }),
    getWeekScheduleByID: builder.query<
      ISchedule,
      { groupID: string; week: string }
    >({
      query: ({ groupID, week }) => ({
        url: `/${groupsPath}/${groupID}/weeks/${week}`,
      }),
    }),
  }),
})

export const {
  useRefreshScheduleMutation,
  useGetFacultiesQuery,
  useGetCoursesQuery,
  useGetNamesQuery,
  useGetGroupNamesThatMatchWithReqParamsQuery,
  useGetGroupByIDQuery,
  useGetWeeksByIDQuery,
  useGetWeekScheduleByIDQuery,
} = apiSlice

export default apiSlice
