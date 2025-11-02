import { baseApi } from '../baseApi'
import {
  IGroup,
  IWeek,
  IGroupsSchedule,
  CreateGroupDTO,
  UpdateGroupDTO,
  CreateWeekDTO,
  UpdateWeekDTO,
  DeleteWeekDTO,
  CreateLessonDTO,
  UpdateLessonDTO,
  DeleteLessonDTO,
} from '@/shared/redux/types'

const getParams = (params?: string) => (params ? `?${params}` : '')

export const groupsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllGroups: builder.query<IGroup[], string | void>({
      query: (searchParams) => `/groups${getParams(searchParams ?? '')}`,
      providesTags: ['Groups'],
    }),
    getGroupByID: builder.query<IGroup, string>({
      query: (groupID) => `/groups/${groupID}`,
      providesTags: ['Groups'],
    }),
    createGroup: builder.mutation<IGroup, CreateGroupDTO>({
      query: (body) => ({
        url: `/groups`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Groups', 'Names'],
    }),
    updateGroupByID: builder.mutation<IGroup, { id: string; data: UpdateGroupDTO }>({
      query: ({ id, data }) => ({
        url: `/groups/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Groups', 'Names'],
    }),
    deleteGroupByID: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/groups/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Groups', 'Names'],
    }),

    // Weeks
    getWeeksByID: builder.query<string[], string>({
      query: (groupID) => `/groups/${groupID}/weeks`,
      providesTags: ['Weeks'],
    }),
    getWeekScheduleByID: builder.query<IWeek, { groupID: string; week: string }>({
      query: ({ groupID, week }) => `/groups/${groupID}/weeks/${week}`,
      providesTags: ['Schedule'],
    }),
    getGroupsSchedulesByID: builder.query<IGroupsSchedule[], string[]>({
      query: (groupIDs) => `/groups/${groupIDs.join(',')}/schedule`,
      providesTags: ['GroupsSchedule'],
    }),

    createWeekInGroup: builder.mutation<{ message: string }, CreateWeekDTO>({
      query: ({ id, weekName }) => ({
        url: `/groups/${id}/weeks`,
        method: 'POST',
        body: { weekName },
      }),
      invalidatesTags: ['Weeks', 'GroupsSchedule'],
    }),
    updateWeekInGroup: builder.mutation<{ message: string }, UpdateWeekDTO>({
      query: ({ id, oldWeekName, newWeekName }) => ({
        url: `/groups/${id}/weeks`,
        method: 'PUT',
        body: { oldWeekName, newWeekName },
      }),
      invalidatesTags: ['Weeks', 'GroupsSchedule'],
    }),
    deleteWeekFromGroup: builder.mutation<{ message: string }, DeleteWeekDTO>({
      query: ({ id, weekName }) => ({
        url: `/groups/${id}/weeks/${weekName}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Weeks', 'GroupsSchedule'],
    }),

    // Lessons
    createLessonInDay: builder.mutation<{ message: string }, CreateLessonDTO>({
      query: ({ id, weekName, dayIndex, ...body }) => ({
        url: `/groups/${id}/weeks/${weekName}/days/${dayIndex}/lessons`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Schedule', 'GroupsSchedule'],
    }),
    updateLessonInDay: builder.mutation<{ message: string }, UpdateLessonDTO>({
      query: ({ id, weekName, dayIndex, lessonId, ...body }) => ({
        url: `/groups/${id}/weeks/${weekName}/days/${dayIndex}/lessons/${lessonId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Schedule', 'GroupsSchedule'],
    }),
    deleteLessonFromDay: builder.mutation<{ message: string }, DeleteLessonDTO>({
      query: ({ id, weekName, dayIndex, lessonId }) => ({
        url: `/groups/${id}/weeks/${weekName}/days/${dayIndex}/lessons/${lessonId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedule', 'GroupsSchedule'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetAllGroupsQuery,
  useGetGroupByIDQuery,
  useCreateGroupMutation,
  useUpdateGroupByIDMutation,
  useDeleteGroupByIDMutation,
  useGetWeeksByIDQuery,
  useGetWeekScheduleByIDQuery,
  useGetGroupsSchedulesByIDQuery,
  useCreateWeekInGroupMutation,
  useUpdateWeekInGroupMutation,
  useDeleteWeekFromGroupMutation,
  useCreateLessonInDayMutation,
  useUpdateLessonInDayMutation,
  useDeleteLessonFromDayMutation,
} = groupsApi
