import * as style from './style.module.scss'
import { CourseProps } from './types'
import { useAppDispatch, useAppSelector, routerValueChanged, useGetCoursesQuery } from '@/shared/redux'

export const CourseButton = (props: CourseProps) => {
  const dispatch = useAppDispatch()
  const routerValue = useAppSelector((store) => store.router.routerValue)
  const { educationType, faculty, course: pickedCourse } = routerValue
  const {
    data: { course },
  } = props
  const isActive = pickedCourse === course

  return (
    <button
      onClick={() => {
        dispatch(routerValueChanged({ ...routerValue, course: course }))
      }}
      className={`${style.button} ${isActive ? style.active : ''}`}
      type="button"
    >
      {course}
    </button>
  )
}
