import { baseApi } from '../baseApi'
import { EducationType } from '@/shared/redux/slices/api/educationTypesApi'
import { Facultie } from '@/shared/redux/slices/api/facultiesApi'
import { Course } from '@/shared/redux/slices/api/coursesApi'

const getParams = (params?: string) => (params ? `?${params}` : '')

export interface IName {
  name: string
  educationType: Pick<EducationType, '_id' | 'name'>
  faculty: Pick<Facultie, '_id' | 'name'>
  course: Pick<Course, '_id' | 'name'>
  _id: string
}

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
