export {
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
} from './slices/apiSlice'

export type { IName } from './types'

export { useAppSelector, useAppDispatch } from './hooks'

export { store } from './store'
