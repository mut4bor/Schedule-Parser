import * as style from './style.module.scss'
import { useLogoutMutation } from '@/shared/redux'

export const HeaderLogoutButton = () => {
  const [logout] = useLogoutMutation()

  const handleLogout = () => {
    if (window.confirm('Вы уверены, что хотите выйти?')) {
      logout()
    }
  }

  return (
    <button className={style.button} onClick={handleLogout}>
      Выйти
    </button>
  )
}
