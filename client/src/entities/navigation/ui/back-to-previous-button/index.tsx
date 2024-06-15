import * as style from './style.module.scss'
import { BackToPreviousButtonProps } from './types'

export const BackToPreviousButton = ({ onClick, text }: BackToPreviousButtonProps) => {
  return (
    <button onClick={onClick} className={style.button} type="button">
      {text ?? 'Назад'}
    </button>
  )
}
