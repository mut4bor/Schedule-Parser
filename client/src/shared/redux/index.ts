export {
  // Refresh
  useRefreshScheduleMutation,

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
  useUpdateLessonInDayMutation,
  useDeleteLessonFromDayMutation,

  // Names
  useGetGroupNamesQuery,
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
} from './slices/apiSlice'

export { weekChanged, dayIndexChanged } from './slices/navigationSlice'

export {
  isSearchInputFocusedChanged,
  searchValueChanged,
} from './slices/searchSlice'

export type { IName } from './types'

export { useAppSelector, useAppDispatch } from './hooks'

export { store } from './store'
