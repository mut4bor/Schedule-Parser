import * as style from './style.module.scss'
import { GroupDaysButtonProps } from './types'

export const GroupDaysButton = ({ data: { text }, onClick, isActive }: GroupDaysButtonProps) => {
  return (
    <button onClick={onClick} className={`${style.button} ${isActive ? style.active : ''}`} type="button">
      {text}
    </button>
  )
}
