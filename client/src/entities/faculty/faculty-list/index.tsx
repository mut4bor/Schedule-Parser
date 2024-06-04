import * as style from './style.module.scss'
import { FacultyProps } from '../types'
import { FacultyLink } from '../faculty-link'

export const FacultyList = (props: FacultyProps) => {
  const {
    data: { educationType, faculties },
  } = props

  const facultyElements = faculties.reduce((acc: JSX.Element[], faculty, index) => {
    const Link = <FacultyLink data={{ educationType, faculty }} />
    if (index < faculties.length - 1) {
      acc.push(
        <li
          key={index}
          className={style.wrapper}
          style={
            {
              '--faculties-length': faculties.length,
            } as React.CSSProperties
          }
        >
          {Link}
          <span className={style.pipe}></span>
        </li>,
      )
    }
    if (index === faculties.length - 1) {
      acc.push(
        <li
          key={index}
          className={style.wrapper}
          style={
            {
              '--faculties-length': faculties.length,
            } as React.CSSProperties
          }
        >
          {Link}
        </li>,
      )
    }

    return acc
  }, [])

  return <ul className={style.container}>{facultyElements}</ul>
}
