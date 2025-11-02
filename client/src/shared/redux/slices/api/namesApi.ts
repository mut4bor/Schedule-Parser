import { baseApi } from '../baseApi'
import { IName } from '@/shared/redux/types'

const getParams = (params?: string) => (params ? `?${params}` : '')

export const namesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroupNames: builder.query<IName[], string | void>({
      query: (searchParams) => `/names${getParams(searchParams ?? '')}`,
      providesTags: ['Names'],
    }),
    getGroupNamesThatMatchWithReqParams: builder.query<IName[], string>({
      query: (searchParams) => `/names/search${getParams(searchParams)}`,
      providesTags: ['Names'],
    }),
  }),
  overrideExisting: false,
})

export const { useGetGroupNamesQuery, useGetGroupNamesThatMatchWithReqParamsQuery } = namesApi
