export {
  useGetEducationTypesQuery,
  useGetFacultiesQuery,
  useGetCoursesQuery,
  useGetNamesQuery,
  useGetGroupNamesThatMatchWithReqParamsQuery,
  useGetGroupByIDQuery,
  useGetWeeksByIDQuery,
  useGetWeekDaysByIDQuery,
  useGetScheduleByIDQuery,
} from './slices/apiSlice'

export {
  educationTypeChanged,
  facultyChanged,
  courseChanged,
  groupIDChanged,
  weekChanged,
  dayIndexChanged,
} from './slices/navigationSlice'

export { inputStateChanged, searchValueChanged } from './slices/searchSlice'

export type { IName } from './slices/types'

export { useAppSelector, useAppDispatch } from './hooks'

export { store } from './store'
