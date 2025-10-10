import { API_URL } from '@/shared/config'
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react'
import {
  IGroup,
  IName,
  IFaculties,
  CreateGroupDTO,
  UpdateGroupDTO,
  UpdateFacultyDTO,
  UpdateCourseDTO,
  UpdateEducationTypeDTO,
  CreateWeekDTO,
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
import { logout, setAccessToken } from './authSlice'
import { RootState } from '../store'

const groupsPath = `groups`
const namesPath = `names`
const facultyPath = `faculty`
const coursePath = `course`
const educationTypePath = `education-types`

const getParams = (params: string | void) => {
  return params ? `?${params}` : ''
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  let result = await rawBaseQuery(args, api, extraOptions)

  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    const refreshResult = await rawBaseQuery({ url: '/refresh', method: 'POST' }, api, extraOptions)

    if (refreshResult.data) {
      const accessToken = (refreshResult.data as any).accessToken

      api.dispatch(setAccessToken(accessToken))

      result = await rawBaseQuery(args, api, extraOptions)
    } else {
      api.dispatch(logout())
    }
  }
  return result
}

const apiSlice = createApi({
  reducerPath: 'api',

  baseQuery: baseQueryWithAuth,

  tagTypes: [
    'EducationTypes',
    'Faculties',
    'Courses',
    'Groups',
    'Names',
    'Weeks',
    'Schedule',
    'GroupsSchedule',
  ],

  endpoints: (builder) => ({
    login: builder.mutation<{ accessToken: string }, { username: string; password: string }>({
      query: (credentials) => ({
        url: `/login`,
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setAccessToken(data.accessToken))
        } catch {
          // ошибки можно обработать тут
        }
      },
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
        } finally {
          dispatch(logout())
        }
      },
    }),
    // --- Education Types ---
    getEducationTypes: builder.query<string[], void>({
      query: () => `/${educationTypePath}`,
      providesTags: ['EducationTypes'],
    }),
    createEducationType: builder.mutation<IGroup, CreateEducationTypeDTO>({
      query: (body) => ({
        url: `/${educationTypePath}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['EducationTypes', 'Faculties', 'Courses', 'Groups', 'Names'],
    }),
    updateEducationType: builder.mutation<
      { message: string; modifiedCount: number },
      UpdateEducationTypeDTO
    >({
      query: (body) => ({
        url: `/${educationTypePath}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['EducationTypes', 'Faculties', 'Courses', 'Groups', 'Names'],
    }),
    deleteEducationType: builder.mutation<{ message: string; deletedCount: number }, string>({
      query: (educationType) => ({
        url: `/${educationTypePath}/${educationType}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['EducationTypes', 'Faculties', 'Courses', 'Groups', 'Names'],
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
        body,
      }),
      invalidatesTags: ['Faculties', 'Courses', 'Groups', 'Names'],
    }),
    updateFaculty: builder.mutation<{ message: string; modifiedCount: number }, UpdateFacultyDTO>({
      query: (body) => ({
        url: `/${facultyPath}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Faculties', 'Courses', 'Groups', 'Names'],
    }),
    deleteFaculty: builder.mutation<{ message: string; deletedCount: number }, DeleteFacultyDTO>({
      query: ({ educationType, faculty }) => ({
        url: `/${facultyPath}/${educationType}/${faculty}`,
        method: 'DELETE',
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
        body,
      }),
      invalidatesTags: ['Courses', 'Groups', 'Names'],
    }),
    updateCourse: builder.mutation<{ message: string; modifiedCount: number }, UpdateCourseDTO>({
      query: (body) => ({
        url: `/${coursePath}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Courses', 'Groups', 'Names'],
    }),
    deleteCourse: builder.mutation<{ message: string; deletedCount: number }, DeleteCourseDTO>({
      query: ({ educationType, faculty, course }) => ({
        url: `/${coursePath}/${educationType}/${faculty}/${course}`,
        method: 'DELETE',
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
        body,
      }),
      invalidatesTags: ['Groups', 'Names'],
    }),
    updateGroupByID: builder.mutation<IGroup, { id: string; data: UpdateGroupDTO }>({
      query: ({ id, data }) => ({
        url: `/${groupsPath}/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Groups', 'Names'],
    }),
    deleteGroupByID: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/${groupsPath}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Groups', 'Names'],
    }),

    // --- Weeks inside Groups ---
    getWeeksByID: builder.query<string[], string>({
      query: (groupID) => `/${groupsPath}/${groupID}/weeks`,
      providesTags: ['Weeks'],
    }),
    getWeekScheduleByID: builder.query<IWeek, { groupID: string; week: string }>({
      query: ({ groupID, week }) => `/${groupsPath}/${groupID}/weeks/${week}`,
      providesTags: ['Schedule'],
    }),
    getGroupsSchedulesByID: builder.query<IGroup[], string[]>({
      query: (groupIDs) => `/${groupsPath}/${groupIDs.join(',')}/schedule`,
      providesTags: ['GroupsSchedule'],
    }),

    createWeekInGroup: builder.mutation<{ message: string }, CreateWeekDTO>({
      query: ({ id, weekName }) => ({
        url: `/${groupsPath}/${id}/weeks`,
        method: 'POST',
        body: { weekName },
      }),
      invalidatesTags: ['Weeks', 'GroupsSchedule'],
    }),
    updateWeekInGroup: builder.mutation<{ message: string }, UpdateWeekDTO>({
      query: ({ id, oldWeekName, newWeekName }) => ({
        url: `/${groupsPath}/${id}/weeks`,
        method: 'PUT',
        body: { oldWeekName, newWeekName },
      }),
      invalidatesTags: ['Weeks', 'GroupsSchedule'],
    }),
    deleteWeekFromGroup: builder.mutation<{ message: string }, DeleteWeekDTO>({
      query: ({ id, weekName }) => ({
        url: `/${groupsPath}/${id}/weeks/${weekName}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Weeks', 'GroupsSchedule'],
    }),

    createLessonInDay: builder.mutation<{ message: string }, CreateLessonDTO>({
      query: ({ id, weekName, dayIndex, ...body }) => ({
        url: `/${groupsPath}/${id}/weeks/${weekName}/days/${dayIndex}/lessons`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Schedule', 'GroupsSchedule'],
    }),

    updateLessonInDay: builder.mutation<{ message: string }, UpdateLessonDTO>({
      query: ({ id, weekName, dayIndex, lessonId, ...body }) => ({
        url: `/${groupsPath}/${id}/weeks/${weekName}/days/${dayIndex}/lessons/${lessonId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Schedule', 'GroupsSchedule'],
    }),

    deleteLessonFromDay: builder.mutation<{ message: string }, DeleteLessonDTO>({
      query: ({ id, weekName, dayIndex, lessonId }) => ({
        url: `/${groupsPath}/${id}/weeks/${weekName}/days/${dayIndex}/lessons/${lessonId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Schedule', 'GroupsSchedule'],
    }),

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
  //Login
  useLoginMutation,
  useLogoutMutation,

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
  useGetGroupsSchedulesByIDQuery,
  useCreateWeekInGroupMutation,
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
