import * as style from './style.module.scss'
import { CourseButtonProps } from './types'
import { useAppDispatch, useAppSelector, navigationValueChanged } from '@/shared/redux'

export const CourseButton = ({ data: { course }, handleStateChange }: CourseButtonProps) => {
  const dispatch = useAppDispatch()
  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)

  const { course: pickedCourse } = navigationValue

  return (
    <button
      onClick={() => {
        dispatch(navigationValueChanged({ ...navigationValue, course: course }))
        handleStateChange(true)
      }}
      className={`${style.button} ${pickedCourse === course ? style.active : ''}`}
      type="button"
    >
      {course}
    </button>
  )
}
