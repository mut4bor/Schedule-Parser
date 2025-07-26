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
          <h2 className={style.educationType}>{data.educationType}</h2>
        )}
      </div>

      <div className={style.content}>
        {!data
          ? Array.from({ length: skeletonLenght }).map((_, index, array) => (
              <Fragment key={index}>
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
          : data.faculties.map((faculty, index, array) => (
              <Fragment key={index}>
                <FacultyLink
                  faculty={faculty}
                  href={routes.COURSES_PATH}
                  handleLinkClick={() => {
                    dispatch(educationTypeChanged(data.educationType))
                    dispatch(facultyChanged(faculty))
                    dispatch(courseChanged(null))
                  }}
                />
                {index < array.length - 1 && <Pipe />}
              </Fragment>
            ))}
      </div>
    </div>
  )
}
