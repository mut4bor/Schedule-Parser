import * as style from './style.module.scss'
import { GroupHeadingProps } from './types'
import { Skeleton } from '@/shared/ui'

export const GroupHeading = ({ text }: GroupHeadingProps) => {
  if (!text) {
    return <Skeleton className={style.skeleton} />
  }

  return <p className={style.heading}>{text}</p>
}
