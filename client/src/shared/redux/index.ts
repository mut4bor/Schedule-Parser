export {
  useRefreshScheduleMutation,
  useGetFacultiesQuery,
  useGetCoursesQuery,
  useGetNamesQuery,
  useGetGroupNamesThatMatchWithReqParamsQuery,
  useGetGroupByIDQuery,
  useGetWeeksByIDQuery,
  useGetWeekScheduleByIDQuery,
} from './slices/apiSlice'

export {
  educationTypeChanged,
  facultyChanged,
  courseChanged,
  weekChanged,
  dayIndexChanged,
} from './slices/navigationSlice'

export { inputIsFocusedChanged, searchValueChanged } from './slices/searchSlice'

export type { IName } from './types'

export { useAppSelector, useAppDispatch } from './hooks'

export { store } from './store'
