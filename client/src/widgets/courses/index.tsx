import * as style from './style.module.scss'
import { CoursesProps } from './types'
import { Skeleton } from '@/shared/ui'
import { CourseButton } from '@/entities/courses'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector, useGetCoursesQuery, courseChanged } from '@/shared/redux'
import { BASE_URL } from '@/shared/config'
import { SkeletonTime } from '@/shared/vars/vars'

export const Courses = ({ handleGroupsListSkeletonStateChange }: CoursesProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const navigationValue = useAppSelector((store) => store.navigation.navigationValue)
  const { educationType, faculty, course } = navigationValue

  useEffect(() => {
    if (!faculty) {
      navigate(BASE_URL)
    }
  }, [faculty])

  const searchParams = new URLSearchParams({
    educationType: educationType,
    faculty: faculty,
  }).toString()

  const {
    data: coursesData,
    error: coursesError,
    isFetching,
    isLoading,
  } = useGetCoursesQuery(searchParams, {
    skip: !educationType || !faculty,
  })

  useEffect(() => {
    if (!!coursesData) {
      dispatch(courseChanged(!!course ? course : coursesData[0]))
    }
  }, [coursesData])

  const [coursesSkeletonIsEnabled, setCoursesSkeletonIsEnabled] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCoursesSkeletonIsEnabled(false)
    }, SkeletonTime)
    return () => clearTimeout(timer)
  }, [])

  return (
    <ul className={style.list}>
      {!coursesData || isFetching || isLoading || coursesSkeletonIsEnabled
        ? Array.from({ length: 4 }).map((_, index) => (
            <li className={style.listElement} key={index}>
              <Skeleton className={style.skeleton} />
            </li>
          ))
        : coursesData.map((course, index) => (
            <li className={style.listElement} key={index}>
              <CourseButton handleSkeletonStateChange={handleGroupsListSkeletonStateChange} course={course} />
            </li>
          ))}
    </ul>
  )
}
