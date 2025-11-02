import { baseApi } from '../baseApi'
import { IGroup, CreateCourseDTO, UpdateCourseDTO, DeleteCourseDTO } from '@/shared/redux/types'

const getParams = (params?: string) => (params ? `?${params}` : '')

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<string[], string | void>({
      query: (searchParams) => `/course${getParams(searchParams ?? '')}`,
      providesTags: ['Courses'],
    }),
    createCourse: builder.mutation<IGroup, CreateCourseDTO>({
      query: (body) => ({
        url: `/course`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Courses', 'Groups', 'Names'],
    }),
    updateCourse: builder.mutation<{ message: string; modifiedCount: number }, UpdateCourseDTO>({
      query: (body) => ({
        url: `/course`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Courses', 'Groups', 'Names'],
    }),
    deleteCourse: builder.mutation<{ message: string; deletedCount: number }, DeleteCourseDTO>({
      query: ({ educationType, faculty, course }) => ({
        url: `/course/${educationType}/${faculty}/${course}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courses', 'Groups', 'Names'],
    }),
    getGroupsByCourse: builder.query<IGroup[], string>({
      query: (course) => `/course/${course}/groups`,
      providesTags: ['Groups'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetGroupsByCourseQuery,
} = coursesApi
