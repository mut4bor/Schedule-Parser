import * as style from './style.module.scss'
import { HeaderLoginButtonProps } from './types'

export const HeaderLoginButton = ({ onClick }: HeaderLoginButtonProps) => {
  return (
    <button className={style.button} onClick={onClick}>
      Войти
    </button>
  )
}
