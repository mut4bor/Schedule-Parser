import { baseApi } from '../baseApi'

export type LessonType = 'Лекция' | 'Практика' | 'Лабораторная' | 'Семинар'

export interface CreateLessonDTO {
  id: string
  weekName: string
  dayIndex: number
  time: string
  classroom: string
  teacherID: string
  subject: string
  lessonType: LessonType
}

export interface UpdateLessonDTO {
  lessonId: string
  time?: string
  classroom?: string
  teacherID?: string
  subject?: string
  lessonType?: LessonType
}

export interface DeleteLessonDTO {
  lessonId: string
}

export const lessonApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLesson: builder.mutation<{ message: string }, CreateLessonDTO>({
      query: ({ id, weekName, dayIndex, ...body }) => ({
        url: `/groups/${id}/weeks/${weekName}/days/${dayIndex}/lessons`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Schedule', 'GroupsSchedule', 'Weeks'],
    }),
    updateLesson: builder.mutation<{ message: string }, UpdateLessonDTO>({
      query: ({ lessonId, ...body }) => ({
        url: `/groups/lessons/${lessonId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Schedule', 'GroupsSchedule'],
    }),
    deleteLesson: builder.mutation<{ message: string }, DeleteLessonDTO>({
      query: ({ lessonId }) => ({
        url: `/groups/lessons/${lessonId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedule', 'GroupsSchedule', 'Weeks'],
    }),
  }),
  overrideExisting: false,
})

export const { useCreateLessonMutation, useUpdateLessonMutation, useDeleteLessonMutation } =
  lessonApi
