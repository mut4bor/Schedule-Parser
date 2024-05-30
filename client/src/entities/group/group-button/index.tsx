import * as style from './style.module.scss'
import { GroupButtonProps } from './types'

export const GroupButton = (props: GroupButtonProps) => {
  const { children, onClick } = props
  return (
    <button type="button" className={style.button} onClick={onClick}>
      {children}
    </button>
  )
}
