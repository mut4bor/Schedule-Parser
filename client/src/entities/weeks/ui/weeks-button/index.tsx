import * as style from './style.module.scss'
import { WeeksButtonProps } from './types'

export const WeeksButton = ({ text, onClick, isActive }: WeeksButtonProps) => {
  return (
    <button onClick={onClick} className={`${style.button} ${isActive ? style.active : ''}`} type="button">
      {text}
    </button>
  )
}
