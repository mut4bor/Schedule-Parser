import * as style from './style.module.scss'
import { CourseButtonProps } from './types'
import { useAppDispatch, useAppSelector, routerValueChanged } from '@/shared/redux'

export const CourseButton = ({ data: { course }, handleStateChange }: CourseButtonProps) => {
  const dispatch = useAppDispatch()
  const routerValue = useAppSelector((store) => store.router.routerValue)
  const { course: pickedCourse } = routerValue

  return (
    <button
      onClick={() => {
        dispatch(routerValueChanged({ ...routerValue, course: course }))
        handleStateChange(true)
      }}
      className={`${style.button} ${pickedCourse === course ? style.active : ''}`}
      type="button"
    >
      {course}
    </button>
  )
}
