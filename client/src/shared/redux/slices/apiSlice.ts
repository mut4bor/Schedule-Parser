import { API_URL, X_ADMIN_PASSWORD } from '@/shared/config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  IGroup,
  IName,
  IFaculties,
  ISchedule,
  IRefreshSchedule,
  CreateGroupDTO,
  UpdateGroupDTO,
  UpdateFacultyDTO,
  UpdateCourseDTO,
  UpdateEducationTypeDTO,
  AddWeekDTO,
  UpdateWeekDTO,
  DeleteWeekDTO,
} from '../types'

const groupsPath = `groups`
const namesPath = `names`
const facultyPath = `faculty`
const coursePath = `course`
const educationTypePath = `education-types`
const refreshPath = `refresh`

const getParams = (params: string | void) => {
  return params ? `?${params}` : ''
}

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
})

const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: baseQuery,

  tagTypes: ['Groups', 'Faculties', 'Courses', 'EducationTypes', 'Names'],

  endpoints: (builder) => ({
    // --- Refresh ---
    refreshSchedule: builder.mutation<IRefreshSchedule, string>({
      query: (password) => ({
        url: `/${refreshPath}`,
        method: 'POST',
        headers: {
          'x-admin-password': X_ADMIN_PASSWORD,
        },
        body: { password },
      }),
    }),

    // --- Groups ---
    getAllGroups: builder.query<IGroup[], string | void>({
      query: (searchParams) => `/${groupsPath}${getParams(searchParams)}`,
      providesTags: ['Groups'],
    }),
    getGroupByID: builder.query<IGroup, string>({
      query: (groupID) => `/${groupsPath}/${groupID}`,
      providesTags: ['Groups'],
    }),
    createGroup: builder.mutation<IGroup, CreateGroupDTO>({
      query: (body) => ({
        url: `/${groupsPath}`,
        method: 'POST',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body,
      }),
      invalidatesTags: ['Groups'],
    }),
    updateGroupByID: builder.mutation<
      IGroup,
      { id: string; data: UpdateGroupDTO }
    >({
      query: ({ id, data }) => ({
        url: `/${groupsPath}/${id}`,
        method: 'PUT',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body: data,
      }),
      invalidatesTags: ['Groups'],
    }),
    deleteGroupByID: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/${groupsPath}/${id}`,
        method: 'DELETE',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
      }),
      invalidatesTags: ['Groups'],
    }),
    deleteAllGroups: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: `/${groupsPath}`,
        method: 'DELETE',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
      }),
      invalidatesTags: ['Groups'],
    }),

    // --- Weeks inside Groups ---
    getWeeksByID: builder.query<string[], string>({
      query: (groupID) => `/${groupsPath}/${groupID}/weeks`,
    }),
    getWeekScheduleByID: builder.query<
      ISchedule,
      { groupID: string; week: string }
    >({
      query: ({ groupID, week }) => `/${groupsPath}/${groupID}/weeks/${week}`,
    }),
    addWeekToGroup: builder.mutation<
      { message: string; week: ISchedule },
      AddWeekDTO
    >({
      query: ({ id, week, weekData }) => ({
        url: `/${groupsPath}/${id}/weeks`,
        method: 'POST',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body: { week, weekData },
      }),
      invalidatesTags: ['Groups'],
    }),
    updateWeekInGroup: builder.mutation<
      { message: string; week: ISchedule },
      UpdateWeekDTO
    >({
      query: ({ id, week, weekData }) => ({
        url: `/${groupsPath}/${id}/weeks/${week}`,
        method: 'PUT',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body: { weekData },
      }),
      invalidatesTags: ['Groups'],
    }),
    deleteWeekFromGroup: builder.mutation<{ message: string }, DeleteWeekDTO>({
      query: ({ id, week }) => ({
        url: `/${groupsPath}/${id}/weeks/${week}`,
        method: 'DELETE',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
      }),
      invalidatesTags: ['Groups'],
    }),

    // --- Names ---
    getNames: builder.query<IName[], string | void>({
      query: (searchParams) => `/${namesPath}${getParams(searchParams)}`,
      providesTags: ['Names'],
    }),
    getGroupNamesThatMatchWithReqParams: builder.query<IName[], string>({
      query: (searchParams) => `/${namesPath}/search${getParams(searchParams)}`,
      providesTags: ['Names'],
    }),

    // --- Faculties ---
    getFaculties: builder.query<IFaculties, void>({
      query: () => `/${facultyPath}`,
      providesTags: ['Faculties'],
    }),
    getAllFaculties: builder.query<string[], void>({
      query: () => `/${facultyPath}/all`,
      providesTags: ['Faculties'],
    }),
    createFaculty: builder.mutation<IGroup, CreateGroupDTO>({
      query: (body) => ({
        url: `/${facultyPath}`,
        method: 'POST',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body,
      }),
      invalidatesTags: ['Faculties'],
    }),
    updateFaculty: builder.mutation<
      { message: string; modifiedCount: number },
      UpdateFacultyDTO
    >({
      query: (body) => ({
        url: `/${facultyPath}`,
        method: 'PUT',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body,
      }),
      invalidatesTags: ['Faculties'],
    }),
    deleteFaculty: builder.mutation<
      { message: string; deletedCount: number },
      string
    >({
      query: (faculty) => ({
        url: `/${facultyPath}/${faculty}`,
        method: 'DELETE',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
      }),
      invalidatesTags: ['Faculties'],
    }),
    getGroupsByFaculty: builder.query<IGroup[], string>({
      query: (faculty) => `/${facultyPath}/${faculty}/groups`,
      providesTags: ['Groups'],
    }),

    // --- Courses ---
    getCourses: builder.query<string[], string | void>({
      query: (searchParams) => `/${coursePath}${getParams(searchParams)}`,
      providesTags: ['Courses'],
    }),
    createCourse: builder.mutation<IGroup, CreateGroupDTO>({
      query: (body) => ({
        url: `/${coursePath}`,
        method: 'POST',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body,
      }),
      invalidatesTags: ['Courses'],
    }),
    updateCourse: builder.mutation<
      { message: string; modifiedCount: number },
      UpdateCourseDTO
    >({
      query: (body) => ({
        url: `/${coursePath}`,
        method: 'PUT',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body,
      }),
      invalidatesTags: ['Courses'],
    }),
    deleteCourse: builder.mutation<
      { message: string; deletedCount: number },
      string
    >({
      query: (course) => ({
        url: `/${coursePath}/${course}`,
        method: 'DELETE',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
      }),
      invalidatesTags: ['Courses'],
    }),
    getGroupsByCourse: builder.query<IGroup[], string>({
      query: (course) => `/${coursePath}/${course}/groups`,
      providesTags: ['Groups'],
    }),

    // --- Education Types ---
    getEducationTypes: builder.query<string[], void>({
      query: () => `/${educationTypePath}`,
      providesTags: ['EducationTypes'],
    }),
    createEducationType: builder.mutation<IGroup, CreateGroupDTO>({
      query: (body) => ({
        url: `/${educationTypePath}`,
        method: 'POST',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body,
      }),
      invalidatesTags: ['EducationTypes'],
    }),
    updateEducationType: builder.mutation<
      { message: string; modifiedCount: number },
      UpdateEducationTypeDTO
    >({
      query: (body) => ({
        url: `/${educationTypePath}`,
        method: 'PUT',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body,
      }),
      invalidatesTags: ['EducationTypes'],
    }),
    deleteEducationType: builder.mutation<
      { message: string; deletedCount: number },
      string
    >({
      query: (educationType) => ({
        url: `/${educationTypePath}/${educationType}`,
        method: 'DELETE',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
      }),
      invalidatesTags: ['EducationTypes'],
    }),
    getGroupsByEducationType: builder.query<IGroup[], string>({
      query: (educationType) => `/${educationTypePath}/${educationType}/groups`,
      providesTags: ['Groups'],
    }),
  }),
})

export const {
  // Refresh
  useRefreshScheduleMutation,

  // Groups
  useGetAllGroupsQuery,
  useGetGroupByIDQuery,
  useCreateGroupMutation,
  useUpdateGroupByIDMutation,
  useDeleteGroupByIDMutation,
  useDeleteAllGroupsMutation,
  useGetWeeksByIDQuery,
  useGetWeekScheduleByIDQuery,
  useAddWeekToGroupMutation,
  useUpdateWeekInGroupMutation,
  useDeleteWeekFromGroupMutation,

  // Names
  useGetNamesQuery,
  useGetGroupNamesThatMatchWithReqParamsQuery,

  // Faculties
  useGetFacultiesQuery,
  useGetAllFacultiesQuery,
  useCreateFacultyMutation,
  useUpdateFacultyMutation,
  useDeleteFacultyMutation,
  useGetGroupsByFacultyQuery,

  // Courses
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetGroupsByCourseQuery,

  // Education Types
  useGetEducationTypesQuery,
  useCreateEducationTypeMutation,
  useUpdateEducationTypeMutation,
  useDeleteEducationTypeMutation,
  useGetGroupsByEducationTypeQuery,
} = apiSlice

export default apiSlice
