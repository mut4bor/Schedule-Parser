import * as style from './style.module.scss'
import { CourseButton } from '@/entities/courses/courses-button'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector, routerValueChanged, useGetCoursesQuery } from '@/shared/redux'
import { BASE_URL, GROUPS_PATH } from '@/shared/config'

export const Courses = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const routerValue = useAppSelector((store) => store.router.routerValue)
  const { educationType, faculty, course } = routerValue

  useEffect(() => {
    if (!faculty) {
      navigate(BASE_URL)
    }
  }, [faculty])

  const searchParams = new URLSearchParams({
    educationType: educationType,
    faculty: faculty,
  }).toString()

  const { data: coursesData, error: coursesError } = useGetCoursesQuery(searchParams)

  useEffect(() => {
    if (!!coursesData) {
      dispatch(routerValueChanged({ ...routerValue, course: coursesData[0] }))
    }
  }, [coursesData])

  if (!coursesData) return <div className=""></div>

  return (
    <ul className={style.container}>
      {coursesData.map((course, key) => (
        <li key={key}>
          <CourseButton data={{ course }} />
        </li>
      ))}
    </ul>
  )
}
