import * as style from './style.module.scss'
import { CourseButtonProps } from './types'
import { useAppDispatch, useAppSelector, courseChanged } from '@/shared/redux'

export const CourseButton = ({ course }: CourseButtonProps) => {
  const dispatch = useAppDispatch()
  const pickedCourse = useAppSelector((store) => store.navigation.course)

  return (
    <button
      onClick={() => {
        dispatch(courseChanged(course))
      }}
      className={`${style.button} ${pickedCourse === course ? style.active : null}`}
      type="button"
    >
      {course}
    </button>
  )
}
