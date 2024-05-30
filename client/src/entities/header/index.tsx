import { HeaderInput } from './header-input'
import * as style from './style.module.scss'
import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <header className={style.header}>
      <div className={style.container}>
        <Link to={'/'} title="На главную">
          <h1 className={style.heading}>Расписание НГУ им. Лесгафта</h1>
        </Link>
        <HeaderInput />
      </div>
    </header>
  )
}
