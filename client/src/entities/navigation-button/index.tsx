import * as style from './style.module.scss'
import { NavigationButtonProps } from './types'

export const NavigationButton = ({ text, onClick, isActive }: NavigationButtonProps) => {
  return (
    <button onClick={onClick} className={`${style.button} ${isActive ? style.active : ''}`} type="button">
      {text}
    </button>
  )
}
