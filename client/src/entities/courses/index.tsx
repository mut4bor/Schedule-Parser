import * as style from './style.module.scss'
import { CoursesProps } from './types'
import { SkeletonParagraph } from '@/shared/ui'
import { CourseButton } from '@/entities/courses/courses-button'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector, routerValueChanged, useGetCoursesQuery } from '@/shared/redux'
import { BASE_URL } from '@/shared/config'

export const Courses = ({ handleStateChange }: CoursesProps) => {
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

  const { data: coursesData, error: coursesError, isFetching, isLoading } = useGetCoursesQuery(searchParams)

  useEffect(() => {
    if (!!coursesData) {
      dispatch(routerValueChanged({ ...routerValue, course: coursesData[0] }))
    }
  }, [coursesData])

  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoursesSkeletonIsEnabled(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <ul className={style.list}>
      {!coursesData || isFetching || isLoading || coursesSkeletonIsEnabled
        ? Array.from({ length: 4 }).map((_, index) => (
            <li className={style.listElement} key={index}>
              <SkeletonParagraph style={{ height: '3.6rem' }} />
            </li>
          ))
        : coursesData.map((course, key) => (
            <li className={style.listElement} key={key}>
              <CourseButton handleStateChange={handleStateChange} data={{ course }} />
            </li>
          ))}
    </ul>
  )
}
