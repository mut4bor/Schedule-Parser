import * as style from './style.module.scss'
import { FacultyHeadingProps } from './types'

export const FacultyHeading = (props: FacultyHeadingProps) => {
  const {
    data: { educationType },
  } = props
  return <h2 className={style.heading}>{educationType}</h2>
}
