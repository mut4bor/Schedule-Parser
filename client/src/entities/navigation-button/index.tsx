import * as style from './style.module.scss'
import { NavigationButtonProps } from './types'
import { SkeletonParagraph } from '@/shared/ui'

export const NavigationButton = ({ text, onClick, isActive, isSkeleton }: NavigationButtonProps) => {
  if (isSkeleton) {
    return <SkeletonParagraph style={{ height: '3rem', width: '10rem' }} />
  }
  return (
    <button onClick={onClick} className={`${style.button} ${isActive ? style.active : ''}`} type="button">
      {text}
    </button>
  )
}
