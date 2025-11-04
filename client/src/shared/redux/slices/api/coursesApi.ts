import { baseApi } from '../baseApi'

const getParams = (params?: string) => (params ? `?${params}` : '')

export interface Course {
  name: string
  educationType: string
  faculty: string
  _id: string
}

export interface CreateCourseDTO {
  name: string
  facultyId: string
}

export interface UpdateCourseDTO {
  id: string
  name: string
  facultyId: string
}

export interface DeleteCourseDTO {
  id: string
}

export const coursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<Course[], string | void>({
      query: (searchParams) => `/course${getParams(searchParams ?? '')}`,
      providesTags: ['Courses'],
    }),
    createCourse: builder.mutation<{ message: string }, CreateCourseDTO>({
      query: (body) => ({
        url: `/course`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Courses', 'Groups', 'Names'],
    }),
    updateCourse: builder.mutation<{ message: string }, UpdateCourseDTO>({
      query: ({ id, name, facultyId }) => ({
        url: `/course/${id}`,
        method: 'PUT',
        body: { name, facultyId },
      }),
      invalidatesTags: ['Courses', 'Groups', 'Names'],
    }),
    deleteCourse: builder.mutation<{ message: string }, DeleteCourseDTO>({
      query: ({ id }) => ({
        url: `/course/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courses', 'Groups', 'Names'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = coursesApi
