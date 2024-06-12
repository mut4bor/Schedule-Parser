import * as style from './style.module.scss'
import { FacultyProps } from './types'
import { Skeleton } from '@/shared/ui'
import { COURSES_PATH } from '@/shared/config'
import {
  useAppDispatch,
  educationTypeChanged,
  facultyChanged,
  courseChanged,
  weekChanged,
  dayIndexChanged,
} from '@/shared/redux'
import { FacultyLink } from '@/entities/faculty'
import React from 'react'

export const Faculty = ({ data, columnsAmount }: FacultyProps) => {
  const dispatch = useAppDispatch()

  const { educationType, faculties } = data || {}

  const handleLinkClick = (faculty: string) => {
    dispatch(educationTypeChanged(educationType))
    dispatch(facultyChanged(faculty))
    dispatch(courseChanged(''))
    dispatch(weekChanged(''))
    dispatch(dayIndexChanged(-1))
  }

  const skeletonLenght = columnsAmount ? (columnsAmount > 0 ? columnsAmount : 1) : 4

  return (
    <div className={style.container}>
      <div className={style.heading}>
        {!data || !educationType ? <Skeleton /> : <h2 className={style.educationType}>{educationType}</h2>}
      </div>

      <div className={style.content}>
        {!data || !educationType || !faculties
          ? Array.from({ length: skeletonLenght }).map((_, index, array) => (
              <React.Fragment key={`skeleton-${index}`}>
                <div className={style.skeletonContainer}>
                  <ul className={style.skeletonList}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <li key={index}>
                        <Skeleton />
                      </li>
                    ))}
                  </ul>
                </div>
                {index < array.length - 1 && <span className={style.pipe}></span>}
              </React.Fragment>
            ))
          : faculties.map((faculty, index, array) => (
              <React.Fragment key={`faculty-link-${index}`}>
                <FacultyLink faculty={faculty} handleLinkClick={() => handleLinkClick(faculty)} href={COURSES_PATH} />
                {index < array.length - 1 && <span className={style.pipe}></span>}
              </React.Fragment>
            ))}
      </div>
    </div>
  )
}
