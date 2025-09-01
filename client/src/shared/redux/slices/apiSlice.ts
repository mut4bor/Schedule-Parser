import { API_URL, X_ADMIN_PASSWORD } from '@/shared/config'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import {
  IGroup,
  IName,
  IFaculties,
  CreateGroupDTO,
  UpdateGroupDTO,
  UpdateFacultyDTO,
  UpdateCourseDTO,
  UpdateEducationTypeDTO,
  AddWeekDTO,
  UpdateWeekDTO,
  DeleteWeekDTO,
  DeleteFacultyDTO,
  CreateEducationTypeDTO,
  CreateFacultyDTO,
  CreateCourseDTO,
  DeleteCourseDTO,
  DeleteLessonDTO,
  UpdateLessonDTO,
  IWeek,
  CreateLessonDTO,
} from '../types'

const groupsPath = `groups`
const namesPath = `names`
const facultyPath = `faculty`
const coursePath = `course`
const educationTypePath = `education-types`

const getParams = (params: string | void) => {
  return params ? `?${params}` : ''
}

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
})

const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: baseQuery,

  tagTypes: [
    'EducationTypes',
    'Faculties',
    'Courses',
    'Groups',
    'Names',
    'Weeks',
    'Schedule',
  ],

  endpoints: (builder) => ({
    // --- Education Types ---
    getEducationTypes: builder.query<string[], void>({
      query: () => `/${educationTypePath}`,
      providesTags: ['EducationTypes'],
    }),
    createEducationType: builder.mutation<IGroup, CreateEducationTypeDTO>({
      query: (body) => ({
        url: `/${educationTypePath}`,
        method: 'POST',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body,
      }),
      invalidatesTags: [
        'EducationTypes',
        'Faculties',
        'Courses',
        'Groups',
        'Names',
      ],
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
      invalidatesTags: [
        'EducationTypes',
        'Faculties',
        'Courses',
        'Groups',
        'Names',
      ],
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
      invalidatesTags: [
        'EducationTypes',
        'Faculties',
        'Courses',
        'Groups',
        'Names',
      ],
    }),
    getGroupsByEducationType: builder.query<IGroup[], string>({
      query: (educationType) => `/${educationTypePath}/${educationType}/groups`,
      providesTags: ['Groups'],
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
    createFaculty: builder.mutation<IGroup, CreateFacultyDTO>({
      query: (body) => ({
        url: `/${facultyPath}`,
        method: 'POST',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body,
      }),
      invalidatesTags: ['Faculties', 'Courses', 'Groups', 'Names'],
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
      invalidatesTags: ['Faculties', 'Courses', 'Groups', 'Names'],
    }),
    deleteFaculty: builder.mutation<
      { message: string; deletedCount: number },
      DeleteFacultyDTO
    >({
      query: ({ educationType, faculty }) => ({
        url: `/${facultyPath}/${educationType}/${faculty}`,
        method: 'DELETE',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
      }),
      invalidatesTags: ['Faculties', 'Courses', 'Groups', 'Names'],
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
    createCourse: builder.mutation<IGroup, CreateCourseDTO>({
      query: (body) => ({
        url: `/${coursePath}`,
        method: 'POST',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body,
      }),
      invalidatesTags: ['Courses', 'Groups', 'Names'],
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
      invalidatesTags: ['Courses', 'Groups', 'Names'],
    }),
    deleteCourse: builder.mutation<
      { message: string; deletedCount: number },
      DeleteCourseDTO
    >({
      query: ({ educationType, faculty, course }) => ({
        url: `/${coursePath}/${educationType}/${faculty}/${course}`,
        method: 'DELETE',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
      }),
      invalidatesTags: ['Courses', 'Groups', 'Names'],
    }),
    getGroupsByCourse: builder.query<IGroup[], string>({
      query: (course) => `/${coursePath}/${course}/groups`,
      providesTags: ['Groups'],
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
      invalidatesTags: ['Groups', 'Names'],
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
      invalidatesTags: ['Groups', 'Names'],
    }),
    deleteGroupByID: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/${groupsPath}/${id}`,
        method: 'DELETE',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
      }),
      invalidatesTags: ['Groups', 'Names'],
    }),

    // --- Weeks inside Groups ---
    getWeeksByID: builder.query<string[], string>({
      query: (groupID) => `/${groupsPath}/${groupID}/weeks`,
      providesTags: ['Weeks'],
    }),
    getWeekScheduleByID: builder.query<
      IWeek,
      { groupID: string; week: string }
    >({
      query: ({ groupID, week }) => `/${groupsPath}/${groupID}/weeks/${week}`,
      providesTags: ['Schedule'],
    }),

    addWeekToGroup: builder.mutation<{ message: string }, AddWeekDTO>({
      query: ({ id, weekName }) => ({
        url: `/${groupsPath}/${id}/weeks`,
        method: 'POST',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body: { weekName },
      }),
      invalidatesTags: ['Weeks'],
    }),
    updateWeekInGroup: builder.mutation<{ message: string }, UpdateWeekDTO>({
      query: ({ id, oldWeekName, newWeekName }) => ({
        url: `/${groupsPath}/${id}/weeks`,
        method: 'PUT',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body: { oldWeekName, newWeekName },
      }),
      invalidatesTags: ['Weeks'],
    }),
    deleteWeekFromGroup: builder.mutation<{ message: string }, DeleteWeekDTO>({
      query: ({ id, weekName }) => ({
        url: `/${groupsPath}/${id}/weeks/${weekName}`,
        method: 'DELETE',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
      }),
      invalidatesTags: ['Weeks'],
    }),

    createLessonInDay: builder.mutation<{ message: string }, CreateLessonDTO>({
      query: ({ id, weekName, dayIndex, ...body }) => ({
        url: `/${groupsPath}/${id}/weeks/${weekName}/days/${dayIndex}/lessons`,
        method: 'POST',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body,
      }),
      invalidatesTags: ['Schedule'],
    }),

    updateLessonInDay: builder.mutation<{ message: string }, UpdateLessonDTO>({
      query: ({ id, weekName, dayIndex, lessonId, ...body }) => ({
        url: `/${groupsPath}/${id}/weeks/${weekName}/days/${dayIndex}/lessons/${lessonId}`,
        method: 'PUT',
        headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        body,
      }),
      invalidatesTags: ['Schedule'],
    }),

    deleteLessonFromDay: builder.mutation<{ message: string }, DeleteLessonDTO>(
      {
        query: ({ id, weekName, dayIndex, lessonId }) => ({
          url: `/${groupsPath}/${id}/weeks/${weekName}/days/${dayIndex}/lessons/${lessonId}`,
          method: 'DELETE',
          headers: { 'x-admin-password': X_ADMIN_PASSWORD },
        }),
        invalidatesTags: ['Schedule'],
      },
    ),

    // --- Names ---
    getGroupNames: builder.query<IName[], string | void>({
      query: (searchParams) => `/${namesPath}${getParams(searchParams)}`,
      providesTags: ['Names'],
    }),
    getGroupNamesThatMatchWithReqParams: builder.query<IName[], string>({
      query: (searchParams) => `/${namesPath}/search${getParams(searchParams)}`,
      providesTags: ['Names'],
    }),
  }),
})

export const {
  // Education Types
  useGetEducationTypesQuery,
  useCreateEducationTypeMutation,
  useUpdateEducationTypeMutation,
  useDeleteEducationTypeMutation,
  useGetGroupsByEducationTypeQuery,

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

  // Groups
  useGetAllGroupsQuery,
  useGetGroupByIDQuery,
  useCreateGroupMutation,
  useUpdateGroupByIDMutation,
  useDeleteGroupByIDMutation,
  useGetWeeksByIDQuery,
  useGetWeekScheduleByIDQuery,
  useAddWeekToGroupMutation,
  useUpdateWeekInGroupMutation,
  useDeleteWeekFromGroupMutation,
  useCreateLessonInDayMutation,
  useUpdateLessonInDayMutation,
  useDeleteLessonFromDayMutation,

  // Names
  useGetGroupNamesQuery,
  useGetGroupNamesThatMatchWithReqParamsQuery,
} = apiSlice

export default apiSlice
