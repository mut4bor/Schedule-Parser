import { baseApi } from '../baseApi'
import { EducationType } from './educationTypesApi'

export interface Facultie {
  _id: string
  name: string
  educationType: EducationType
}

export interface CreateFacultyDTO {
  name: string
  educationType: string
}

export interface UpdateFacultyDTO {
  id: string
  name: string
}

export interface DeleteFacultyDTO {
  id: string
}

export const facultiesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaculties: builder.query<Facultie[], string | void>({
      query: (educationType) => `/faculty${educationType ? `?educationType=${educationType}` : ''}`,
      providesTags: ['Faculties'],
    }),
    createFaculty: builder.mutation<{ message: string }, CreateFacultyDTO>({
      query: (body) => ({
        url: `/faculty`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Faculties', 'Courses', 'Groups', 'Names'],
    }),
    updateFaculty: builder.mutation<{ message: string }, UpdateFacultyDTO>({
      query: ({ id, name }) => ({
        url: `/faculty/${id}`,
        method: 'PUT',
        body: { name },
      }),
      invalidatesTags: ['Faculties', 'Courses', 'Groups', 'Names'],
    }),
    deleteFaculty: builder.mutation<{ message: string }, DeleteFacultyDTO>({
      query: ({ id }) => ({
        url: `/faculty/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Faculties', 'Courses', 'Groups', 'Names'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetFacultiesQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
} = facultiesApi
