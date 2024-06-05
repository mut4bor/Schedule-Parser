import * as style from './style.module.scss'
import { FacultyHeadingProps } from './types'

export const FacultyHeading = (props: FacultyHeadingProps) => {
  const {
    data: { educationType },
  } = props
  return (
    <div className={style.container}>
      {/* <div className={style.flag}></div> */}
      <h2 className={style.heading}>{educationType}</h2>
    </div>
  )
}
