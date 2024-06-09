import * as style from './style.module.scss'
import { BackToPreviousButtonProps } from './types'

export const BackToPreviousButton = ({ onClick }: BackToPreviousButtonProps) => {
  return (
    <button onClick={onClick} className={style.button} type="button">
      Назад
    </button>
  )
}
