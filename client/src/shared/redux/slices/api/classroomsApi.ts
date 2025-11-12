import baseApi from '../baseApi'

export interface Classroom {
  _id: string
  name: string
  capacity: number
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateClassroomDTO {
  name: string
  capacity: number
  description?: string
}

export interface UpdateClassroomDTO {
  id: string
  data: {
    name?: string
    capacity: number
    description?: string
  }
}

export interface DeleteClassroomDTO {
  id: string
}

export const classroomsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllClassrooms: builder.query<Classroom[], void>({
      query: () => '/classrooms',
      providesTags: ['Classrooms'],
    }),
    getClassroomById: builder.query<Classroom, string>({
      query: (id) => `/classrooms/${id}`,
      providesTags: ['Classrooms'],
    }),
    createClassroom: builder.mutation<Classroom, CreateClassroomDTO>({
      query: (body) => ({
        url: '/classrooms',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Classrooms'],
    }),
    updateClassroom: builder.mutation<Classroom, UpdateClassroomDTO>({
      query: ({ id, data }) => ({
        url: `/classrooms/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Classrooms'],
    }),
    deleteClassroom: builder.mutation<{ success: boolean }, DeleteClassroomDTO>({
      query: ({ id }) => ({
        url: `/classrooms/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Classrooms'],
    }),
  }),
})

export const {
  useGetAllClassroomsQuery,
  useCreateClassroomMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,
} = classroomsApi
