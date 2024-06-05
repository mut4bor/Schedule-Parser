import * as style from './style.module.scss'
import { FacultyHeadingProps } from './types'
import { SkeletonParagraph } from '@/shared/ui'

export const FacultyHeading = ({ data }: FacultyHeadingProps) => {
  const { educationType } = data || {}

  return (
    <div className={style.container}>
      {!data || !educationType ? <SkeletonParagraph /> : <h2 className={style.heading}>{educationType}</h2>}
    </div>
  )
}
