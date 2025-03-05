import * as style from './style.module.scss'
import { FacultyProps } from './types'
import { Skeleton } from '@/shared/ui'
import routes from '@/shared/routes'
import {
  useAppDispatch,
  educationTypeChanged,
  facultyChanged,
  courseChanged,
} from '@/shared/redux'
import { FacultyLink } from '@/entities/faculty'
import { Fragment } from 'react'

const Pipe = () => {
  return <span className={style.pipe}></span>
}

export const Faculty = ({ data, columnsAmount }: FacultyProps) => {
  const dispatch = useAppDispatch()

  const { educationType, faculties } = data || {}

  const handleLinkClick = (faculty: string) => {
    if (educationType) {
      dispatch(educationTypeChanged(educationType))
    }

    dispatch(facultyChanged(faculty))
    dispatch(courseChanged(null))
  }

  const skeletonLenght = columnsAmount
    ? columnsAmount > 0
      ? columnsAmount
      : 1
    : 4

  return (
    <div className={style.container}>
      <div className={style.heading}>
        {!data ? (
          <Skeleton />
        ) : (
          <h2 className={style.educationType}>{educationType}</h2>
        )}
      </div>

      <div className={style.content}>
        {!data || !educationType || !faculties
          ? Array.from({ length: skeletonLenght }).map((_, index, array) => (
              <Fragment key={`skeleton-${index}`}>
                <div className={style.skeletonContainer}>
                  <ul className={style.skeletonList}>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <li key={index}>
                        <Skeleton />
                      </li>
                    ))}
                  </ul>
                </div>
                {index < array.length - 1 && <Pipe />}
              </Fragment>
            ))
          : faculties.map((faculty, index, array) => (
              <Fragment key={`faculty-link-${index}`}>
                <FacultyLink
                  faculty={faculty}
                  href={routes.COURSES_PATH}
                  handleLinkClick={() => handleLinkClick(faculty)}
                />
                {index < array.length - 1 && <Pipe />}
              </Fragment>
            ))}
      </div>
    </div>
  )
}
