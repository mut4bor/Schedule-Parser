import { baseApi } from '../baseApi'
import { IGroupsSchedule, IDay, ISchedule } from '@/shared/redux/types'

export enum LessonType {
  Lecture = 'Лекция',
  Practice = 'Практика',
  Laboratory = 'Лабораторная',
  Seminar = 'Семинар',
}

export const isValidLessonType = (value: string): value is LessonType => {
  return Object.values(LessonType).includes(value as LessonType)
}

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
  scheduleID: string
  dayIndex: number
  lessonIndex: number
  time?: string
  classroom?: string
  teacherID?: string
  subject?: string
  lessonType?: LessonType
}

export interface DeleteLessonDTO {
  scheduleID: string
  dayIndex: number
  lessonIndex: number
}

export interface CreateWeekDTO {
  weekName: string
  groupID: string
  days: IDay[]
  isActive: boolean
}

export interface UpdateWeekDTO {
  id: string
  weekName?: string
  days?: IDay[]
  isActive?: boolean
}

export interface DeleteWeekDTO {
  id: string
}

export interface GetWeekScheduleParams {
  groupID: string
  week: string
}

export const scheduleApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createLesson: builder.mutation<{ message: string }, CreateLessonDTO>({
      query: (body) => ({
        url: `/schedules`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Schedule', 'GroupsSchedule', 'Weeks'],
    }),
    updateLesson: builder.mutation<{ message: string }, UpdateLessonDTO>({
      query: ({ scheduleID, dayIndex, lessonIndex, ...body }) => ({
        url: `/schedules/${scheduleID}/days/${dayIndex}/lessons/${lessonIndex}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Schedule', 'GroupsSchedule'],
    }),
    deleteLesson: builder.mutation<{ message: string }, DeleteLessonDTO>({
      query: ({ scheduleID, dayIndex, lessonIndex }) => ({
        url: `/schedules/${scheduleID}/days/${dayIndex}/lessons/${lessonIndex}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedule', 'GroupsSchedule', 'Weeks'],
    }),
    getWeeksByGroupId: builder.query<Pick<ISchedule, 'weekName' | 'isActive' | '_id'>[], string>({
      query: (groupID) => `/groups/${groupID}/weeks`,
      providesTags: ['Weeks'],
    }),
    getScheduleById: builder.query<ISchedule, { id: string }>({
      query: ({ id }) => `/schedules/${id}`,
      providesTags: ['Schedule'],
    }),
    getGroupsSchedules: builder.query<IGroupsSchedule, string[]>({
      query: (groupIDs) => `/groups/${groupIDs.join(',')}/schedule`,
      providesTags: ['GroupsSchedule'],
    }),
    createWeekSchedule: builder.mutation<{ message: string }, CreateWeekDTO>({
      query: (body) => ({
        url: `/schedules/weeks`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Weeks'],
    }),
    updateWeekSchedule: builder.mutation<{ message: string }, UpdateWeekDTO>({
      query: ({ id, ...body }) => ({
        url: `/schedules/weeks/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Weeks', 'Schedule', 'GroupsSchedule'],
    }),
    deleteWeekSchedule: builder.mutation<{ message: string }, DeleteWeekDTO>({
      query: ({ id }) => ({
        url: `/schedules/weeks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Weeks', 'Schedule', 'GroupsSchedule'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useCreateLessonMutation,
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useGetWeeksByGroupIdQuery,
  useGetScheduleByIdQuery,
  useGetGroupsSchedulesQuery,
  useCreateWeekScheduleMutation,
  useUpdateWeekScheduleMutation,
  useDeleteWeekScheduleMutation,
} = scheduleApi
