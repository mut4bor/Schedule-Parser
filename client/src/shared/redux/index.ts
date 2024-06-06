export {
  useGetNamesQuery,
  useGetGroupByNameQuery,
  useGetGroupsQuery,
  useGetGroupByIDQuery,
  useGetEducationTypesQuery,
  useGetFacultiesQuery,
  useGetCoursesQuery,
} from './slices/apiSlice'
export {
  educationTypeChanged,
  facultyChanged,
  courseChanged,
  groupChanged,
  weekChanged,
  dayIndexChanged,
} from './slices/navigationSlice'
export { searchValueChanged } from './slices/searchSlice'
export type { IName, IGroup } from './slices/types'
export { useAppSelector, useAppDispatch } from './hooks'
export { store } from './store'
