import * as style from './style.module.scss'
import { FacultyProps } from '../types'
import { FacultyLink } from '../faculty-link'

export const FacultyList = (props: FacultyProps) => {
  const {
    data: { educationType, faculties },
  } = props

  return (
    <div className={style.container}>
      {faculties.reduce((acc: JSX.Element[], faculty, index) => {
        acc.push(<FacultyLink data={{ educationType, faculty }} key={`faculty-${index}`} />)

        if (index < faculties.length - 1) {
          acc.push(<span className={style.pipe} key={`pipe-${index}`}></span>)
        }

        return acc
      }, [])}
    </div>
  )
}
