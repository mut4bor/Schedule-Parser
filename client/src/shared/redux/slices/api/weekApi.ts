import { baseApi } from '../baseApi'
import { ILesson, IWeek, IGroupsSchedule } from '@/shared/redux/types'

export interface CheckWeekAvailabilityDTO {
  id: string
  weekName: string
}

export interface UpdateWeekDTO {
  id: string
  oldWeekName: string
  newWeekName: string
}

export interface DeleteWeekDTO {
  id: string
  weekName: string
}

export interface GetWeekScheduleParams {
  groupID: string
  week: string
}

export const weekApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWeeksByGroupId: builder.query<IWeek[], string>({
      query: (groupID) => `/groups/${groupID}/weeks`,
      providesTags: ['Weeks'],
    }),
    getWeekScheduleByGroupId: builder.query<ILesson[], GetWeekScheduleParams>({
      query: ({ groupID, week }) => `/groups/${groupID}/weeks/${week}`,
      providesTags: ['Schedule'],
    }),
    getGroupsSchedules: builder.query<IGroupsSchedule, string[]>({
      query: (groupIDs) => `/groups/${groupIDs.join(',')}/schedule`,
      providesTags: ['GroupsSchedule'],
    }),
    checkWeekAvailability: builder.mutation<{ message: string }, CheckWeekAvailabilityDTO>({
      query: ({ id, weekName }) => ({
        url: `/groups/${id}/weeks`,
        method: 'POST',
        body: { weekName },
      }),
      invalidatesTags: ['Weeks'],
    }),
    updateWeekSchedule: builder.mutation<{ message: string }, UpdateWeekDTO>({
      query: ({ id, oldWeekName, newWeekName }) => ({
        url: `/groups/${id}/weeks`,
        method: 'PUT',
        body: { oldWeekName, newWeekName },
      }),
      invalidatesTags: ['Weeks', 'Schedule', 'GroupsSchedule'],
    }),
    deleteWeekSchedule: builder.mutation<{ message: string }, DeleteWeekDTO>({
      query: ({ id, weekName }) => ({
        url: `/groups/${id}/weeks/${weekName}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Weeks', 'Schedule', 'GroupsSchedule'],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetWeeksByGroupIdQuery,
  useGetWeekScheduleByGroupIdQuery,
  useGetGroupsSchedulesQuery,
  useCheckWeekAvailabilityMutation,
  useUpdateWeekScheduleMutation,
  useDeleteWeekScheduleMutation,
} = weekApi
