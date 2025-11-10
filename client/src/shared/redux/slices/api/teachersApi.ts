import { baseApi } from '../baseApi'

export enum TeacherTitle {
  None = 'Без степени',
  CandidateOfSciences = 'Кандидат наук',
  DoctorOfSciences = 'Доктор наук',
  Assistant = 'Ассистент',
  Lecturer = 'Преподаватель',
  SeniorLecturer = 'Старший преподаватель',
  Docent = 'Доцент',
  Professor = 'Профессор',
  HeadOfDepartment = 'Заведующий кафедрой',
}

export interface ITeacher {
  _id: string
  firstName?: string
  middleName?: string
  lastName?: string
  title?: string
}

export interface CreateTeacherDTO {
  firstName: string
  middleName: string
  lastName: string
  title: string
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
      query: ({ id, ...body }) => ({
        url: `/teachers/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Teachers'],
    }),
    deleteTeacher: builder.mutation<{ message: string }, DeleteTeacherDTO>({
      query: ({ id }) => ({
        url: `/teachers/${id}`,
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
