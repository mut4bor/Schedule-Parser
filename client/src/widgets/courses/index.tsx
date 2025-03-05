import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'
import { CourseButton } from '@/entities/courses'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useAppDispatch,
  useAppSelector,
  useGetCoursesQuery,
  courseChanged,
} from '@/shared/redux'
import routes from '@/shared/routes'
import { ErrorComponent } from '@/widgets/error'

export const Courses = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { educationType, faculty, course } = useAppSelector(
    (store) => store.navigation,
  )

  useEffect(() => {
    if (!educationType || !faculty) {
      navigate(routes.BASE_URL)
    }
  }, [educationType, faculty])

  const searchParams = new URLSearchParams({
    educationType: educationType ?? '',
    faculty: faculty ?? '',
  }).toString()

  const { data: coursesData, error: coursesError } = useGetCoursesQuery(
    searchParams,
    {
      skip: !educationType || !faculty,
    },
  )

  useEffect(() => {
    if (!!coursesData) {
      dispatch(courseChanged(!!course ? course : coursesData[0]))
    }
  }, [coursesData])

  if (coursesError) {
    return <ErrorComponent error={coursesError} />
  }

  return (
    <ul className={style.list}>
      {!coursesData
        ? Array.from({ length: 4 }).map((_, index) => (
            <li className={style.listElement} key={index}>
              <Skeleton className={style.skeleton} />
            </li>
          ))
        : coursesData.map((course, index) => (
            <li className={style.listElement} key={index}>
              <CourseButton course={course} />
            </li>
          ))}
    </ul>
  )
}
