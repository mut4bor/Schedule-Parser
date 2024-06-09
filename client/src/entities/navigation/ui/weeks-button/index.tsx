import * as style from './style.module.scss'
import { WeeksButtonProps } from './types'
import { Skeleton } from '@/shared/ui'

export const WeeksButton = ({ text, onClick, isActive, isSkeleton }: WeeksButtonProps) => {
  if (isSkeleton) {
    return <Skeleton className={style.skeleton} />
  }
  return (
    <button onClick={onClick} className={`${style.button} ${isActive ? style.active : ''}`} type="button">
      {text}
    </button>
  )
}
