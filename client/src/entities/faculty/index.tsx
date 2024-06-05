import * as style from './style.module.scss'
import { FacultyProps } from './types'
import { FacultyHeading } from './faculty-heading'
import { FacultyList } from './faculty-list'

export const Faculty = ({ data }: FacultyProps) => {
  return (
    <div className={style.container}>
      <FacultyHeading data={data} />
      <FacultyList data={data} />
    </div>
  )
}
