import * as style from './style.module.scss'
import { FacultyProps } from '../types'
import { FacultyLink } from '../faculty-link'
import React from 'react'

export const FacultyList = ({ data }: FacultyProps) => {
  const { educationType, faculties } = data || {}

  return (
    <div className={style.container}>
      {!data || !educationType || !faculties
        ? Array.from({ length: 4 }).map((_, index, array) => (
            <React.Fragment key={`faculty-${index}`}>
              <FacultyLink />
              {index < array.length - 1 && <span className={style.pipe}></span>}
            </React.Fragment>
          ))
        : faculties.map((faculty, index, array) => (
            <React.Fragment key={`faculty-${index}`}>
              <FacultyLink data={{ educationType, faculty }} />
              {index < array.length - 1 && <span className={style.pipe}></span>}
            </React.Fragment>
          ))}
    </div>
  )
}
