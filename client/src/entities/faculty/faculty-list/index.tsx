import * as style from './style.module.scss'
import { FacultyProps } from '../types'
import { FacultyLink } from '../faculty-link'

export const FacultyList = (props: FacultyProps) => {
  const {
    data: { educationType, faculties },
  } = props

  return (
    <div className={style.container}>
      {faculties.map((faculty, key) => (
        <FacultyLink data={{ educationType, faculty }} key={key} />
      ))}
    </div>
  )
}
