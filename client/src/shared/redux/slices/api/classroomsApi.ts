import { DayOfWeek } from '../../types'
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
  name?: string
  capacity: number
  description?: string
}

export interface DeleteClassroomDTO {
  id: string
}

interface ClassroomsSchedule {
  classrooms: {
    id: string
    name: string
    capacity: number
    description?: string
  }[]
  weeks: {
    weekName: 'odd' | 'even' | string
    isActive: boolean
    days: {
      dayName: string
      dayIndex: DayOfWeek
      timeSlots: {
        time: string
        lessons: (
          | {
              subject: string
              teacher: {
                _id: string
                firstName: string
                middleName: string
                lastName: string
                title: string
                createdAt: string
                updatedAt: string
                __v: number
              }
              lessonType: string
              group: {
                _id: string
                name: string
                educationType: string
                faculty: string
                course: string
                __v: number
              }
            }[]
          | null
        )[]
      }[]
    }[]
  }[]
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
    getClassroomsSchedules: builder.query<ClassroomsSchedule, string[]>({
      query: (ids) => `/classrooms/${ids.join(',')}/schedules`,
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
      query: ({ id, ...body }) => ({
        url: `/classrooms/${id}`,
        method: 'PUT',
        body,
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
  useGetClassroomByIdQuery,
  useGetClassroomsSchedulesQuery,
  useCreateClassroomMutation,
  useUpdateClassroomMutation,
  useDeleteClassroomMutation,
} = classroomsApi
