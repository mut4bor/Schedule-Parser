import * as style from './style.module.scss'
import { Skeleton } from '@/shared/ui'

interface Props {
  children?: React.ReactNode | undefined
}

export const GroupHeading = ({ children }: Props) => {
  if (!children) {
    return <Skeleton className={style.skeleton} />
  }

  return <p className={style.heading}>{children}</p>
}
