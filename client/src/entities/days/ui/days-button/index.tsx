import * as style from './style.module.scss'
import { DaysButtonProps } from './types'

export const DaysButton = ({
  data: { text },
  onClick,
  isActive,
}: DaysButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${style.button} ${isActive ? style.active : null}`}
      type="button"
    >
      {text}
    </button>
  )
}
