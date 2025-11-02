import { baseApi } from '../baseApi'

export interface ITeacher {
  firstName: string
  middleName: string
  lastName: string
  title?: string
  _id: string
}

export interface CreateTeacherDTO {
  firstName: string
  middleName: string
  lastName: string
  title?: string
}

export interface UpdateTeacherDTO {
  id: string
  firstName?: string
  middleName?: string
  lastName?: string
  title?: string
}

export interface DeleteTeacherDTO {
  id: string
}

export const teachersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTeachers: builder.query<ITeacher[], string | void>({
      query: () => `/teachers`,
      providesTags: ['Teachers'],
    }),
    getTeacherById: builder.query<ITeacher, string>({
      query: (id) => `/teachers/${id}`,
      providesTags: ['Teachers'],
    }),
    createTeacher: builder.mutation<{ message: string }, CreateTeacherDTO>({
      query: (body) => ({
        url: `/teachers`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Teachers'],
    }),
    updateTeacher: builder.mutation<{ message: string }, UpdateTeacherDTO>({
      query: (body) => ({
        url: `/teachers`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Teachers'],
    }),
    deleteTeacher: builder.mutation<{ message: string }, DeleteTeacherDTO>({
      query: (body) => ({
        url: `/teachers/${body.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Teachers'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAllTeachersQuery,
  useGetTeacherByIdQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
} = teachersApi
