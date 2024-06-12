import * as style from './style.module.scss'
import { TabBarButtonProps } from './types'

export const TabBarButton = ({ text, onClick }: TabBarButtonProps) => {
  return (
    <button className={style.button} onClick={onClick}>
      {text}
    </button>
  )
}
